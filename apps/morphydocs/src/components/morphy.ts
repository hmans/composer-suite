import { JSDocTag, Project, VariableDeclaration } from "ts-morph"

export type SymbolEntry = {
  description?: string
  tags?: JSDocTag[]
}

export type ModuleDescription = {
  symbols: string[]
  symbolDescriptions: Map<string, SymbolEntry>
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

function morphy(tsconfig: string, mainFile: string): ModuleDescription {
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

  return {
    symbols: Array.from(symbols.keys()),
    symbolDescriptions: symbols
  }
}

export default morphy
