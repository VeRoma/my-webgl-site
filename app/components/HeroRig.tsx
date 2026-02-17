'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export function HeroRig({ children }: { children: React.ReactNode }) {
    const group = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        // ВАЖНО: Никаких useState, никаких new Vector3.
        // Работаем напрямую с мутабельными свойствами three.js
        if (!group.current) return

        // state.pointer - это уже готовые нормализованные координаты (-1..1)
        // Делим на 8, чтобы угол поворота был мягким (не 45 градусов, а меньше)
        const targetX = -state.pointer.y / 8
        const targetY = state.pointer.x / 8

        // Используем delta для framerate-independent анимации
        // (на 144hz и 60hz скорость будет визуально одинаковой)
        // lerp(текущее, цель, скорость)
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 2 * delta)
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 2 * delta)
    })

    return <group ref={group}>{children}</group>
}