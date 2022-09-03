import { JSDocTag, Project, VariableDeclaration } from "ts-morph"

type SymbolEntry = {
  description?: string
  tags?: JSDocTag[]
}

const processVariableDeclaration = (
  declaration: VariableDeclaration
): SymbolEntry => {
  const statement = declaration.getVariableStatementOrThrow()
  const jsDoc = statement.getJsDocs()[0]

  return {
    description: jsDoc?.getDescription(),
    tags: jsDoc?.getTags()
  }
}

function morphy(tsconfig: string, mainFile: string) {
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

export default morphy
