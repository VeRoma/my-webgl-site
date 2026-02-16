'use client'

import { Sparkles } from '@react-three/drei'

export function StarsBackground() {
    return (
        <Sparkles
            count={50}
            // [X, Y, Z] — растягиваем широко (20x20), но делаем слой тонким (10)
            scale={[20, 20, 10]}

            size={4}
            speed={0.4}
            opacity={0.5}
            color="#00ffff"

            // Сдвигаем всё облако назад на Z = -10.
            // (Камера на +4, Логотип на 0. Значит звезды будут далеко позади)
            position={[0, 0, -10]}
        />
    )
}