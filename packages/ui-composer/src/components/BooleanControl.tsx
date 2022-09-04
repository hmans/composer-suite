import React from "react"

export type BooleanControlProps = {
  description?: string
}

export const BooleanControl = ({ description }: BooleanControlProps) => {
  return (
    <>
      <input type="checkbox" onChange={() => console.log("changed!")} />
      {description && <span>{description}</span>}
    </>
  )
}
