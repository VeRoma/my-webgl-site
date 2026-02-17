'use client'

import dynamic from 'next/dynamic'

import { IntroOverlay } from './components/IntroOverlay' // Импорт оверлея
import { IntroProvider } from './components/context/IntroContext'

// Динамический импорт сцены (SSR выключен, так как это WebGL)
const Scene = dynamic(() => import('./components/Scene'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Оборачиваем всё в IntroProvider, чтобы шарить состояние загрузки */}
      <IntroProvider>

        {/* Экран загрузки (HTML слой) */}
        <IntroOverlay />

        {/* 3D Сцена */}
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>

        {/* Здесь позже будет UI интерфейс, который тоже считает useIntro() */}

      </IntroProvider>
    </main>
  )
}