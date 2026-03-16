'use client'

import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function RealStarsBackground() {
    // Загружаем твой JPEG из папки public
    const texture = useTexture('/starmap.jpg')
    texture.colorSpace = THREE.SRGBColorSpace

    return (
        <mesh>
            {/* Огромная сфера, охватывающая всю сцену */}
            <sphereGeometry args={[500, 64, 64]} />
            <meshBasicMaterial
                map={texture}
                side={THREE.BackSide} // Текстура смотрит внутрь сферы
                fog={false}           // Туман не должен скрывать космос
                toneMapped={true}     // Оставляем true, чтобы фон не пересвечивался
            />
        </mesh>
    )
}