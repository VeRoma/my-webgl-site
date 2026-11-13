'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import * as THREE from 'three'
import { useIntro } from '../context/IntroContext'

export function GlobeGrid() {
    const meshRef = useRef<THREE.Mesh>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const edgesRef = useRef<any>(null)
    
    const { entered } = useIntro()
    const speedRef = useRef(0.05)
    const { viewport } = useThree()

    useFrame((_, delta) => {
        if (meshRef.current) {
            // Плавный переход к новой скорости
            const targetSpeed = entered ? 0.01 : 0.05
            speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, 2 * delta)
            meshRef.current.rotation.y += delta * speedRef.current
        }

        // ПЛАВНАЯ МАТЕРИАЛИЗАЦИЯ СЕТКИ
        if (entered && edgesRef.current && edgesRef.current.material) {
            const mat = edgesRef.current.material as THREE.Material
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, 1, 0.5 * delta)
        }
    })

    // Наш ядерный синий цвет
    const neonColor = new THREE.Color(0, 10, 40)
    const scale = viewport.aspect < 1 ? 0.66 : 1

    return (
        <mesh ref={meshRef} scale={scale}>
            {/* Геометрия-болванка */}
            <sphereGeometry args={[1, 36, 18]} />
            <meshBasicMaterial visible={false} />

            <Edges
                ref={edgesRef}
                scale={0.4}     
                threshold={1}   
                color={neonColor}
                toneMapped={false}
                transparent={true}
                opacity={0} 
                linewidth={1}
            />
        </mesh>
    )
}
