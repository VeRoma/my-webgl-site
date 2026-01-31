'use client'

export function Platform() {
    return (
        // Группируем всё и опускаем вниз, где раньше была сетка
        <group position={[0, -2, 0]}>

            {/* 1. ОСНОВНОЙ ДИСК (Подиум) */}
            <mesh receiveShadow>
                {/* args: [радиусВерх, радиусНиз, высота, сегменты] */}
                <cylinderGeometry args={[1, 1.05, 0.3, 64]} />
                <meshStandardMaterial
                    color="#000000"
                    roughness={0.8}
                    metalness={0.8}
                    envMapIntensity={1} // Чтобы отражал окружение
                />
            </mesh>

            {/* 1.1 Ground  */}
            <mesh receiveShadow>
                {/* args: [радиусВерх, радиусНиз, высота, сегменты] */}
                <cylinderGeometry args={[3, 3.05, 0.1, 64]} />
                <meshStandardMaterial
                    color="#000000"
                    roughness={0.8}
                    metalness={0.8}
                    envMapIntensity={1} // Чтобы отражал окружение
                />
            </mesh>


            {/* 2. ВНУТРЕННЕЕ СВЕТЯЩЕЕСЯ КОЛЬЦО (Тонкое) */}
            <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                {/* args: [внутрРадиус, внешРадиус, сегменты] */}
                <ringGeometry args={[0.8, 0.9, 64]} />
                <meshBasicMaterial color="#00ffff" toneMapped={false} />
            </mesh>



            {/* 4. ЦЕНТРАЛЬНОЕ ПЯТНО (Свечение под логотипом) */}
            <pointLight position={[0, 1, 0]} intensity={2} distance={3} color="#00ffff" />

        </group>
    )
}