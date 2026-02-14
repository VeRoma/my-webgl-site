'use client'
import { useQuality } from '../context/QualityContext'

export function QualityUI() {
    const { mode, setMode } = useQuality()

    const btnClass = (active: boolean) =>
        `px-3 py-1 text-xs font-bold uppercase tracking-wider border transition-all ${active
            ? 'bg-cyan-500 text-black border-cyan-500'
            : 'bg-black/50 text-gray-400 border-gray-700 hover:border-white hover:text-white'
        }`

    return (
        <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button onClick={() => setMode('low')} className={btnClass(mode === 'low')}>Low</button>
            <button onClick={() => setMode('medium')} className={btnClass(mode === 'medium')}>Med</button>
            <button onClick={() => setMode('high')} className={btnClass(mode === 'high')}>High</button>
        </div>
    )
}
