'use client'

import { LogoModel } from './LogoModel'
import { GlobeModel } from './GlobeModel'
import { GlobeGrid } from './GlobeGrid'

export function HeroAsset() {
    return (
        <group position={[0, -1.6, 0]}>
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
    )
}