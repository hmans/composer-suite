import React, { ReactNode, Suspense } from "react"
import { Link, Redirect, Route } from "wouter"
import { Spinner } from "./Spinner"
import { navigationTunnel } from "./ui/UI"

export type ExampleProps = {
  children?: ReactNode
  path: string
  title?: string
  makeDefault?: boolean
}

export const Example = ({ children, path, title, makeDefault = false }: ExampleProps) => {
  const url = `/examples/${path}`

  return (
    <>
      <navigationTunnel.In>
        <Link to={url}>{title || path}</Link>
      </navigationTunnel.In>

      <Route path={url}>
        <Suspense fallback={<Spinner />}>{children}</Suspense>
      </Route>

      {makeDefault && (
        <Route path="/">
          <Redirect to={url} />
        </Route>
      )}
    </>
  )
}
