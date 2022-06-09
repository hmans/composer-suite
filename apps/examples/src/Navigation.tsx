import { Link } from "wouter"
import Examples from "./examples"

export const Navigation = () => {
  return (
    <>
      <div
        style={{
          position: "fixed",
          zIndex: 1,
          top: 10,
          left: 10
        }}
      >
        {Examples.map(({ path, name }) => (
          <Link key={path} href={`/${path}`}>
            {name}
          </Link>
        ))}
      </div>
      <div
        style={{
          position: "fixed",
          zIndex: 1,
          bottom: 10,
          left: 10
        }}
      >
        <a href="https://github.com/hmans/vfx" target="_blank">
          github.com/hmans/vfx
        </a>
      </div>
    </>
  )
}
