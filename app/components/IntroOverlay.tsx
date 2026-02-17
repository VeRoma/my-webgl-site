'use client'

import { useState, useEffect } from 'react'
import { useIntro } from './context/IntroContext'


export function IntroOverlay() {
    const { setBooted } = useIntro()
    const [visible, setVisible] = useState(true)
    const [text, setText] = useState('INITIALIZING VRRGL CORE...')
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Симуляция загрузки
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                // Случайный шаг загрузки для реализма
                return prev + Math.floor(Math.random() * 15)
            })
        }, 150)

        // Сценарий текстов
        const timeouts = [
            setTimeout(() => setText('LOADING ASSETS...'), 800),
            setTimeout(() => setText('CONNECTING TO NEURAL NET...'), 1600),
            setTimeout(() => setText('ACCESS GRANTED.'), 2400),
            setTimeout(() => {
                setBooted(true) // Даем сигнал 3D сцене
                setVisible(false) // Убираем оверлей
            }, 2800)
        ]

        return () => {
            clearInterval(interval)
            timeouts.forEach(clearTimeout)
        }
    }, [setBooted])

    if (!visible) return null

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ${progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="font-mono text-cyan-500 text-sm md:text-base flex flex-col items-center gap-4">
                {/* Логотип или спиннер */}
                <div className="w-16 h-16 border-2 border-cyan-900 border-t-cyan-400 rounded-full animate-spin" />

                {/* Текст терминала */}
                <div className="uppercase tracking-widest animate-pulse">
                    {text}
                </div>

                {/* Прогресс бар */}
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