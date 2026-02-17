'use client'

import { LogoModel } from './LogoModel'
import { GlobeModel } from './GlobeModel'
import { GlobeGrid } from './GlobeGrid'
import { HeroRig } from './HeroRig'
import { useIntro } from './context/IntroContext' // Импорт контекста
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export function HeroAsset() {
    // Получаем состояние: загрузилась система или нет?
    const { booted } = useIntro()
    const group = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        if (!group.current) return

        // Если booted = true, масштаб -> 1. Если false -> 0.
        const targetScale = booted ? 1 : 0

        // Плавная анимация (Lerp)
        const currentScale = group.current.scale.x
        const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 4 * delta)

        group.current.scale.setScalar(nextScale)
    })

    return (
        <group position={[0, -1.6, 0]}>
            <HeroRig>
                {/* Эту группу мы скейлим (увеличиваем) при загрузке */}
                <group ref={group} scale={[0, 0, 0]}>
                    {/* Логотип */}
                    <group rotation={[0, -Math.PI / 2, 0]} position={[0.1, 0, 0.35]}>
                        <LogoModel />
                    </group>

                    {/* Глобус и Сетка */}
                    <group position={[0, 0.4, 0]}>
                        <GlobeModel />
                        <GlobeGrid />
                    </group>
                </group>
            </HeroRig>
        </group>
    )
}