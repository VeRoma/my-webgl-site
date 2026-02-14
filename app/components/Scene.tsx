'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Sparkles, Stats } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { Suspense } from 'react'
import * as THREE from 'three'

import { LogoModel } from './LogoModel'
import { EnvironmentSetup } from './EnvironmentSetup'
import { Lights } from './Lights'
import { Platform } from './Platform'

// Импортируем наш контекст
import { QualityProvider, useQuality } from '../context/QualityContext'
import { QualityUI } from './QualityUI'

import { CodeBackground } from './CodeBackground' // <-- Импортируем

// Вынесли содержимое Canvas в отдельный компонент, 
// чтобы он мог использовать хук useQuality (который должен быть внутри провайдера)
function SceneContent() {
    const { dpr, shadows, postProcessing } = useQuality()

    return (
        <>
            <Canvas
                shadows={shadows}
                dpr={dpr}
                camera={{ position: [0, -1, 4], fov: 50 }}
                gl={{ antialias: false }}
            >
                <Lights />
                <EnvironmentSetup />
                <Sparkles count={50} scale={5} size={4} speed={0.4} opacity={0.5} color="#00ffff" />
                <Platform />

                <CodeBackground />
                
                <Suspense fallback={null}>
                    <group position={[0, -1.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
                        <LogoModel />
                    </group>
                </Suspense>

                {shadows && (
                    <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={10} blur={2.5} far={1} />
                )}

                <OrbitControls target={[0, -1.2, 0]} maxPolarAngle={Math.PI / 2} />

                {/* Исправленный блок эффектов: без лишних комментариев внутри тега */}
                {postProcessing && (
                    <EffectComposer>
                        <Bloom
                            luminanceThreshold={0.7}
                            mipmapBlur
                            intensity={0.4}
                            radius={0.3}
                        />
                        <ChromaticAberration
                            offset={new THREE.Vector2(0.001, 0.001)}
                        />
                    </EffectComposer>
                )}

                <Stats />
            </Canvas>
        </>
    )
}

export default function Scene() {
    return (
        <div className="h-screen w-full bg-black">
            {/* Оборачиваем все в провайдер */}
            <QualityProvider>
                <QualityUI />
                <SceneContent />
            </QualityProvider>
        </div>
    )
}