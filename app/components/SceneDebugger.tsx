'use client'

import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

export function SceneDebugger() {
    const { scene, gl } = useThree()

    useEffect(() => {
        // Ждем секунду, чтобы всё точно загрузилось
        const timer = setTimeout(() => {
            console.log('=============================================')
            console.log('🛑 [DEBUG] НАЧАЛО ПРОВЕРКИ СЦЕНЫ')

            // 1. ФОН
            // Если null -> Прозрачно (и вы видите белый body)
            // Если Color -> Должен быть r:0, g:0, b:0 (Черный)
            const bg = scene.background
            console.log('🎨 Background:', bg ? bg : 'NULL (ПРОЗРАЧНЫЙ!)')

            // 2. TONE MAPPING (Главный виновник белого экрана)
            // Если NoToneMapping + яркий свет = БЕЛЫЙ ЭКРАН
            const mapping = gl.toneMapping
            let mapName = 'Неизвестно'
            if (mapping === THREE.NoToneMapping) mapName = 'NoToneMapping (❌ ОПАСНО ПРИ ЯРКОМ СВЕТЕ)'
            if (mapping === THREE.ACESFilmicToneMapping) mapName = 'ACESFilmic (✅ ХОРОШО)'
            if (mapping === THREE.ReinhardToneMapping) mapName = 'Reinhard'
            if (mapping === THREE.CineonToneMapping) mapName = 'Cineon'
            if (mapping === THREE.LinearToneMapping) mapName = 'Linear'

            console.log('⚙️ ToneMapping:', mapName)
            console.log('💡 Exposure:', gl.toneMappingExposure)

            // 3. СВЕТ (Проверяем пересвет)
            scene.traverse((obj) => {
                if ((obj as any).isLight) {
                    const light = obj as THREE.Light
                    console.log(`🔦 Свет [${light.type}]: Intensity = ${light.intensity}, Color = #${light.color.getHexString()}`)
                    if (light.intensity > 10 && mapping === THREE.NoToneMapping) {
                        console.warn('⚠️ ВНИМАНИЕ: Очень яркий свет без ToneMapping вызовет белый экран!')
                    }
                }
            })

            console.log('🛑 [DEBUG] КОНЕЦ ПРОВЕРКИ')
            console.log('=============================================')
        }, 2000)

        return () => clearTimeout(timer)
    }, [scene, gl])

    return null
}