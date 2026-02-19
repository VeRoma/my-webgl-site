'use client'

import dynamic from 'next/dynamic'

import { IntroOverlay } from './components/IntroOverlay'
import { IntroProvider } from './components/context/IntroContext'
import { QualityProvider } from './context/QualityContext' // <--- 1. Импортируем Провайдер Качества

const Scene = dynamic(() => import('./components/Scene'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* 2. Оборачиваем ВСЁ приложение, чтобы Интро имело доступ к setMode */}
      <QualityProvider>
        <IntroProvider>

          {/* Сцена (фон) */}
          <div className="absolute inset-0 z-0">
            <Scene />
          </div>

          {/* Интро (поверх сцены) */}
          <IntroOverlay />

        </IntroProvider>
      </QualityProvider>
    </main>
  )
}