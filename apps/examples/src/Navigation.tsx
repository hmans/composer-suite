import { Link } from "wouter"

export const Navigation = () => {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1,
        top: 10,
        left: 10
      }}
    >
      <Link href="/explosion">Explosion</Link>
      <Link href="/fog">Fog</Link>
    </div>
  )
}
