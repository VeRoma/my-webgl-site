'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Sparkles, Stats } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { Suspense } from 'react'
import * as THREE from 'three'

import { LogoModel } from './LogoModel'
import { GlobeModel } from './GlobeModel'
import { GlobeGrid } from './GlobeGrid'
import { EnvironmentSetup } from './EnvironmentSetup'
import { Lights } from './Lights'
import { Platform } from './Platform'
import { CodeBackground } from './CodeBackground'

import { QualityProvider, useQuality } from '../context/QualityContext'
import { QualityUI } from './QualityUI'

function SceneContent() {
    const { mode, dpr, shadows, postProcessing } = useQuality()

    return (
        <Canvas
            shadows={shadows}
            dpr={dpr}
            camera={{ position: [0, -1, 4], fov: 50 }}
            gl={{ antialias: mode === 'low' }}
        >
            <Lights />
            <EnvironmentSetup />

            <Sparkles
                count={50}
                scale={5}
                size={4}
                speed={0.4}
                opacity={0.5}
                color="#00ffff"
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />

            <CodeBackground />
            <Platform />

            <Suspense fallback={null}>
                <group position={[0, -1.6, 0]}>
                    <group rotation={[0, -Math.PI / 2, 0]} position={[0.1, 0, 0.35]}>
                        <LogoModel />
                    </group>

                    <group position={[0, 0.4, 0]}>
                        <GlobeModel />
                        <GlobeGrid />
                    </group>
                </group>
            </Suspense>

            {shadows && (
                <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={10} blur={2.5} far={1} />
            )}

            <OrbitControls
                enableZoom={true}
                target={[0, -1.6, 0]}
                maxPolarAngle={Math.PI / 2}
            />

            {postProcessing && (
                <EffectComposer>
                    {/* ВОЗВРАЩАЕМ ЦВЕТ ЛОГОТИПА */}
                    <Bloom
                        // Было 0.1 -> Стало 0.8. 
                        // Теперь светится только реальный неон, а металл остается темным и цветным.
                        luminanceThreshold={0.8}
                        mipmapBlur
                        intensity={1.0}
                        radius={0.6}
                    />
                    <ChromaticAberration
                        offset={new THREE.Vector2(0.0005, 0.0005)}
                    />
                </EffectComposer>
            )}

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