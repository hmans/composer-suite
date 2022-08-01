import { useState } from "react"

export const useVersion = () => {
  const [version, setVersion] = useState(0)
  return [version, () => setVersion((v) => v + 1)] as const
}
