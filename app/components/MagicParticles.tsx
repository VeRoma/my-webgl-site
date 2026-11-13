'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three-stdlib'
import { useControls, button } from 'leva'
import { useGLTF } from '@react-three/drei'
import { useIntro } from '../context/IntroContext'
import { globeState } from '../store/globeStore'

const WIDTH = 256

const PARTICLES_COUNT = WIDTH * WIDTH

// Birth timeline (seconds after boot): the swirl alone, then the particles land on the continents
const BIRTH_START = 1.5
const BIRTH_DURATION = 5.0
// Transform of the swirling cloud (was the scale/rotation of <points>): a flat tilted disk
const CLOUD_MATRIX = new THREE.Matrix4().compose(
    new THREE.Vector3(0, 0, 0),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0, -0.2)),
    new THREE.Vector3(1.8, 0.3, 1.2),
)

/** One landing point per particle, spread along the globe's continent outlines (glb space). */
function buildTargets(scene: THREE.Object3D): Float32Array {
    const segments: number[] = []
    scene.updateMatrixWorld(true)
    const a = new THREE.Vector3()
    const b = new THREE.Vector3()
    scene.traverse((obj) => {
        const line = obj as THREE.LineSegments
        if (!line.isLine && !line.isLineSegments) return
        const pos = line.geometry.getAttribute('position')
        const index = line.geometry.getIndex()
        const count = index ? index.count : pos.count
        const at = (i: number) => (index ? index.getX(i) : i)
        for (let i = 0; i + 1 < count; i += 2) {
            a.fromBufferAttribute(pos, at(i)).applyMatrix4(line.matrixWorld)
            b.fromBufferAttribute(pos, at(i + 1)).applyMatrix4(line.matrixWorld)
            segments.push(a.x, a.y, a.z, b.x, b.y, b.z)
        }
    })
    const n = segments.length / 6
    const cumulative = new Float32Array(n)
    let total = 0
    for (let i = 0; i < n; i++) {
        const k = i * 6
        total += Math.hypot(segments[k + 3] - segments[k], segments[k + 4] - segments[k + 1], segments[k + 5] - segments[k + 2])
        cumulative[i] = total
    }
    const out = new Float32Array(PARTICLES_COUNT * 4)
    for (let p = 0; p < PARTICLES_COUNT; p++) {
        out[p * 4 + 3] = 1
        if (n === 0) continue
        // Segment picked proportionally to its length (binary search over the cumulative lengths)
        const r = Math.random() * total
        let lo = 0
        let hi = n - 1
        while (lo < hi) {
            const mid = (lo + hi) >> 1
            if (cumulative[mid] < r) lo = mid + 1
            else hi = mid
        }
        const k = lo * 6
        const t = Math.random()
        out[p * 4 + 0] = segments[k] + (segments[k + 3] - segments[k]) * t
        out[p * 4 + 1] = segments[k + 1] + (segments[k + 4] - segments[k + 1]) * t
        out[p * 4 + 2] = segments[k + 2] + (segments[k + 5] - segments[k + 2]) * t
    }
    return out
}

const computeVelocityShader = `
    uniform float uDelta;
    uniform float uGravity;
    uniform float uVortex;
    uniform float uVacuum;
    uniform float uCoreFriction; 
    uniform float uGlobalFriction;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec3 pos = texture2D(texturePosition, uv).xyz;
        vec3 vel = texture2D(textureVelocity, uv).xyz;

        vec3 dir = -pos; 
        float dist = length(dir);
        
        if (dist > 0.05) {
            vec3 dirNorm = normalize(dir);
            
            // 1. Честная ньютоновская гравитация (закон обратных квадратов)
            // Смягчение +0.5 защищает от бесконечного ускорения в самом центре
            float force = uGravity / (dist * dist + 0.5);
            vel += dirNorm * force * uDelta;

            // 2. Легкое закручивание (оставим для опциональной спиральности)
            vec3 up = vec3(0.0, 1.0, 0.0);
            vec3 vortexDir = normalize(cross(dirNorm, up));
            vel += vortexDir * uVortex * uDelta;
            
            // 3. Прямая тяга (всасывание)
            vel += dirNorm * uVacuum * uDelta;
            
            // 4. ТОРМОЖЕНИЕ В ЦЕНТРЕ: радиус ядра 1.5.
            // Чем ближе к нулю, тем сильнее гасится скорость, 
            // чтобы разогнанные частицы плавно оседали, а не улетали обратно в космос.
            float coreDamping = smoothstep(1.5, 0.0, dist); 
            vel *= (1.0 - coreDamping * uCoreFriction * uDelta);
        } else {
            // Если частица в самом центре - останавливаем ее полностью
            vel = vec3(0.0);
            pos = vec3(0.0); 
        }

        // Общее космическое трение (потеря орбитальной энергии = угасание эллипсов)
        vel *= (1.0 - uGlobalFriction * uDelta);

        gl_FragColor = vec4(vel, 1.0);
    }
`

