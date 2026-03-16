# Project Architecture & Guidelines (WebGL Site)

## Tech Stack
* **Framework:** Next.js (App Router, `app/` directory)
* **Styling:** Tailwind CSS (`globals.css`)
* **3D Engine:** Three.js + React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
* **Language:** TypeScript (`*.tsx`, `*.ts`)

## Global Development Rules
1. **Separation of Concerns:** 3D Scene (`Canvas`) and 2D UI (HTML/CSS) are strictly separated. UI components (e.g., `UIOverlay.tsx`, `IntroOverlay.tsx`) are stacked on top of the `Scene.tsx` using absolute positioning and `z-index`.
2. **WebGL Components:** All components rendered inside the `Canvas` (e.g., inside `Scene.tsx`) must include the `"use client"` directive.
3. **State Management:** Local state is managed via React Context API.
   * `QualityContext.tsx`: Manages pixel ratio (DPR) and toggles post-processing effects for performance optimization.
   * `IntroContext.tsx`: Manages asset loading state and intro animations.
4. **Assets:** 3D models (`.glb`) and environment maps (`.hdr`) are located in the `public/` directory and loaded via R3F hooks (`useGLTF`, `Environment`).