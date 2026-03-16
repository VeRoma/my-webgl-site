# Project Changelog

### [2026-03-10]
* feat: initialize Next.js project with Tailwind CSS and basic App Router layout

### [2026-03-12]
* feat: integrate React Three Fiber and create base `Scene.tsx` wrapper
* feat: add `EnvironmentSetup.tsx` using HDR maps (`studio1.hdr`, `city-sh.hdr`) for PBR lighting
* feat: configure `Lights.tsx` with directional and ambient lighting

### [2026-03-14]
* feat: implement 3D models loading (`GlobeModel.tsx`, `LogoModel.tsx`) from public directory
* feat: add `HeroRig.tsx` for camera animations and `StarsBackground.tsx`
* feat: implement `Effects.tsx` for post-processing

### [2026-03-15]
* refactor: setup `QualityContext.tsx` for dynamic DPR scaling
* refactor: setup `IntroContext.tsx` for loading screen state management
* feat: build HTML UI layer (`UIOverlay.tsx`, `QualityUI.tsx`)

### [2026-03-16]
* fix: resolve stacking context issue in UI components by applying `z-index: 50` to ensure interactive elements are clickable over the WebGL Canvas