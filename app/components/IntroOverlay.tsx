'use client'

import { useState, useEffect } from 'react'
import { useIntro } from './context/IntroContext'
import { useQuality } from '../context/QualityContext'
import { useProgress } from '@react-three/drei'
import { getGPUTier } from 'detect-gpu'

export function IntroOverlay() {
    const { setBooted } = useIntro()
    const { setMode } = useQuality()
    const { progress } = useProgress()

    const [visible, setVisible] = useState(true)
    const [text, setText] = useState('INITIALIZING VRRGL CORE...')
    const [benchmarkDone, setBenchmarkDone] = useState(false)
    const [assetsStartTime, setAssetsStartTime] = useState<number | null>(null)

    // 1. РЕАЛЬНЫЙ БЕНЧМАРК GPU С УМНОЙ ЗАДЕРЖКОЙ
    useEffect(() => {
        async function runBenchmark() {
            setText('ANALYZING HARDWARE...')
            const start = Date.now()
            try {
                const tier = await getGPUTier()

                if (tier.fps && tier.fps < 30) {
                    setMode('low')
                } else if (tier.tier >= 3) {
                    setMode('high')
                } else {
                    setMode('medium')
                }
            } catch (e) {
                setMode('medium')
            } finally {
                const elapsed = Date.now() - start

                // Проверяем скорость интернета через API браузера (если поддерживается)
                // @ts-ignore - нестандартное API
                const conn = typeof navigator !== 'undefined' ? navigator.connection : null
                const isSlowConnection = conn && ['slow-2g', '2g', '3g'].includes(conn.effectiveType)

                // Если интернет медленный - пауза 0. Если быстрый - добиваем до 1 секунды для красоты.
                const delayNeeded = isSlowConnection ? 0 : Math.max(0, 1000 - elapsed)

                setTimeout(() => {
                    setBenchmarkDone(true)
                    setAssetsStartTime(Date.now()) // Засекаем, во сколько начали грузиться ассеты
                }, delayNeeded)
            }
        }
        runBenchmark()
    }, [setMode])

    // 2. СЛЕДИМ ЗА РЕАЛЬНОЙ ЗАГРУЗКОЙ АССЕТОВ
    useEffect(() => {
        if (!benchmarkDone) return

        if (progress < 100) {
            // Показываем реальный процент загрузки 3D
            setText(`LOADING ASSETS... ${Math.round(progress)}%`)
        } else {
            // Ассеты 100% загружены. Смотрим, как долго ждал пользователь.
            const loadTime = assetsStartTime ? Date.now() - assetsStartTime : 0
            const isSlowInternet = loadTime > 1500 // Если качал дольше 1.5 секунд

            if (isSlowInternet) {
                // ПОЛЬЗОВАТЕЛЬ НАСТРАДАЛСЯ: Пропускаем анимации, пускаем сразу
                setText('ACCESS GRANTED.')
                const timer = setTimeout(() => {
                    setBooted(true)
                    setVisible(false)
                }, 400) // Даем 400мс просто осознать, что всё загрузилось

                return () => clearTimeout(timer)
            } else {
                // БЫСТРЫЙ ИНТЕРНЕТ (или кэш): Показываем кинематографичную концовку
                setText('CONNECTING TO NEURAL NET...')
                const timer1 = setTimeout(() => setText('ACCESS GRANTED.'), 800)
                const timer2 = setTimeout(() => {
                    setBooted(true)
                    setVisible(false)
                }, 1600)

                return () => {
                    clearTimeout(timer1)
                    clearTimeout(timer2)
                }
            }
        }
    }, [benchmarkDone, progress, setBooted, assetsStartTime])

    if (!visible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000">
            <div className="font-mono text-cyan-500 text-sm md:text-base flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-cyan-900 border-t-cyan-400 rounded-full animate-spin" />
                <div className="uppercase tracking-widest animate-pulse">
                    {text}
                </div>
                <div className="w-64 h-1 bg-gray-900 rounded overflow-hidden">
                    <div
                        className="h-full bg-cyan-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-xs text-cyan-800 mt-2">
                    VRRGL SYSTEM v1.0.4
                </div>
            </div>
        </div>
    )
}