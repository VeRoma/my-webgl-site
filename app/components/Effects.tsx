'use client'

import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useMemo, useState } from 'react'
import { useQuality } from '../context/QualityContext'
import { useIntro } from '../context/IntroContext'
import { useFrame } from '@react-three/fiber'

export function Effects() {
    const { postProcessing } = useQuality()
    const { entered } = useIntro()
    const [intensity, setIntensity] = useState(1.0)

    // Создаем вектор один раз
    const aberrationOffset = useMemo(() => new THREE.Vector2(0.0005, 0.0005), [])

    useFrame((_, delta) => {
        const targetIntensity = entered ? 0.1 : 1.0
        // Плавное изменение через lerp в состоянии
        if (Math.abs(intensity - targetIntensity) > 0.01) {
            setIntensity(THREE.MathUtils.lerp(intensity, targetIntensity, 2 * delta))
        }
    })

    if (!postProcessing) return null

    return (
        <EffectComposer>
            <Bloom
                luminanceThreshold={0.8}
                mipmapBlur
                intensity={intensity}
                radius={0.6}
            />
            <ChromaticAberration
                offset={aberrationOffset}
            />
        </EffectComposer>
    )
}