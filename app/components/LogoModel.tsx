import React, { useRef, useLayoutEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useIntro } from '../context/IntroContext'

export function LogoModel() {
    const { scene } = useGLTF('/logo.glb')
    const meshRef = useRef<THREE.Group>(null)
    const { viewport } = useThree()
    const { entered } = useIntro()

    // Клонируем сцену для избежания мутаций кэша и HMR багов
    const clonedScene = useMemo(() => scene.clone(), [scene])

    // Настройка материалов ПЕРЕД отрисовкой
    useLayoutEffect(() => {
        clonedScene.traverse((child) => {
            // Проверяем, является ли объект частью сетки (Mesh)
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh

                mesh.material = new THREE.MeshPhysicalMaterial({
                    color: '#000000',        // Абсолютно черный цвет
                    roughness: 0.15,         // Немного матовый, чтобы блики "растекались"
                    metalness: 0.9,          // 100% металл

                    // Убираем собственное свечение, пусть работает внешний свет!
                    emissive: '#00ccff',
                    emissiveIntensity: 0.3,

                    // Добавляем слой "лака" для двойных бликов
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.1,

                    // ДЗЕН-МАТЕРИАЛИЗАЦИЯ: Делаем изначально полностью прозрачным
                    transparent: true,
                    opacity: 0
                })
                mesh.castShadow = true
                mesh.receiveShadow = true
            }
        })
    }, [clonedScene])

    // Анимация: Вращение и плавное появление
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Добавим легкое покачивание, как будто он левитирует в невесомости
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
            
            // ПЛАВНАЯ МАТЕРИАЛИЗАЦИЯ
            if (entered) {
                clonedScene.traverse((child) => {
                    const mesh = child as THREE.Mesh
                    if (mesh.isMesh && mesh.material) {
                        const mat = mesh.material as THREE.MeshPhysicalMaterial
                        mat.opacity = THREE.MathUtils.lerp(mat.opacity, 1, 0.5 * delta)
                    }
                })
            }
        }
    })

    const scale = viewport.aspect < 1 ? 0.7 : 1.0

    return <primitive ref={meshRef} object={clonedScene} scale={scale} />
}

useGLTF.preload('/logo.glb')
