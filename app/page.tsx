import Scene from './components/Scene'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Наш 3D компонент */}
      <Scene />

      {/* Здесь потом можно накидать HTML интерфейс поверх */}
      <div className="absolute top-10 left-10 text-white z-10 pointer-events-none">
        <h1 className="text-4xl font-bold">MY WEBGL APP</h1>
        <p>Next.js + R3F</p>
      </div>
    </main>
  )
}