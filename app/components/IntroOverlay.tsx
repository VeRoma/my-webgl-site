'use client'

import { useState, useEffect } from 'react'
import { useIntro } from './context/IntroContext'

export function IntroOverlay() {
    const { setBooted } = useIntro()
    const [visible, setVisible] = useState(true)
    const [progress, setProgress] = useState(0)
    const [text, setText] = useState('INITIALIZING VRRGL CORE...')

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + Math.floor(Math.random() * 15)
            })
        }, 150)

        const timeouts = [
            setTimeout(() => setText('LOADING ASSETS...'), 800),
            setTimeout(() => setText('CONNECTING TO NEURAL NET...'), 1600),
            setTimeout(() => setText('ACCESS GRANTED.'), 2400),
            setTimeout(() => {
                setBooted(true) // Включаем сцену
                setVisible(false) // Скрываем оверлей
            }, 2800)
        ]

        return () => {
            clearInterval(interval)
            timeouts.forEach(clearTimeout)
        }
    }, [setBooted])

    // Если не виден — вообще не рендерим его в DOM, чтобы не мешал
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