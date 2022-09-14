import { useState } from "react"

export const useNullableState = <T,>(initialValue: T | (() => T) = null!) =>
  useState<T | null>(initialValue)
