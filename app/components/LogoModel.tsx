import React from 'react'
import { useGLTF } from '@react-three/drei'

export function LogoModel() {
    // Путь указывается от папки public
    const { scene } = useGLTF('/logo.glb')

    return <primitive object={scene} scale={1} />
}

// Предварительная загрузка модели для ускорения
useGLTF.preload('/logo.glb')