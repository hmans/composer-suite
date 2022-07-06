import { button, useControls } from "leva"
import { R3FStage } from "r3f-stage"
import { FC, Suspense, useState } from "react"
import { Repeat } from "three-vfx"
import { Route, useRoute } from "wouter"
import examples, { ExampleDefinition } from "./examples"
import "r3f-stage/styles.css"

export const Game = () => (
  <R3FStage
    footer={
      <a href="https://github.com/hmans/three-vfx" target="_blank">
        github.com/hmans/three-vfx
      </a>
    }
  >
    <Route path="/:path">
      <Suspense>
        <ExampleMatcher />
      </Suspense>
    </Route>
  </R3FStage>
)

const ExampleMatcher = () => {
  const [match, params] = useRoute("/:path")
  const example = match && (examples.find((e) => e.path == params!.path) as any)

  return example?.component && <Example example={example} />
}

const Example: FC<{ example: ExampleDefinition }> = ({ example }) => {
  const [v, setV] = useState(Math.random())

  const { loop, interval } = useControls("Controls", {
    restart: button(() => setV(Math.random())),
    loop: false,
    interval: { value: 1, min: 0, max: 10 }
  })

  return (
    <Repeat key={v} times={loop ? Infinity : 0} interval={interval}>
      {example.component}
    </Repeat>
  )
}
