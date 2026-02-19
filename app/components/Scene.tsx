'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect } from 'react'
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

// 1. ВЫНОСИМ УПРАВЛЕНИЕ КАМЕРОЙ В ОТДЕЛЬНЫЙ КОМПОНЕНТ
function CameraController() {
    const { entered } = useIntro()
    const controlsRef = useRef<any>(null)

    // Этот хук теперь работает правильно, так как CameraController будет лежать внутри <Canvas>
    useFrame((state, delta) => {
        if (entered && controlsRef.current) {
            // Смещаем точку фокуса камеры ровно по центру, чтобы осматриваться как в VR
            controlsRef.current.target.lerp(new THREE.Vector3(0, -1.2, -0.1), 3 * delta)
            // Отключаем зум, чтобы юзер не вылетел из сферы
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

// 2. ОСНОВНАЯ СЦЕНА
function SceneContent() {
    const { dpr, shadows } = useQuality()
    const { entered } = useIntro()

    const [unmounted, setUnmounted] = useState(false)

    // Удаляем подиум и тени из памяти через 2.5 секунды
    useEffect(() => {
        if (entered) {
            const timer = setTimeout(() => setUnmounted(true), 2500)
            return () => clearTimeout(timer)
        }
    }, [entered])

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

            {/* ЕСЛИ НЕ ВНУТРИ - ПОКАЗЫВАЕМ ПОДИУМ И ТЕНИ */}
            {!unmounted && <Platform />}

            <Suspense fallback={null}><HeroAsset /></Suspense>

            {!unmounted && shadows && (
                <ContactShadows frames={1} position={[0, -1.9, 0]} opacity={0.5} scale={10} blur={2.5} far={1} />
            )}

            {/* ВМЕСТО ОБЫЧНОГО ORBITCONTROLS СТАВИМ НАШ УМНЫЙ КОНТРОЛЛЕР */}
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