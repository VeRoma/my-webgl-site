'use client'

import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useMemo } from 'react'
import { useQuality } from '../context/QualityContext'

export function Effects() {
    const { postProcessing } = useQuality()

    const aberrationOffset = useMemo(() => new THREE.Vector2(0.0005, 0.0005), [])

    if (!postProcessing) return null

    return (
        // ИСПРАВЛЕНИЕ: multisampling={0} предотвращает ошибку с альфа-каналом
        <EffectComposer multisampling={0}>
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