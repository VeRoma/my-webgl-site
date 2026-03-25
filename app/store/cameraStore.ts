let coords = 'COORDS: 0.00° N, 0.00° E'
const listeners = new Set<() => void>()

export const cameraStore = {
    getCoords: () => coords,
    setCoords: (newCoords: string) => {
        if (coords !== newCoords) {
            coords = newCoords
            // Уведомляем всех подписчиков (UIOverlay) об изменении
            listeners.forEach(listener => listener())
        }
    },
    subscribe: (listener: () => void) => {
        listeners.add(listener)
        // Возвращаем функцию отписки для useSyncExternalStore
        return () => listeners.delete(listener)
    }
}
