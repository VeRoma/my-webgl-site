'use client'

import { LogoModel } from './LogoModel'
import { GlobeModel } from './GlobeModel'
import { GlobeGrid } from './GlobeGrid'
import { HeroRig } from './HeroRig'
import { useIntro } from '../context/IntroContext'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

export function HeroAsset() {
    const { booted, entered, setEntered } = useIntro()

    const group = useRef<THREE.Group>(null)
    const logoRef = useRef<THREE.Group>(null)
    const solidGlobeRef = useRef<THREE.Group>(null)

    const [logoUnmounted, setLogoUnmounted] = useState(false)
    const [globeUnmounted, setGlobeUnmounted] = useState(false)

    useEffect(() => {
        if (!booted || entered) return

        const handleInteract = (e: any) => {
            if (e.type === 'wheel' && Math.abs(e.deltaY) < 20) return
            if (setEntered) setEntered(true)
        }

        const timer = setTimeout(() => {
            window.addEventListener('wheel', handleInteract, { passive: true })
            window.addEventListener('click', handleInteract)
            window.addEventListener('touchstart', handleInteract)
        }, 1000)

        return () => {
            clearTimeout(timer)
            window.removeEventListener('wheel', handleInteract)
            window.removeEventListener('click', handleInteract)
            window.removeEventListener('touchstart', handleInteract)
        }
    }, [booted, entered, setEntered])

    useFrame((state, delta) => {
        if (!group.current) return

        const targetScale = booted ? 1 : 0
        group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 4 * delta))

        if (entered) {
            // 1. Камера летит в центр
            state.camera.position.lerp(new THREE.Vector3(0, -1.2, 0.1), 3 * delta)

            // 2. Логотип летит медленно и плавно (+= вместо lerp дает стабильную скорость)
            if (logoRef.current && !logoUnmounted) {
                logoRef.current.position.z += 5 * delta
                if (logoRef.current.position.z > 10) {
                    setLogoUnmounted(true) // Удаляем при достижении 10
                }
            }

            // 3. Сплошная Земля: плавно растворяем все материалы внутри нее
            if (solidGlobeRef.current && !globeUnmounted) {
                let allFaded = true
                solidGlobeRef.current.traverse((child: any) => {
                    if (child.isMesh && child.material) {
                        const materials = Array.isArray(child.material) ? child.material : [child.material]
                        // ИСПРАВЛЕНО: добавлено (mat: any)
                        materials.forEach((mat: any) => {
                            mat.transparent = true
                            if (mat.opacity === undefined) mat.opacity = 1
                            // Гасим прозрачность
                            mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 4 * delta)
                            if (mat.opacity > 0.05) allFaded = false
                        })
                    }
                })
                // Как только материалы стали полностью прозрачными — выгружаем объект
                if (allFaded) setGlobeUnmounted(true)
            }
        }
    })

    return (
        <group position={[0, -1.6, 0]}>
            <group ref={group} scale={[0, 0, 0]}>

                {/* ЛОГОТИП */}
                {!logoUnmounted && (
                    <HeroRig>
                        <group ref={logoRef} rotation={[0, -Math.PI / 2, 0]} position={[0.1, 0, 0.35]}>
                            <LogoModel />
                        </group>
                    </HeroRig>
                )}

                <group position={[0, 0.4, 0]}>
                    {/* СПЛОШНАЯ ЗЕМЛЯ (растворяется и удаляется) */}
                    {!globeUnmounted && (
                        <group ref={solidGlobeRef}>
                            <GlobeModel />
                        </group>
                    )}

                    {/* СЕТКА (Остается всегда) */}
                    <GlobeGrid />
                </group>

            </group>
        </group>
    )
}