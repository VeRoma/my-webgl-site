'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'

import { HeroAsset } from './HeroAsset'
import { Effects } from './Effects'
import { EnvironmentSetup } from './EnvironmentSetup'
import { Lights } from './Lights'
import { Platform } from './Platform'
import { CodeBackground } from './CodeBackground'
import { StarsBackground } from './StarsBackground'
import { useQuality } from '../context/QualityContext'
import { useIntro } from '../context/IntroContext'

function CameraController() {
    const { entered } = useIntro()
    const controlsRef = useRef<any>(null)

    useFrame((state, delta) => {
        if (entered && controlsRef.current) {
            controlsRef.current.target.lerp(new THREE.Vector3(0, -1.2, -0.1), 3 * delta)
            controlsRef.current.enableZoom = false
        }
    })

    return (
        <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            target={[0, -1.6, 0]}
            maxPolarAngle={Math.PI / 2}
        />
    )
}

// НОВЫЙ КОМПОНЕНТ: Обертка для подиумов (чтобы можно было использовать useFrame)
function PlatformWrapper() {
    const { entered } = useIntro()
    const { shadows } = useQuality()

    const platformRef = useRef<THREE.Group>(null)
    const [unmounted, setUnmounted] = useState(false)

    useFrame((_, delta) => {
        if (entered && platformRef.current && !unmounted) {
            // Топим подиум вниз с такой же скоростью, с которой летит логотип
            platformRef.current.position.y -= 5 * delta
            if (platformRef.current.position.y < -10) {
                setUnmounted(true) // Выгружаем из памяти
            }
        }
    })

    if (unmounted) return null

    return (
        <group ref={platformRef}>
            <Platform />
            {shadows && (
                <ContactShadows frames={1} position={[0, -1.9, 0]} opacity={0.5} scale={10} blur={2.5} far={1} />
            )}
        </group>
    )
}

function SceneContent() {
    const { dpr, shadows } = useQuality()

    return (
        <Canvas
            shadows={shadows}
            dpr={dpr}
            camera={{ position: [0, -1, 4], fov: 50 }}
            gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.0,
            }}
            onCreated={(state) => {
                state.gl.setClearColor('#000000')
            }}
        >
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 5, 20]} />
            <Lights />
            <Suspense fallback={null}><EnvironmentSetup /></Suspense>

            <StarsBackground />
            <CodeBackground />

            {/* ИСПОЛЬЗУЕМ НАШУ УМНУЮ ОБЕРТКУ */}
            <PlatformWrapper />

            <Suspense fallback={null}><HeroAsset /></Suspense>

            <CameraController />
            <Effects />
        </Canvas>
    )
}

export default function Scene() {
    return (
        <div className="h-screen w-full bg-black">
            <SceneContent />
        </div>
    )
}