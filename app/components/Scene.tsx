'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Stats } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'

import { HeroAsset } from './HeroAsset'
// import { Effects } from './Effects' <--- УБРАЛИ ИМПОРТ
import { EnvironmentSetup } from './EnvironmentSetup'
import { Lights } from './Lights'
import { Platform } from './Platform'
import { CodeBackground } from './CodeBackground'
import { StarsBackground } from './StarsBackground'

import { QualityProvider, useQuality } from '../context/QualityContext'
import { QualityUI } from './QualityUI'

function SceneContent() {
    const { mode, dpr, shadows } = useQuality()

    return (
        <Canvas
            shadows={shadows}
            dpr={dpr}
            camera={{ position: [0, -1, 4], fov: 50 }}
            gl={{
                // Возвращаем дефолтные настройки для стабильности
                antialias: true,
                toneMapping: THREE.NoToneMapping,
                // alpha: true // Можно не указывать, по умолчанию true
            }}
        >
            <Lights />
            <EnvironmentSetup />
            <StarsBackground />
            <CodeBackground />

            <Platform />

            <Suspense fallback={null}>
                <HeroAsset />
            </Suspense>

            {shadows && (
                <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={10} blur={2.5} far={1} />
            )}

            <OrbitControls
                enableZoom={true}
                target={[0, -1.6, 0]}
                maxPolarAngle={Math.PI / 2}
            />

            {/* <Effects /> <--- УБРАЛИ КОМПОНЕНТ, ЧТОБЫ НЕ КРАШИЛ САЙТ */}

            <Stats />
        </Canvas>
    )
}

export default function Scene() {
    return (
        // Убедись, что bg-black здесь есть, иначе экран может быть белым
        <div className="h-screen w-full bg-black">
            <QualityProvider>
                <QualityUI />
                <SceneContent />
            </QualityProvider>
        </div>
    )
}