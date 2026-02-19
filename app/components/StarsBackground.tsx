'use client'

import { Sparkles } from '@react-three/drei'
import { useIntro } from '../context/IntroContext'


export function StarsBackground() {
    const { booted } = useIntro() // <-- Получаем статус

    // Пока идет интро (черный экран/загрузка), звезды не показываем
    if (!booted) return null

    return (
        <Sparkles
            count={50}
            // [X, Y, Z] — зона разброса
            scale={[20, 20, 10]}

            size={4}
            speed={0.4}
            opacity={0.5}
            color="#00ffff"

            // Сдвигаем назад, чтобы были фоном
            position={[0, 0, -10]}
        />
    )
}