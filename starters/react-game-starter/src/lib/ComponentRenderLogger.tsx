import {
  Profiler,
  ProfilerOnRenderCallback,
  ReactNode,
  useCallback
} from "react"

export function ComponentRenderLogger({ children }: { children?: ReactNode }) {
  const onRender = useCallback<ProfilerOnRenderCallback>((id, phase) => {
    console.log("React component rendered:", phase)
  }, [])

  return (
    <Profiler id="ComponentRenderLogger" onRender={onRender}>
      {children}
    </Profiler>
  )
}
