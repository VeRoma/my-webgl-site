'use client'

export function Lights() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            {/* Цветной акцент снизу */}
            <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />
        </>
    )
}