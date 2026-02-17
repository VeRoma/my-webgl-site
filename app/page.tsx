'use client'

import dynamic from 'next/dynamic'

import { IntroOverlay } from './components/IntroOverlay' // <--- ВЕРНУЛИ
import { IntroProvider } from './components/context/IntroContext'

const Scene = dynamic(() => import('./components/Scene'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <IntroProvider>
        {/* Сцена (фон) */}
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>

        {/* Интро (поверх сцены) */}
        <IntroOverlay /> {/* <--- ВЕРНУЛИ */}
      </IntroProvider>
    </main>
  )
}