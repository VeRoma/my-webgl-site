'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type QualityMode = 'low' | 'medium' | 'high'

interface QualitySettings {
    mode: QualityMode
    setMode: (mode: QualityMode) => void
    dpr: [number, number]         // Pixel Ratio (резкость)
    antialiasing: boolean         // Сглаживание краев
    shadows: boolean              // Тени
    reflections: boolean          // Отражения на полу (самое тяжелое!)
    postProcessing: boolean       // Bloom и эффекты
}

const QualityContext = createContext<QualitySettings>({} as QualitySettings)

export function QualityProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<QualityMode>('high')

    // Настройки для каждого режима
    const settings = {
        high: {
            dpr: [1, 2] as [number, number], // Адаптация под Retina
            antialiasing: true,
            shadows: true,
            reflections: true,
            postProcessing: true
        },
        medium: {
            dpr: [1, 1.5] as [number, number], // Ограничиваем резкость
            antialiasing: false, // Выключаем MSAA ради скорости
            shadows: true,
            reflections: true, // Оставляем, но можно снизить качество внутри компонента
            postProcessing: true
        },
        low: {
            dpr: [1, 1] as [number, number], // Строго 1:1, никаких Retina
            antialiasing: false,
            shadows: false, // Выключаем тени
            reflections: false, // Выключаем зеркальный пол (очень ускорит!)
            postProcessing: false // Выключаем Bloom
        }
    }

    return (
        <QualityContext.Provider value={{ mode, setMode, ...settings[mode] }}>
            {children}
        </QualityContext.Provider>
    )
}

export const useQuality = () => useContext(QualityContext)