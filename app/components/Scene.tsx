'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Stats } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'

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
            gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping, // Для красивого света
                toneMappingExposure: 1.0,
            }}
            onCreated={(state) => {
                state.gl.setClearColor('#000000') // Гарантия черного
            }}
        >
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 5, 20]} />

            <Lights />

            {/* ВАЖНО: Suspense спасает от белого экрана при загрузке HDR */}
            <Suspense fallback={null}>
                <EnvironmentSetup />
            </Suspense>

            <StarsBackground />

            {/* Теперь безопасно, так как шрифт исправлен */}
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