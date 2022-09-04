import React, { FC } from "react"
import * as UI from "ui-composer"
import { styled } from "ui-composer/src/styles"
import { ThreeApplication, ThreeApplicationProps } from "./ThreeApplication"
import { UI as LegacyUI } from "./ui/UI"

export type ApplicationProps = {} & ThreeApplicationProps

const Floater = styled("div", {
  position: "absolute",
  right: 20,
  top: 20,
  boxShadow: "3px 3px 20px rgba(0,0,0,0.3)"
})

export const Application: FC<ApplicationProps> = ({ ...props }) => {
  return (
    <>
      <LegacyUI />
      <UI.Root>
        <UI.HorizontalGroup>
          <div style={{ flex: 2 }}>
            <ThreeApplication {...props} />
          </div>
          <Floater css={{ width: 400 }}>
            <UI.VerticalGroup css={{ flex: 1 }}>
              <UI.Panel>
                <UI.Heading>Hi from UI Composer!</UI.Heading>
                <p>Hello</p>
              </UI.Panel>
            </UI.VerticalGroup>
          </Floater>
        </UI.HorizontalGroup>
      </UI.Root>
    </>
  )
}
