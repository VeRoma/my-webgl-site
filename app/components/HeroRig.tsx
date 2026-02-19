'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export function HeroRig({ children }: { children: React.ReactNode }) {
    const group = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        if (!group.current) return

        // Берем готовые нормализованные координаты мыши от -1 до 1
        const targetX = -state.pointer.y / 8
        const targetY = state.pointer.x / 8

        // THREE.MathUtils.lerp делает движение маслянисто-плавным
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 3 * delta)
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 3 * delta)
    })

    return <group ref={group}>{children}</group>
}