'use client'

import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useQuality } from '../context/QualityContext'

const SNIPPETS = [
    "import { Canvas } from '@react-three/fiber'",
    "function Scene() { return <Logo /> }",
    "const x = Math.sin(time) * 0.5",
    "<MeshReflectorMaterial blur={[400, 100]} />",
    "export default function Page()",
    "const [hovered, set] = useState(false)",
    "useFrame((state) => { ref.current.rotation.y += 0.1 })",
    "// Optimization: GPU based particles",
    "console.log('Hello World')",
    "interface Props { position: [number, number, number] }"
]

// Добавили 'y' в пропсы
function CodeColumn({ x, y, z, speed, opacity }: { x: number, y: number, z: number, speed: number, opacity: number }) {
    const group = useRef<THREE.Group>(null)

    const text = useMemo(() => {
        return Array.from({ length: 10 })
            .map(() => SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)])
            .join('\n')
    }, [])

    useFrame((state, delta) => {
        if (!group.current) return

        // Двигаем вверх
        group.current.position.y += speed * delta

        // Если улетел слишком высоко (выше верхней границы экрана)
        if (group.current.position.y > 12) {
            // Сбрасываем глубоко вниз
            group.current.position.y = -15
        }
    })

    return (
        // position использует переданный стартовый Y
        <group ref={group} position={[x, y, z]}>
            <Text
                color="#00ffff"
                fontSize={0.25}
                font="/RobotoMono-Regular.ttf" // Убедись, что шрифт есть в public, или удали эту строку
                anchorX="center"
                anchorY="middle"
                letterSpacing={-0.05}
                lineHeight={1.5}
                fillOpacity={opacity}
            >
                {text}
            </Text>
        </group>
    )
}

export function CodeBackground() {
    const { mode } = useQuality()

    // Настроили координаты:
    // y: разные значения, чтобы код был везде
    // z: большие отрицательные значения (-8 ... -15), чтобы быть дальше
    const columns = useMemo(() => [
        { x: -5, y: 0, z: -8, speed: 0.5, opacity: 0.15 },
        { x: -3, y: -8, z: -10, speed: 0.8, opacity: 0.1 },
        { x: 3, y: 5, z: -12, speed: 0.7, opacity: 0.1 },
        { x: 6, y: -3, z: -9, speed: 0.4, opacity: 0.15 },
        { x: 0, y: -10, z: -15, speed: 0.3, opacity: 0.05 },
        { x: -7, y: 8, z: -11, speed: 0.6, opacity: 0.08 },
        { x: 4, y: -12, z: -14, speed: 0.5, opacity: 0.08 },
    ], [])

    if (mode === 'low') return null

    return (
        <>
            {columns.map((col, i) => (
                <CodeColumn key={i} {...col} />
            ))}
        </>
    )
}