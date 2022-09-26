export const importRapier = async () => {
  let r = await import("@dimforge/rapier3d-compat")
  await r.init()
  return r
}
