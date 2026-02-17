'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type IntroContextType = {
    booted: boolean
    setBooted: (value: boolean) => void
}

const IntroContext = createContext<IntroContextType>({ booted: false, setBooted: () => { } })

export const useIntro = () => useContext(IntroContext)

export function IntroProvider({ children }: { children: ReactNode }) {
    const [booted, setBooted] = useState(false)
    return (
        <IntroContext.Provider value={{ booted, setBooted }}>
            {children}
        </IntroContext.Provider>
    )
}