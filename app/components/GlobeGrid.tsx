'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'

export function GlobeGrid() {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.05
        }
    })

    // Наш ядерный синий цвет
    // Используем те же значения, что и для континентов: [R=0, G=10, B=40]
    const neonColor = new THREE.Color(0, 10, 40)

    return (
        <mesh ref={meshRef} scale={1 }>    //
            {/* Геометрия-болванка */}
            <sphereGeometry args={[1, 36, 18]} />
            <meshBasicMaterial visible={false} />

            {/* ИСПРАВЛЕНИЕ:
         Мы убрали <lineBasicMaterial> изнутри.
         Вместо этого передаем все настройки неона прямо в пропсы Edges.
      */}
            <Edges
                scale={0.4}     //
                threshold={0.5}   //

                // 1. Передаем цвет напрямую сюда
                color={neonColor}

                // 2. ВАЖНО: Отключаем toneMapping для этого компонента, чтобы он светился
                toneMapped={false}

                // 3. Настраиваем прозрачность
                transparent={true}
                opacity={0.1} // Чуть приглушил сетку, чтобы континенты были ярче

                // Можно настроить толщину, но в большинстве браузеров она всё равно будет 1
                linewidth={1}
            />
        </mesh>
    )
}