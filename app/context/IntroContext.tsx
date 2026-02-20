'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// 1. ВОТ ЗДЕСЬ МЫ ГОВОРИМ TYPESCRIPT, ЧТО У НАС ЕСТЬ НОВЫЕ ПЕРЕМЕННЫЕ
interface IntroContextType {
    booted: boolean
    setBooted: (v: boolean) => void
    entered: boolean                  // <--- Добавили это
    setEntered: (v: boolean) => void  // <--- Добавили это
    flightFinished: boolean
    setFlightFinished: (v: boolean) => void
}

// 2. Создаем контекст
const IntroContext = createContext<IntroContextType>({} as IntroContextType)

// 3. Провайдер
export function IntroProvider({ children }: { children: ReactNode }) {
    const [booted, setBooted] = useState(false)
    const [entered, setEntered] = useState(false) // <--- И добавили стейт здесь
    const [flightFinished, setFlightFinished] = useState(false)

    return (
        <IntroContext.Provider value={{ booted, setBooted, entered, setEntered, flightFinished, setFlightFinished }}>
            {children}
        </IntroContext.Provider>
    )
}

export const useIntro = () => useContext(IntroContext)