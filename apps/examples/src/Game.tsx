import { button, useControls } from "leva"
import { Perf } from "r3f-perf"
import { FC, Suspense, useState } from "react"
import { Repeat } from "timeline-composer"
import { Route, useRoute } from "wouter"
import examples, { ExampleDefinition } from "./examples"

import "r3f-stage/styles.css"
import { Application } from "r3f-stage"

export const Game = () => <Application></Application>

const Example: FC<{ example: ExampleDefinition }> = ({ example }) => {
  const [v, setV] = useState(Math.random())

  const { loop, interval } = useControls("Controls", {
    restart: button(() => setV(Math.random())),
    loop: false,
    interval: { value: 1, min: 0, max: 10 }
  })

  return (
    <Repeat key={v} times={loop ? Infinity : 0} seconds={interval}>
      {example.component}
    </Repeat>
  )
}
