import { Project, VariableDeclaration, VariableStatement } from "ts-morph"

type SymbolEntry = {
  description?: string
}

const processVariableDeclaration = (
  statement: VariableDeclaration
): SymbolEntry => ({
  description: statement
    .getVariableStatement()
    ?.getJsDocs()[0]
    ?.getCommentText()
})

async function ingestModule(tsconfig: string, mainFile: string) {
  const project = new Project({
    tsConfigFilePath: tsconfig
  })

  const main = project.getSourceFileOrThrow(mainFile)

  const exportedDeclarations = main.getExportedDeclarations()

  const symbols = new Map<string, SymbolEntry>()

  for (const [name, declarations] of exportedDeclarations) {
    const declaration = declarations[0]
    if (VariableDeclaration.isVariableDeclaration(declaration)) {
      symbols.set(
        name,
        processVariableDeclaration(declaration as VariableDeclaration)
      )
    }
  }

  return symbols
}

const symbols = await ingestModule(
  "../../tsconfig.json",
  "../../packages/shader-composer/src/index.ts"
)

console.log(symbols)

const Symbol = (props: SymbolEntry & { name: string }) => {
  return (
    <p>
      <strong>{props.name}:</strong> {props.description}
    </p>
  )
}

const Morphy = () => {
  return (
    <div>
      <h1>Morphy!</h1>
      {Object.entries(symbols).map(([name, symbol]) => (
        <p>{name}</p>
      ))}
    </div>
  )
}

export default Morphy
