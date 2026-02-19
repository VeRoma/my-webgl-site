'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface IntroContextType {
    booted: boolean            // true = интро прошло, показываем сцену
    setBooted: (v: boolean) => void
}

const IntroContext = createContext<IntroContextType>({} as IntroContextType)

export function IntroProvider({ children }: { children: ReactNode }) {
    const [booted, setBooted] = useState(false)

    return (
        <IntroContext.Provider value={{ booted, setBooted }}>
            {children}
        </IntroContext.Provider>
    )
}

export const useIntro = () => useContext(IntroContext)