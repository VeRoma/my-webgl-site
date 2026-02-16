'use client'

import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useQuality } from '../context/QualityContext'

export function Effects() {
    const { postProcessing } = useQuality()

    if (!postProcessing) return null

    return (
        <EffectComposer>
            <Bloom
                luminanceThreshold={0.8} // Светится только яркий неон
                mipmapBlur
                intensity={1.0}
                radius={0.6}
            />
            <ChromaticAberration
                offset={new THREE.Vector2(0.0005, 0.0005)}
            />
        </EffectComposer>
    )
}