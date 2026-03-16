'use client'

import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

import starData from '../data/bsc_2.json'

function bv2rgb(bv: number) {
    let r = 0, g = 0, b = 0;
    if (bv < 0) { r = 0.6; g = 0.7; b = 1.0; }
    else if (bv < 0.5) { r = 1.0; g = 1.0; b = 1.0; }
    else if (bv < 1.0) { r = 1.0; g = 0.9; b = 0.7; }
    else { r = 1.0; g = 0.5; b = 0.5; }
    return [r, g, b];
}

export function RealStars() {
    const meshRef = useRef<THREE.InstancedMesh>(null)

    const { positions, colors, scales, count } = useMemo(() => {
        const stars = starData.stars
        const validStars = []

        // === НАСТРОЙКИ МАСШТАБА СЦЕНЫ ===
        const RADIUS = 400;         // Было 2000. Теперь звезды ближе.
        const SCALE_FACTOR = 0.0004; // Было 0.002. Уменьшили в 5 раз, так как приблизили в 5 раз.
        // ================================

        for (let i = 0; i < stars.length; i++) {
            const st = stars[i]
            const vmag = parseFloat(st.vmag)

            if (vmag > 3.5) continue

            const ra = (parseFloat(st.RA[0]) / 24 + parseFloat(st.RA[1]) / (24 * 60) + parseFloat(st.RA[2]) / (24 * 60 * 60)) * 2 * Math.PI
            let de = (parseFloat(st.DE[1]) / 360 + parseFloat(st.DE[2]) / (360 * 60) + parseFloat(st.DE[3]) / (360 * 60 * 60)) * 2 * Math.PI
            if (st.DE[0] === '-') de = -de

            // Используем наш новый радиус
            const sx = RADIUS * Math.cos(de) * Math.cos(ra)
            const sy = RADIUS * Math.cos(de) * Math.sin(ra)
            const sz = RADIUS * Math.sin(de)

            if (isNaN(sx) || isNaN(sy) || isNaN(sz)) continue

            const osize = 600 * Math.pow(1.35, Math.min(-vmag, 0.15))
            const bv = parseFloat(st.bv || "0")
            const rgb = bv2rgb(bv)

            validStars.push({ x: sy, y: sz, z: sx, size: osize, color: rgb })
        }

        const count = validStars.length
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const scales = new Float32Array(count * 3)

        validStars.forEach((star, i) => {
            positions[i * 3] = star.x
            positions[i * 3 + 1] = star.y
            positions[i * 3 + 2] = star.z

            colors[i * 3] = star.color[0]
            colors[i * 3 + 1] = star.color[1]
            colors[i * 3 + 2] = star.color[2]

            // Применяем новый масштаб к размеру звезды
            scales[i * 3] = star.size * SCALE_FACTOR
            scales[i * 3 + 1] = star.size * SCALE_FACTOR
            scales[i * 3 + 2] = star.size * SCALE_FACTOR
        })

        return { positions, colors, scales, count }
    }, [])

    useEffect(() => {
        if (!meshRef.current) return

        const dummy = new THREE.Object3D()
        const color = new THREE.Color()

        for (let i = 0; i < count; i++) {
            dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
            dummy.scale.set(scales[i * 3], scales[i * 3 + 1], scales[i * 3 + 2])
            dummy.updateMatrix()

            meshRef.current.setMatrixAt(i, dummy.matrix)

            color.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
            meshRef.current.setColorAt(i, color)
        }

        meshRef.current.instanceMatrix.needsUpdate = true
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true
        }
    }, [count, positions, scales, colors])

    return (
        <group>
            {/* 1. Отключаем frustumCulled, чтобы Three.js не прятал разбросанные инстансы */}
            <instancedMesh ref={meshRef} args={[null as any, null as any, count]} frustumCulled={false}>
                <sphereGeometry args={[1, 8, 8]} />
                {/* 2. Отключаем влияние черного тумана (fog={false}) */}
                <meshBasicMaterial toneMapped={false} fog={false} />
            </instancedMesh>
        </group>
    )
}