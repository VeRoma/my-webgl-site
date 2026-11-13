'use client'

import { EffectComposer, Bloom, ChromaticAberration, SMAA, DepthOfField } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useMemo } from 'react'
import { useQuality } from '../context/QualityContext'

export function Effects() {
    const { mode } = useQuality()

    // Вектор хроматической аберрации
    const aberrationOffset = useMemo(() => new THREE.Vector2(0.0005, 0.0005), [])

    return (
        <EffectComposer multisampling={0}>

            {/* Программное сглаживание SMAA для режимов medium и high */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {mode !== 'low' ? (<SMAA /> as any) : (null as any)}

            {/* Кинематографичный фокус (Depth of Field) */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {mode !== 'low' ? (<DepthOfField focusDistance={0.0} focalLength={0.02} bokehScale={2} height={480} /> as any) : (null as any)}

            {/* Настраиваем свечение (Bloom) так, чтобы оно цепляло яркие звезды */}
            <Bloom
                luminanceThreshold={0.2} // Снижаем порог, чтобы светились цветные звезды
                mipmapBlur               // Включаем качественное размытие
                intensity={1.5}          // Сила свечения
                radius={0.7}             // Размер ореола вокруг звезды
            />

            <ChromaticAberration
                offset={aberrationOffset}
            />
        </EffectComposer>
    )
}
