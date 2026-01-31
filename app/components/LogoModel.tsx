import React, { useRef, useLayoutEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function LogoModel() {
    const { scene } = useGLTF('/logo.glb')
    const meshRef = useRef<THREE.Group>(null)

    // Настройка материалов ПЕРЕД отрисовкой
    useLayoutEffect(() => {
        scene.traverse((child) => {
            // Проверяем, является ли объект частью сетки (Mesh)
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh

                // Вращаем логотип для лучшего восприятия
                // mesh.rotation.x = -Math.PI / 2
                // mesh.rotation.y = Math.PI / 2

                // Создаем крутой материал "Кибер-металл"
                mesh.material = new THREE.MeshStandardMaterial({
                    color: '#1a1a1a',     // Темная основа
                    roughness: 0.1,       // Почти зеркальный (0 - зеркало, 1 - матовый)
                    metalness: 0.9,       // Очень металлический
                    emissive: '#00ffff',  // Легкое свечение (цвет циана)
                    emissiveIntensity: 0.2 // Сила свечения (поиграй с этим числом: 0 = выкл)
                })

                mesh.castShadow = true
                mesh.receiveShadow = true
            }
        })
    }, [scene])

    // Анимация: Вращение каждый кадр
    useFrame((state, delta) => {
        if (meshRef.current) {
            // meshRef.current.rotation.y += delta * 0.2 // Медленное вращение вокруг оси Y
            // Добавим легкое покачивание, как будто он левитирует
            // meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
        }
    })

    return <primitive ref={meshRef} object={scene} scale={1} />
}

useGLTF.preload('/logo.glb')