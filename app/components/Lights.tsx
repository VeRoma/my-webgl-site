'use client'

import { useRef } from 'react'
import * as THREE from 'three'

export function Lights() {
    return (
        <>
            {/* 1. Общий свет (очень тусклый, темно-синий, как ночь) */}
            <ambientLight intensity={0.2} color="#001133" />

            {/* 2. Основной прожектор (Key Light) */}
            <spotLight
                position={[5, 5, 5]}
                angle={0.5}
                penumbra={1}
                intensity={5} // Было 30! Снизили до 5.
                color="#ff3300" // Оранжевый неон
                castShadow
                shadow-bias={-0.0001}
            />

            {/* 3. Контровой свет (Rim Light) */}
            <spotLight
                position={[-5, 5, 5]}
                angle={0.5}
                penumbra={1}
                intensity={5} // Было 30! Снизили до 5.
                color="#00ffff" // Голубой неон
                castShadow
                shadow-bias={-0.0001}
            />

            {/* 4. Заполняющий свет снизу (чтобы не было черноты) */}
            <pointLight position={[0, -2, 2]} intensity={0.5} color="#ffffff" />
        </>
    )
}