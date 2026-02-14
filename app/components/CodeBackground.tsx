'use client'

import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react' // убрал useState, он не использовался
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

function CodeColumn({ x, z, speed, opacity }: { x: number, z: number, speed: number, opacity: number }) {
    const group = useRef<THREE.Group>(null)

    const text = useMemo(() => {
        return Array.from({ length: 10 })
            .map(() => SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)])
            .join('\n')
    }, [])

    useFrame((state, delta) => {
        if (!group.current) return
        group.current.position.y += speed * delta
        if (group.current.position.y > 5) {
            group.current.position.y = -10
        }
    })

    return (
        <group ref={group} position={[x, -10, z]}>
            <Text
                color="#00ffff"
                fontSize={0.25}
                // ВАЖНО: Ссылка теперь ведет на локальный файл в папке public
                // Если лень качать файл, просто удали строчку font="..." — будет стандартный шрифт
                font="/RobotoMono-Regular.ttf"
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

    // 1. СНАЧАЛА вызываем все хуки
    const columns = useMemo(() => [
        { x: -4, z: -2, speed: 0.5, opacity: 0.15 },
        { x: -2.5, z: -3, speed: 0.8, opacity: 0.1 },
        { x: 2.5, z: -3, speed: 0.7, opacity: 0.1 },
        { x: 4, z: -2, speed: 0.4, opacity: 0.15 },
        { x: 0, z: -4, speed: 0.3, opacity: 0.05 },
    ], [])

    // 2. И ТОЛЬКО ПОТОМ делаем проверку и return
    if (mode === 'low') return null

    return (
        <>
            {columns.map((col, i) => (
                <CodeColumn key={i} {...col} />
            ))}
        </>
    )
}