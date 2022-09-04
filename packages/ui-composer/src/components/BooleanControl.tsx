import React from "react"
import { styled } from "../styles"

export type BooleanControlProps = {
  description?: string
}

export const BooleanControl = ({ description }: BooleanControlProps) => {
  return (
    <>
      <input type="checkbox" onChange={() => console.log("changed!")} />
      {description && <Description>{description}</Description>}
    </>
  )
}

const Description = styled("span", {
  marginLeft: "0.25rem"
})
