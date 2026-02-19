'use client'

import { LogoModel } from './LogoModel'
import { GlobeModel } from './GlobeModel'
import { GlobeGrid } from './GlobeGrid'
import { HeroRig } from './HeroRig'
import { useIntro } from './context/IntroContext' // Оставил твой путь
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export function HeroAsset() {
    const { booted, entered, setEntered } = useIntro()

    const group = useRef<THREE.Group>(null)
    const logoRef = useRef<THREE.Group>(null)
    const solidGlobeRef = useRef<THREE.Group>(null)

    // 1. Слушатель скролла/клика
    useEffect(() => {
        if (!booted || entered) return

        const handleInteract = (e: any) => {
            // Защита от случайных микро-скроллов на тачпаде
            if (e.type === 'wheel' && Math.abs(e.deltaY) < 20) return

            if (setEntered) {
                setEntered(true)
            }
        }

        // Даем 1 секунду после Интро, чтобы пользователь увидел сцену
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

    // 2. Вся анимация
    useFrame((state, delta) => {
        if (!group.current) return

        // ВАЖНО: Главная группа теперь растет ВСЕГДА, независимо от того, нырнули мы или нет!
        const targetScale = booted ? 1 : 0
        group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 4 * delta))

        // Если сработал триггер погружения (entered === true)
        if (entered) {
            // Камера летит в центр
            state.camera.position.lerp(new THREE.Vector3(0, -1.2, 0.1), 3 * delta)

            // Логотип улетает за камеру
            if (logoRef.current) {
                logoRef.current.position.z = THREE.MathUtils.lerp(logoRef.current.position.z, 25, 4 * delta)
            }

            // Земля сжимается в ноль
            if (solidGlobeRef.current) {
                solidGlobeRef.current.scale.setScalar(THREE.MathUtils.lerp(solidGlobeRef.current.scale.x, 0, 5 * delta))
            }
        }
    })

    return (
        <group position={[0, -1.6, 0]}>
            <group ref={group} scale={[0, 0, 0]}>

                {/* ЛОГОТИП (только он обернут в HeroRig) */}
                <HeroRig>
                    <group ref={logoRef} rotation={[0, -Math.PI / 2, 0]} position={[0.1, 0, 0.35]}>
                        <LogoModel />
                    </group>
                </HeroRig>

                <group position={[0, 0.4, 0]}>
                    {/* СПЛОШНАЯ ЗЕМЛЯ */}
                    <group ref={solidGlobeRef}>
                        <GlobeModel />
                    </group>

                    {/* СЕТКА (Остается всегда) */}
                    <GlobeGrid />
                </group>

            </group>
        </group>
    )
}