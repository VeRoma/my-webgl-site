'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Stats } from '@react-three/drei' // Убрали лишний Sparkles
import { Suspense } from 'react'
import * as THREE from 'three'

// Импортируем наши новые компоненты
import { HeroAsset } from './HeroAsset'
import { Effects } from './Effects'
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
            // ВАЖНО: Вернули toneMapping, чтобы цвета были правильными!
            gl={{
                antialias: mode === 'low',
                toneMapping: THREE.NoToneMapping
            }}
        >
            {/* 1. Окружение и Свет */}
            <Lights />
            <EnvironmentSetup />
            <StarsBackground />
            <CodeBackground />

            {/* 2. Объекты сцены */}
            <Platform />

            <Suspense fallback={null}>
                <HeroAsset />
            </Suspense>

            {/* 3. Тени и Управление */}
            {shadows && (
                <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={10} blur={2.5} far={1} />
            )}

            <OrbitControls
                enableZoom={true}
                target={[0, -1.6, 0]}
                maxPolarAngle={Math.PI / 2}
            />

            {/* 4. Пост-обработка (вынесена в отдельный файл) */}
            <Effects />

            <Stats />
        </Canvas>
    )
}

export default function Scene() {
    return (
        <div className="h-screen w-full bg-black">
            <QualityProvider>
                <QualityUI />
                <SceneContent />
            </QualityProvider>
        </div>
    )
}