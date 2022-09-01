import { Environment } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Background } from "./Background"
import { Controller } from "./Controller"
import { Camera } from "./lib/camera-composer"
import { ComponentRenderLogger } from "./lib/ComponentRenderLogger"
import { PostProcessing } from "./lib/PostProcessing"
import { GameplayScene } from "./scenes/Gameplay/GameplayScene"
import { TitleScene } from "./scenes/Title/TitleScene"
import { MatchState } from "./state"

function App() {
  return (
    <ComponentRenderLogger>
      <Canvas flat dpr={1}>
        <color attach="background" args={["#444"]} />
        <Environment preset="sunset" />
        <Camera />
        <PostProcessing />
        <Controller />
        {/* <PerformanceMonitor /> */}

        <Background />

        <MatchState state="title">
          <TitleScene />
        </MatchState>

        <MatchState state="gameplay">
          <GameplayScene />
        </MatchState>
      </Canvas>
    </ComponentRenderLogger>
  )
}

export default App
