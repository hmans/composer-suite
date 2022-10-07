import * as UI from "ui-composer"
import { SystemsECS } from "./System"
import { useAutoRefresh } from "../useAutoRefresh"

export const MiniplexSystemsInspector = () => {
  const systems = SystemsECS.useArchetype("name", "timings").entities

  useAutoRefresh(1 / 10)

  return (
    <UI.Panel>
      <UI.Heading>Systems</UI.Heading>
      <table>
        <tbody>
          {systems.map((system, i) => (
            <tr key={i}>
              <td width={120}>{system.name}</td>
              <td
                width={100}
                align="right"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                <strong>{system.timings.average.toFixed(2)}</strong>ms
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </UI.Panel>
  )
}
