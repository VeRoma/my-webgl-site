'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Stats } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'

import { HeroAsset } from './HeroAsset'
import { Effects } from './Effects' // <--- Убедитесь, что импорт есть
import { EnvironmentSetup } from './EnvironmentSetup'
import { Lights } from './Lights'
import { Platform } from './Platform'
import { CodeBackground } from './CodeBackground'
import { StarsBackground } from './StarsBackground'

import { QualityProvider, useQuality } from '../context/QualityContext'
import { QualityUI } from './QualityUI'
import { SceneDebugger } from './SceneDebugger'

function SceneContent() {
    const { mode, dpr, shadows } = useQuality()

    return (
        <Canvas
            shadows={shadows}
            dpr={dpr}
            camera={{ position: [0, -1, 4], fov: 50 }}
            gl={{
                antialias: true,
                // ВАЖНО: Используем ACESFilmic, чтобы Bloom не делал экран белым!
                // Если поставить NoToneMapping, bloom может засветить всё.
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.0,
            }}
            onCreated={(state) => {
                state.gl.setClearColor('#000000')
            }}
        >
            <SceneDebugger />

            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 5, 20]} />

            <Lights />

            <Suspense fallback={null}>
                <EnvironmentSetup />
            </Suspense>

            <StarsBackground />

            {/* Наш исправленный CodeBackground */}
            <CodeBackground />

            <Platform />

            <Suspense fallback={null}>
                <HeroAsset />
            </Suspense>

            {shadows && (
                <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={10} blur={2.5} far={1} />
            )}

            <OrbitControls enableZoom={true} target={[0, -1.6, 0]} maxPolarAngle={Math.PI / 2} />

            {/* ВКЛЮЧАЕМ ЭФФЕКТЫ */}
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