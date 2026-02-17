'use client'

import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useMemo } from 'react'
import { useQuality } from '../context/QualityContext'

export function Effects() {
    const { postProcessing } = useQuality()

    // Создаем вектор один раз
    const aberrationOffset = useMemo(() => new THREE.Vector2(0.0005, 0.0005), [])

    if (!postProcessing) return null

    return (
        <EffectComposer>
            <Bloom
                luminanceThreshold={0.8}
                mipmapBlur
                intensity={1.0}
                radius={0.6}
            />
            <ChromaticAberration
                offset={aberrationOffset}
            />
        </EffectComposer>
    )
}