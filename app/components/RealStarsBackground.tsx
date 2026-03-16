'use client'

import { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { RGBELoader } from 'three-stdlib'
import { useIntro } from '../context/IntroContext'

export function RealStarsBackground() {
    // Загружаем HDR-текстуру звездного неба
    // Убедитесь, что файл /real-stars.hdr находится в папке public/
    const texture = useLoader(RGBELoader, '/real-stars.hdr')
    const { flightFinished } = useIntro()
    const materialRef = useRef<THREE.MeshBasicMaterial>(null)
    const sphereRef = useRef<THREE.Mesh>(null)

    useFrame((_, delta) => {
        if (materialRef.current) {
            // Плавно проявляем небо после завершения полета логотипа
            const targetOpacity = flightFinished ? 1 : 0
            materialRef.current.opacity = THREE.MathUtils.lerp(
                materialRef.current.opacity,
                targetOpacity,
                delta * 1.5
            )
        }

        // Добавляем микро-вращение сферы для эффекта «живого» космоса
        if (sphereRef.current && flightFinished) {
            sphereRef.current.rotation.y += delta * 0.01
        }
    })

    return (
        <mesh ref={sphereRef}>
            {/* Огромная сфера, которая охватывает всю сцену */}
            <sphereGeometry args={[100, 64, 64]} />
            <meshBasicMaterial
                ref={materialRef}
                map={texture}
                side={THREE.BackSide}    // Рендерим текстуру на внутренней стороне сферы
                transparent={true}
                opacity={0}              // Изначально прозрачная
                depthWrite={false}       // Не пишем в буфер глубины, чтобы всегда быть фоном
                fog={false}              // ВАЖНО: отключаем влияние черного тумана сцены на скайбокс
                toneMapped={true}        // Используем ACESFilmic сцены для красивого отображения HDR
            />
        </mesh>
    )
}
