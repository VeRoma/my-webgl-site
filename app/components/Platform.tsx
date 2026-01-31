'use client'

import { MeshReflectorMaterial } from '@react-three/drei'

export function Platform() {
    return (
        <group position={[0, -2, 0]}>

            {/* 1. ОСНОВНОЙ ДИСК (Подиум) */}
            <mesh receiveShadow>
                {/* Твоя геометрия */}
                <cylinderGeometry args={[1, 1.05, 0.2, 64]} />

                {/* МАТЕРИАЛ: Черный матовый металл (Obsidian) */}
                <meshPhysicalMaterial
                    color="#000000"       // Глубокий черный
                    roughness={0.2}       // Немного матовый
                    metalness={0.8}       // Полностью металл
                    clearcoat={0.5}       // Слой лака для бликов
                    clearcoatRoughness={0.1}
                    envMapIntensity={2}   // Усиливаем отражения от красного света
                />
            </mesh>

            {/* 1.1 Ground (Нижний большой блин) */}
            <mesh receiveShadow position={[0, -0.2, 0]}> {/* Чуть опустил, чтобы не мерцало с верхним */}
                <cylinderGeometry args={[3, 3.05, 0.1, 64]} />

                {/* МАТЕРИАЛ: Мокрый асфальт / Темное зеркало */}
                {/* Этот материал создает реалистичные размытые отражения */}
                <MeshReflectorMaterial
                    blur={[400, 100]}     // Сильное размытие отражений
                    resolution={1024}     // Качество отражения
                    mixBlur={1}           // Смешивание размытия
                    mixStrength={40}      // Яркость отражений (можно уменьшить, если слишком ярко)
                    roughness={1}         // Сама поверхность шероховатая (асфальт)
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050505"       // Цвет самого диска (почти черный)
                    metalness={0.8}
                    mirror={0.5}          // Степень зеркальности
                />
            </mesh>

            {/* 2. ВНУТРЕННЕЕ СВЕТЯЩЕЕСЯ КОЛЬЦО */}
            {/* Поднял чуть выше (0.16), чтобы оно лежало на поверхности верхнего диска (0.3/2 = 0.15) */}
            <mesh position={[0, 0.101, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.8, 0.9, 64]} />
                {/* toneMapped={false} — критически важно для неонового свечения (Bloom) */}
                <meshBasicMaterial color="#00ffff" toneMapped={false} />
            </mesh>

            {/* 4. ЦЕНТРАЛЬНОЕ ПЯТНО (Свечение под логотипом) */}
            <pointLight position={[0, 1, 0]} intensity={10} distance={3} color="#00ffff" />

        </group>
    )
}