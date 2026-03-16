'use client'

import dynamic from 'next/dynamic'

import { IntroOverlay } from './components/IntroOverlay'
import { UIOverlay } from './components/UIOverlay' // <-- ДОБАВЛЕНО
import { IntroProvider, useIntro } from './context/IntroContext'
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

          {/* Главный интерфейс (кнопки качества, меню) */}
          <UIOverlay /> {/* <-- ДОБАВЛЕНО */}

          {/* Интро (поверх сцены) */}
          <IntroProviderConsumer />

        </IntroProvider>
      </QualityProvider>
    </main>
  )
}

function IntroProviderConsumer() {
  const { booted } = useIntro()
  return !booted ? <IntroOverlay /> : null
}