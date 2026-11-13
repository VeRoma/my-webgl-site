'use client'

import { useGLTF } from '@react-three/drei'
import { useLayoutEffect, useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useIntro } from '../context/IntroContext'

export function GlobeModel() {
    // Загружаем твой файл
    const { scene } = useGLTF('/globe.glb')
    const clonedScene = useMemo(() => scene.clone(), [scene])
    const meshRef = useRef<THREE.Group>(null)
    const { entered } = useIntro()
    const speedRef = useRef(0.05)
    const { viewport } = useThree()

    useLayoutEffect(() => {
        // Проходимся по всем объектам внутри файла
        clonedScene.traverse((obj) => {
            // Ищем именно линии (Line или LineSegments)
            if ((obj as THREE.Line).isLine || (obj as THREE.LineSegments).isLineSegments) {
                const line = obj as THREE.Line

                // === МАГИЯ НЕОНА ===
                line.material = new THREE.LineBasicMaterial({
                    color: new THREE.Color(0, 10, 40),
                    transparent: true,
                    opacity: 0,         
                    linewidth: 1,
                    toneMapped: false,
                })
            }
        })
    }, [clonedScene])

    // Анимация: Медленное вращение Земли и плавное появление
    useFrame((_, delta) => {
        if (meshRef.current) {
            const targetSpeed = entered ? 0.033 : 0.05
            speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, 2 * delta)
            meshRef.current.rotation.y += delta * speedRef.current

            // ПЛАВНАЯ МАТЕРИАЛИЗАЦИЯ
            if (entered) {
                clonedScene.traverse((obj) => {
                    if ((obj as THREE.Line).isLine || (obj as THREE.LineSegments).isLineSegments) {
                        const line = obj as THREE.Line
                        if (line.material) {
                            const mat = line.material as THREE.LineBasicMaterial
                            mat.opacity = THREE.MathUtils.lerp(mat.opacity, 1, 0.5 * delta)
                        }
                    }
                })
            }
        }
    })

    const scale = viewport.aspect < 1 ? 0.03 : 0.045

    return (
        <group ref={meshRef}>
            <primitive object={clonedScene} scale={scale} />
        </group>
    )
}

useGLTF.preload('/globe.glb')
