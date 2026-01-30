'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei' // Убрал Environment из импорта пока что
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense } from 'react'
import { LogoModel } from './LogoModel'

export default function Scene() {
    return (
        <div className="h-screen w-full bg-gradient-to-b from-gray-900 to-black">
            <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>

                {/* === СВЕТ (Замена Environment) === */}
                {/* AmbientLight дает общий заполняющий свет */}
                <ambientLight intensity={1.5} />

                {/* DirectionalLight имитирует солнце/прожектор */}
                <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
                <directionalLight position={[-5, 5, -5]} intensity={2} color="#00aaff" /> {/* Синий рефлекс */}

                {/* === ВРЕМЕННО ОТКЛЮЧАЕМ ЗАГРУЗКУ ИЗ ИНТЕРНЕТА === */}
                {/* <Environment preset="city" />  <-- ЭТА СТРОКА ВЫЗЫВАЛА ОШИБКУ */}

                <Suspense fallback={null}>
                    <LogoModel />
                </Suspense>

                <OrbitControls enableZoom={true} />

                <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2} far={1} />

                {/* Эффекты */}
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={1}
                        mipmapBlur
                        intensity={1.5}
                        radius={0.6}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    )
}