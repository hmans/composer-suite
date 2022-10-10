import { useState } from "react"
import "./App.css"
import { ECS } from "./state"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <ECS.Entity>
        <ECS.Property name="health" value={count} />
      </ECS.Entity>

      <button onClick={() => setCount((c) => c + 1)}>Increase</button>
    </div>
  )
}

export default App
