'use client'

import { Environment } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useEffect } from 'react'

export function EnvironmentSetup() {
    const { scene } = useThree()

    useEffect(() => {
        // Настройки самого "мира" Three.js

        // Размытие фона для создания глубины
        // scene.backgroundBlurriness = 0.8
        scene.backgroundBlurriness = 0.2

        // Интенсивность освещения от HDRI
        // scene.backgroundIntensity = 0.02
        scene.backgroundIntensity = 0.02

        // Можно добавить другие глобальные настройки сцены здесь
        // Например, туман, глобальное освещение и т.д.

        // scene.background = new THREE.Color('#020202')


    }, [scene])

    return (
        // files="/studio.hdr" — убедись, что файл лежит в public
        <Environment files="/city-sh.hdr" background={false} />
    )
}