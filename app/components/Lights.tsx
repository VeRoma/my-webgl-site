'use client'

export function Lights() {
    return (
        <>
            {/* 1. Основной заполняющий свет (холодный ночной город) */}
            <ambientLight intensity={0.2} color="#001133" />

            {/* 2. ГЛАВНЫЙ КРАСНЫЙ ПРОЖЕКТОР (Сверху-справа-спереди) */}
            {/* intensity={20} - очень яркий, чтобы создать пересвет на гранях */}
            <spotLight
                position={[5, 8, 5]}
                angle={0.3}
                penumbra={0.5}
                intensity={30}
                color="#ff3300"
                castShadow
                shadow-bias={-0.0001}
            />

            {/* 3. Контровой холодный свет (Сзади-слева, для объема в тенях) */}
            <spotLight
                position={[-5, 5, -5]}
                angle={0.5}
                penumbra={1}
                intensity={5}
                color="#0066ff"
            />
        </>
    )
}