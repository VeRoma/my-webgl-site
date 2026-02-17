'use client'

import { Environment } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

export function EnvironmentSetup() {
    const { scene } = useThree()

    useEffect(() => {
        scene.backgroundBlurriness = 0.2
        scene.backgroundIntensity = 0.02
    }, [scene])

    return (
        <Environment
            files="/city-sh.hdr" // Ваш файл
            background={false}   // Обязательно false!
        />
    )
}