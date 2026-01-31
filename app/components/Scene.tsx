'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Grid } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense } from 'react'
import { LogoModel } from './LogoModel'
import { EnvironmentSetup } from './EnvironmentSetup'
import { Lights } from './Lights'
import { Platform } from './Platform'

export default function Scene() {
    return (
        <div className="h-screen w-full bg-black">
            {/* position: [0, 2, 6] 
         - 0 по центру
         - 2 высота (как ты просил)
         - 6 дистанция (чтобы логотип влезал целиком)
      */}
            <Canvas camera={{ position: [0, -1, 4], fov: 50 }}>

                <Lights />
                <EnvironmentSetup />

                <Platform />

                <Suspense fallback={null}>
                    <group position={[0, -1.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
                        <LogoModel />
                    </group>
                </Suspense>

                <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={10} blur={2.5} far={1} />

                {/* ВАЖНО: target заставляет камеру смотреть в эту точку */}
                <OrbitControls
                    enableZoom={true}
                    target={[0, -1.6, 0]} // Смотрим ровно на логотип (который мы сместили вниз)
                    maxPolarAngle={Math.PI / 2} // (Опционально) Не даем камере опускаться под землю
                />

                <EffectComposer>
                    <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.6} />
                </EffectComposer>

            </Canvas>
        </div>
    )
}