import { Redirect, Route } from "wouter"
import { Game } from "./Game"
import { Navigation } from "./Navigation"

export default () => (
  <>
    <Navigation />
    <Game />
    <Route path="/">
      <Redirect to="/fog" />
    </Route>
  </>
)
