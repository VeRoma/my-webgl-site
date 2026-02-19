'use client'

import dynamic from 'next/dynamic'

import { IntroOverlay } from './components/IntroOverlay'
// ИСПРАВЛЕННЫЙ ПУТЬ:
import { IntroProvider } from './context/IntroContext'
import { QualityProvider } from './context/QualityContext'

const Scene = dynamic(() => import('./components/Scene'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
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