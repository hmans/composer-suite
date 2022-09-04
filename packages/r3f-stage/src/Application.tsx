import React, { FC } from "react"
import * as UI from "ui-composer"
import { ThreeApplication, ThreeApplicationProps } from "./ThreeApplication"
import { UI as LegacyUI } from "./ui/UI"

export type ApplicationProps = {} & ThreeApplicationProps

export const Application: FC<ApplicationProps> = ({ ...props }) => {
  return (
    <UI.Root>
      <UI.HorizontalGroup>
        <div style={{ flex: 2 }}>
          <LegacyUI />
          <ThreeApplication {...props} />
        </div>
        <UI.VerticalGroup css={{ flex: 1 }}>
          <UI.Panel>
            <UI.Heading>Hi from UI Composer!</UI.Heading>
            <p>Hello</p>
          </UI.Panel>
        </UI.VerticalGroup>
      </UI.HorizontalGroup>
    </UI.Root>
  )
}
