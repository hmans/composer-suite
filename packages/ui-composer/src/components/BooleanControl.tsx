import React, { useState } from "react"
import { styled } from "../styles"

export type BooleanControlProps = {
  description?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export const BooleanControl = ({
  description,
  onChange,
  checked: initialChecked = false
}: BooleanControlProps) => {
  const [checked, setChecked] = useState(initialChecked)

  return (
    <>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onChange?.(e.target.checked)
          setChecked(e.target.checked)
        }}
      />
      {description && <Description>{description}</Description>}
    </>
  )
}

const Description = styled("span", {
  marginLeft: "0.25rem"
})