const computePositionShader = `
    uniform float uDelta;
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec3 pos = texture2D(texturePosition, uv).xyz;
        vec3 vel = texture2D(textureVelocity, uv).xyz;

        // Обновляем позицию на основе скорости и времени
        pos += vel * uDelta;

        gl_FragColor = vec4(pos, 1.0);
    }
`

const fillTextures = (texturePosition: THREE.DataTexture, textureVelocity: THREE.DataTexture) => {
    const posArray = texturePosition.image.data as Float32Array
    const velArray = textureVelocity.image.data as Float32Array

    const baseGravity = 800.0 // Базовая гравитация для Кеплеровских расчетов

    for (let k = 0, kl = posArray.length; k < kl; k += 4) {
        // Случайная позиция в объеме сферы (сгущение к центру благодаря Math.random())
        const phi = Math.random() * Math.PI * 2
        const costheta = Math.random() * 2 - 1
        const theta = Math.acos(costheta)
        
        const r = Math.random() * 12.0

        const x = r * Math.sin(theta) * Math.cos(phi)
        const y = r * Math.sin(theta) * Math.sin(phi)
        const z = r * Math.cos(theta)

        posArray[k + 0] = x
        posArray[k + 1] = y
        posArray[k + 2] = z
        posArray[k + 3] = 1.0

        const posVec = new THREE.Vector3(x, y, z)
        
        // Каждой частице даем слегка наклоненную случайную ось вращения,
        // чтобы эллипсы пересекались в разных плоскостях (формируя 3D-облако)
        const tiltX = (Math.random() - 0.5) * 1.5
        const tiltZ = (Math.random() - 0.5) * 1.5
        const upVec = new THREE.Vector3(tiltX, 1.0, tiltZ).normalize()
        
        if (Math.abs(costheta) > 0.99) {
            upVec.set(1, 0, 0)
        }
        
        const tangent = new THREE.Vector3().crossVectors(posVec, upVec).normalize()
        
        // Вычисляем первую космическую скорость для идеальной круговой орбиты: v = sqrt(G*M/r)
        const circularSpeed = Math.sqrt(baseGravity / (r + 0.1))
        
        // ГЕНЕРАЦИЯ ЭЛЛИПСОВ: умножаем скорость на коэффициент (0.3 - 0.9).
        // Поскольку скорость МЕНЬШЕ круговой, частицы начнут "падать" к центру, 
        // разгоняясь и образуя красивые вытянутые орбиты.
        const eccentricityMult = 0.3 + Math.random() * 0.6
        const speed = circularSpeed * eccentricityMult

        tangent.multiplyScalar(speed)

        velArray[k + 0] = tangent.x
        velArray[k + 1] = tangent.y
        velArray[k + 2] = tangent.z
        velArray[k + 3] = 1.0
    }
}

