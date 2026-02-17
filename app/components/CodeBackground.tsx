'use client'

import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useQuality } from '../context/QualityContext'
import { useIntro } from './context/IntroContext'


const SNIPPETS = [
    "import { Canvas, useFrame } from '@react-three/fiber'",
    "import { OrbitControls, Environment, useGLTF } from '@react-three/drei'",
    "function Scene() { return <Logo /> }",
    "const x = Math.sin(time) * 0.5",
    "<MeshReflectorMaterial blur={[400, 100]} resolution={2048} />",
    "export default function Page()",
    "const [hovered, set] = useState(false)",
    "useFrame((state, delta) => { ref.current.rotation.y += delta * 0.5 })",
    "// Optimization: GPU based particles system",
    "console.log('VRRGL System Initialized')",
    "interface Props { position: [number, number, number]; scale?: number }",
    "const { nodes, materials } = useGLTF('/model.glb')",
    "const vec = new THREE.Vector3(0, 0, 0)",
    "camera.position.lerp(vec, 0.1)",
    "gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);",
    "void main() { vec2 uv = vUv; }",
    "const material = new THREE.MeshStandardMaterial({ color: '#00ffff' })",
    "return <group dispose={null}>{children}</group>",
    "const { camera, gl } = useThree()",
    "gl.setPixelRatio(window.devicePixelRatio)",
    "type GLTFResult = GLTF & { nodes: Record<string, THREE.Mesh> }",
    "// TODO: Refactor lighting setup for better performance",
    "const spring = useSpring({ scale: active ? 1.5 : 1 })",
    "<EffectComposer><Bloom luminanceThreshold={1.1} /></EffectComposer>",
    "ambientLight intensity={0.5} color='#ffffff'",
    "spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow",
    "if (mesh.current) mesh.current.position.y = Math.sin(t)",
    "const roughness = 0.4; const metalness = 0.8;",
    "scene.background = new THREE.Color('#050505')",
    "import { VRRGL } from '@/lib/vrrgl-core'",
    "const handleClick = (e: ThreeEvent<MouseEvent>) => { e.stopPropagation() }",
    "return <Suspense fallback={<Loader />}>",
    "const data = useLoader(TextureLoader, '/texture.jpg')",
    "export const dynamic = 'force-dynamic'",
    "// Connecting to neural interface...",
    "const geometry = new THREE.BoxGeometry(1, 1, 1)",
    "mesh.current.material.uniforms.uTime.value = state.clock.elapsedTime",
    "attribute vec3 position;",
    "varying vec2 vUv;",
    "const PI = Math.PI;",
    "camera.lookAt(0, 0, 0)",
    "const [location, setLocation] = useLocation()",
    "// Initializing geometry buffers",
    "const columns = useMemo(() => Array.from({ length: 10 }), [])",
    "gl.toneMapping = THREE.NoToneMapping",
    "<Sparkles count={50} scale={5} color='#00ffff' />",
    "const target = new THREE.Vector3(0, -1.6, 0)",
    "useLayoutEffect(() => { scene.traverse(obj => { ... }) }, [])",
    "// System ready. Waiting for input.",
    "export interface State { count: number; theme: 'dark' | 'light' }"
]

function CodeColumn({ x, y, z, speed, opacity }: { x: number, y: number, z: number, speed: number, opacity: number }) {
    const group = useRef<THREE.Group>(null)

    const text = useMemo(() => {
        return Array.from({ length: 15 })
            .map(() => SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)])
            .join('\n')
    }, [])

    useFrame((state, delta) => {
        if (!group.current) return

        group.current.position.y += speed * delta

        if (group.current.position.y > 15) {
            group.current.position.y = -20
        }
    })

    return (
        <group ref={group} position={[x, y, z]}>
            <Text
                color="#00ffff"
                fontSize={0.2}
                font="/RobotoMono-Regular.ttf"
                anchorX="center"
                anchorY="middle"
                letterSpacing={-0.05}
                lineHeight={1.4}
                fillOpacity={opacity}
            >
                {text}
            </Text>
        </group>
    )
}

export function CodeBackground() {
    const { mode } = useQuality()
    const { booted } = useIntro() // <-- Получаем статус загрузки

    const columns = useMemo(() => [
        { x: -6, y: 0, z: -8, speed: 0.5, opacity: 0.12 },
        { x: -4, y: -10, z: -10, speed: 0.7, opacity: 0.08 },
        { x: -2, y: 5, z: -12, speed: 0.3, opacity: 0.05 },
        { x: 0, y: -5, z: -14, speed: 0.4, opacity: 0.04 },
        { x: 2, y: 8, z: -11, speed: 0.6, opacity: 0.06 },
        { x: 4, y: -2, z: -9, speed: 0.5, opacity: 0.1 },
        { x: 6, y: -12, z: -8, speed: 0.8, opacity: 0.12 },
    ], [])

    // Если режим Low ИЛИ система еще не загрузилась — скрываем код
    if (mode === 'low' || !booted) return null

    return (
        <>
            {columns.map((col, i) => (
                <CodeColumn key={i} {...col} />
            ))}
        </>
    )
}