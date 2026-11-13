'use client'

import { LogoModel } from './LogoModel'
import { GlobeModel } from './GlobeModel'
import { GlobeGrid } from './GlobeGrid'
import { HeroRig } from './HeroRig'
import { MagicParticles } from './MagicParticles'
import { useIntro } from '../context/IntroContext'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export function HeroAsset() {
    const { booted, entered, setEntered, flightFinished, setFlightFinished } = useIntro()

    const group = useRef<THREE.Group>(null)
    const flightTime = useRef(0)

    useEffect(() => {
        if (!booted || entered) return

        const handleInteract = (e: Event) => {
            if (e.type === 'wheel' && Math.abs((e as WheelEvent).deltaY) < 20) return
            // ВРЕМЕННО ОТКЛЮЧАЕМ ПЕРЕХОД ПО КЛИКУ/СКРОЛЛУ ДЛЯ ОТЛАДКИ ГЛАВНОЙ СЦЕНЫ
            // if (setEntered) setEntered(true)
        }

        const timer = setTimeout(() => {
            window.addEventListener('wheel', handleInteract, { passive: true })
            window.addEventListener('click', handleInteract)
        }, 1000)

        return () => {
            clearTimeout(timer)
            window.removeEventListener('wheel', handleInteract)
            window.removeEventListener('click', handleInteract)
        }
    }, [booted, entered, setEntered])

    useFrame((state, delta) => {
        if (!group.current) return

        // Входная анимация масштаба сцены (после загрузки)
        const targetScale = booted ? 1 : 0
        group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 4 * delta))

        // ДЗЕН-ПОГРУЖЕНИЕ: Вместо жесткого полета внутрь шара, камера мягко стабилизируется
        if (entered && !flightFinished) {
            flightTime.current += delta
            
            // Плавное смещение камеры на идеальную дистанцию для созерцания
            state.camera.position.lerp(new THREE.Vector3(0, 0, 12), 1.5 * delta)
            state.camera.lookAt(0, 0, 0)

            // Передаем управление OrbitControls через 2 секунды
            if (flightTime.current >= 2) {
                setFlightFinished(true)
            }
        }
    })

    return (
        <group position={[0, 0, 0]}>
            <group ref={group} scale={[0, 0, 0]}>

                {/* МАГИЧЕСКИЕ ЧАСТИЦЫ (Дзен-вихрь) */}
                <MagicParticles />

                {/* ЛОГОТИП (Материализуется плавно) */}
                <HeroRig>
                    <group rotation={[0, -Math.PI / 2, 0]} position={[0.1, 0, 0.35]}>
                        <LogoModel />
                    </group>
                </HeroRig>

                <group position={[0, 0, 0]}>
                    {/* СПЛОШНАЯ ЗЕМЛЯ (Материализуется плавно) */}
                    <GlobeModel />

                    {/* СЕТКА (Материализуется плавно) */}
                    <GlobeGrid />
                </group>

            </group>
        </group>
    )
}