export function MagicParticles() {
    const { gl } = useThree()
    const { booted, entered, setEntered } = useIntro()
    const birthTime = useRef(0)
    const { scene: globeScene } = useGLTF('/globe.glb')
    const targetTexture = useMemo(() => {
        const tex = new THREE.DataTexture(buildTargets(globeScene), WIDTH, WIDTH, THREE.RGBAFormat, THREE.FloatType)
        tex.needsUpdate = true
        return tex
    }, [globeScene])
    const globeMatrix = useMemo(() => new THREE.Matrix4(), [])
    const scaleMatrix = useMemo(() => new THREE.Matrix4(), [])
    const materialRef = useRef<THREE.ShaderMaterial>(null)
    const gpuComputeRef = useRef<GPUComputationRenderer | null>(null)
    const frameCount = useRef(0)
    
    // Используем eslint-disable для обхода строгой типизации внутренних классов three-stdlib
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const positionVariableRef = useRef<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const velocityVariableRef = useRef<any>(null)

    const [restartTrigger, setRestartTrigger] = useState(0)

    const physics = useControls('GPGPU Physics', {
        gravity: { value: 800, min: 0, max: 2000, step: 10 },
        vortex: { value: 0.0, min: 0, max: 50, step: 0.1 },
        vacuum: { value: 0.0, min: 0, max: 50, step: 0.1 },
        coreFriction: { value: 12.0, min: 0, max: 50, step: 0.5 },
        globalFriction: { value: 0.15, min: 0, max: 5, step: 0.01 },
        Restart: button(() => setRestartTrigger(prev => prev + 1))
    })

    useEffect(() => {
        if (restartTrigger > 0) {
            if (gpuComputeRef.current && positionVariableRef.current && velocityVariableRef.current) {
                const posTex = positionVariableRef.current.initialValueTexture as THREE.DataTexture
                const velTex = velocityVariableRef.current.initialValueTexture as THREE.DataTexture
                
                fillTextures(posTex, velTex)
                birthTime.current = 0
                posTex.needsUpdate = true
                velTex.needsUpdate = true
                
                const error = gpuComputeRef.current.init()
                if (error !== null) {
                    console.error('GPUComputationRenderer re-init error:', error)
                }
            }
        }
    }, [restartTrigger])

    // Массив UV-координат (reference) для связи вершин буфера с пикселями DataTexture
    const reference = useMemo(() => {
        const ref = new Float32Array(PARTICLES_COUNT * 2)
        for (let i = 0; i < PARTICLES_COUNT; i++) {
            const x = (i % WIDTH) / WIDTH
            const y = Math.floor(i / WIDTH) / WIDTH
            ref[i * 2 + 0] = x
            ref[i * 2 + 1] = y
        }
        return ref
    }, [])

    const uniforms = useMemo(() => ({
        uTexturePosition: { value: null },
        uTextureTarget: { value: targetTexture },
        uCloudMatrix: { value: CLOUD_MATRIX },
        uGlobeMatrix: { value: globeMatrix },
        uProgress: { value: 0 },
    }), [targetTexture, globeMatrix])

    useEffect(() => {
        // Инициализация вычислительного рендерера GPU
        const gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, gl)
        
        const dtPosition = gpuCompute.createTexture()
        const dtVelocity = gpuCompute.createTexture()

        // Заполняем начальные данные сферического спавна с эллиптическими орбитами
        fillTextures(dtPosition, dtVelocity)

        const velocityVariable = gpuCompute.addVariable('textureVelocity', computeVelocityShader, dtVelocity)
        const positionVariable = gpuCompute.addVariable('texturePosition', computePositionShader, dtPosition)

        // Устанавливаем циклические зависимости переменных друг от друга
        gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable])
        gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable])

        velocityVariable.material.uniforms.uDelta = { value: 0.0 }
        
        // Задаем базовые значения, соответствующие чистой ньютоновской физике орбит
        velocityVariable.material.uniforms.uGravity = { value: 800.0 }
        velocityVariable.material.uniforms.uVortex = { value: 0.0 }
        velocityVariable.material.uniforms.uVacuum = { value: 0.0 }
        velocityVariable.material.uniforms.uCoreFriction = { value: 12.0 }
        velocityVariable.material.uniforms.uGlobalFriction = { value: 0.15 }
        
        positionVariable.material.uniforms.uDelta = { value: 0.0 }

        const error = gpuCompute.init()
        if (error !== null) {
            console.error('GPUComputationRenderer init error:', error)
        }

        gpuComputeRef.current = gpuCompute
        positionVariableRef.current = positionVariable
        velocityVariableRef.current = velocityVariable
        
    }, [gl])

    useFrame((_, delta) => {
        if (!gpuComputeRef.current || !positionVariableRef.current || !velocityVariableRef.current) return

        frameCount.current += 1

        // Birth progress: starts after boot; a click/scroll (entered) speeds it up 3x
        if (booted) birthTime.current += Math.min(delta, 0.05) * (entered ? 3 : 1)
        const progress = THREE.MathUtils.clamp((birthTime.current - BIRTH_START) / BIRTH_DURATION, 0, 1)
        if (progress >= 1 && !entered) setEntered(true)

        // Landing points follow the globe: same spin and scale as GlobeModel
        scaleMatrix.makeScale(globeState.scale, globeState.scale, globeState.scale)
        globeMatrix.makeRotationY(globeState.spin).multiply(scaleMatrix)
        if (materialRef.current) materialRef.current.uniforms.uProgress.value = progress

        // Every particle has landed: the orbit simulation is not needed any more
        if (progress >= 1 && materialRef.current?.uniforms.uTexturePosition.value) return

        // Ждем 60 кадров (примерно 1 секунда), пока браузер отрендерит сцену и скомпилирует шейдеры.
        const isReady = frameCount.current > 60
        const safeDelta = isReady ? Math.min(delta, 0.05) : 0.0

        // Обновляем uniforms физики из Leva
        const velMat = velocityVariableRef.current.material
        velMat.uniforms.uDelta.value = safeDelta
        velMat.uniforms.uGravity.value = physics.gravity
        velMat.uniforms.uVortex.value = physics.vortex
        velMat.uniforms.uVacuum.value = physics.vacuum
        velMat.uniforms.uCoreFriction.value = physics.coreFriction
        velMat.uniforms.uGlobalFriction.value = physics.globalFriction

        positionVariableRef.current.material.uniforms.uDelta.value = safeDelta

        // Вычисляем новый кадр физики на GPU
        gpuComputeRef.current.compute()

        // Передаем текстуру с новыми позициями в материал частиц для рендера
        if (materialRef.current) {
            const currentPositionTexture = gpuComputeRef.current.getCurrentRenderTarget(positionVariableRef.current).texture
            materialRef.current.uniforms.uTexturePosition.value = currentPositionTexture
        }
    })

    return (
        // frustumCulled={false} обязателен для GPGPU, так как реальные позиции вычисляются в шейдере,
        // а базовый boundingBox состоит из нулей.
        <points frustumCulled={false}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array(PARTICLES_COUNT * 3), 3]}
                />
                <bufferAttribute
                    attach="attributes-reference"
                    args={[reference, 2]}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={uniforms}
                vertexShader={`
                    uniform sampler2D uTexturePosition;
                    uniform sampler2D uTextureTarget;
                    uniform mat4 uCloudMatrix;
                    uniform mat4 uGlobeMatrix;
                    uniform float uProgress;
                    attribute vec2 reference;
                    varying float vAlpha;

                    float hash(vec2 p) {
                        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                    }

                    void main() {
                        // Orbiting position (GPGPU) in the tilted disk, and the landing point on a continent
                        vec3 orbit = (uCloudMatrix * vec4(texture2D(uTexturePosition, reference).xyz, 1.0)).xyz;
                        vec3 target = (uGlobeMatrix * vec4(texture2D(uTextureTarget, reference).xyz, 1.0)).xyz;

                        // Each particle starts at its own moment and flies for half of the birth time
                        float delay = hash(reference) * 0.5;
                        float p = clamp((uProgress - delay) / 0.5, 0.0, 1.0);
                        float e = p * p * (3.0 - 2.0 * p);

                        // Spiral path: an extra turn around Y that is zero at both ends
                        vec3 pos = mix(orbit, target, e);
                        float angle = 4.0 * e * (1.0 - e) * (hash(reference.yx) + 0.5);
                        float c = cos(angle);
                        float s = sin(angle);
                        pos = vec3(c * pos.x + s * pos.z, pos.y, -s * pos.x + c * pos.z);

                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        gl_Position = projectionMatrix * mvPosition;

                        // Landed particles get smaller and dimmer: glowing dust on the continent lines
                        gl_PointSize = mix(6.0, 1.5, e);
                        vAlpha = mix(1.0, 0.12, e);
                    }
                `}
                fragmentShader={`
                    varying float vAlpha;

                    void main() {
                        // Мягкий светящийся круг (простая SDF-функция)
                        float d = distance(gl_PointCoord, vec2(0.5));
                        float strength = 0.05 / d - 0.1;
                        strength = clamp(strength, 0.0, 1.0);

                        // Эпичный циановый цвет, как в промпте Дзен-материализации
                        vec3 color = vec3(0.0, 0.8, 1.0);
                        gl_FragColor = vec4(color, strength * vAlpha);
                    }
                `}
            />
        </points>
    )
}
