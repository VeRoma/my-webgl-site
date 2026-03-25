'use client'

import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

import { useIntro } from '../context/IntroContext'
import { cameraStore } from '../store/cameraStore'

export function CameraController() {
    const { entered, flightFinished } = useIntro()
    const controlsRef = useRef<OrbitControlsImpl>(null)

    useFrame((state) => {
        // 1. Обновляем инерцию камеры
        if (controlsRef.current?.enableDamping) {
            controlsRef.current.update()
        }

        // 2. БЫСТРОЕ ОБНОВЛЕНИЕ КООРДИНАТ БЕЗ РЕРЕНДЕРА SCENE
        const pos = state.camera.position
        const radius = pos.length()

        if (radius > 0) {
            const phi = Math.acos(pos.y / radius)
            const theta = Math.atan2(pos.x, pos.z)

            const latDeg = 90 - (phi * 180 / Math.PI)
            const latDir = latDeg >= 0 ? 'N' : 'S'

            const lonDeg = theta * 180 / Math.PI
            const lonDir = lonDeg >= 0 ? 'E' : 'W'

            const newCoords = `COORDS: ${Math.abs(latDeg).toFixed(2)}° ${latDir}, ${Math.abs(lonDeg).toFixed(2)}° ${lonDir}`
            
            // Пишем в стор напрямую, UIOverlay сам перерисуется через useSyncExternalStore
            cameraStore.setCoords(newCoords)
        }
    })

    const isFlying = entered && !flightFinished

    return (
        <OrbitControls
            ref={controlsRef}
            enabled={!isFlying}
            enableDamping={true}
            dampingFactor={0.05}
            enableZoom={false}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
        />
    )
}
