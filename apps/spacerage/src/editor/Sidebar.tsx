import * as UI from "ui-composer"
import { SystemsECS } from "../lib/miniplex-systems-runner/System"
import { useAutoRefresh } from "../lib/useAutoRefresh"
import { GameState, SidebarTunnel } from "../state"

export const Sidebar = () => (
  <>
    <UI.Panel>
      <UI.Heading>Scenes</UI.Heading>
      <UI.VerticalGroup>
        <UI.Button onClick={() => GameState.enter("menu")}>
          Menu Scene
        </UI.Button>
        <UI.Button onClick={() => GameState.enter("gameplay")}>
          Gameplay Scene
        </UI.Button>
      </UI.VerticalGroup>
    </UI.Panel>

    <MiniplexSystemsInspector />

    <SidebarTunnel.Out />
  </>
)

const MiniplexSystemsInspector = () => {
  const systems = SystemsECS.useArchetype("name", "timings").entities

  useAutoRefresh(1 / 10)

  return (
    <UI.Panel>
      <UI.Heading>Systems</UI.Heading>
      <table>
        <tbody>
          {systems.map((system) => (
            <tr>
              <td width={120}>{system.name}</td>
              <td width={100} align="right">
                {(system.timings.average * 1000).toFixed(2)}µs
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </UI.Panel>
  )
}
