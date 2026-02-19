'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// 1. ВОТ ЗДЕСЬ МЫ ГОВОРИМ TYPESCRIPT, ЧТО У НАС ЕСТЬ НОВЫЕ ПЕРЕМЕННЫЕ
interface IntroContextType {
    booted: boolean
    setBooted: (v: boolean) => void
    entered: boolean                  // <--- Добавили это
    setEntered: (v: boolean) => void  // <--- Добавили это
}

// 2. Создаем контекст
const IntroContext = createContext<IntroContextType>({} as IntroContextType)

// 3. Провайдер
export function IntroProvider({ children }: { children: ReactNode }) {
    const [booted, setBooted] = useState(false)
    const [entered, setEntered] = useState(false) // <--- И добавили стейт здесь

    return (
        <IntroContext.Provider value={{ booted, setBooted, entered, setEntered }}>
            {children}
        </IntroContext.Provider>
    )
}

export const useIntro = () => useContext(IntroContext)