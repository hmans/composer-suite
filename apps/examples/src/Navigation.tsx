import { Link } from "wouter"
import { examples } from "./Examples"

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
      {examples.map(({ path, name }) => (
        <Link key={path} href={`/${path}`}>
          {name}
        </Link>
      ))}
    </div>
  )
}
