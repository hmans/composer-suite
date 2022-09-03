import { JSDocTag, Project, VariableDeclaration } from "ts-morph"

export type SymbolDescription = {
  name: string
  description?: string
  tags?: JSDocTag[]
}

export type ModuleDescription = {
  symbols: SymbolDescription[]
}

const processVariableDeclaration = (
  name: string,
  declaration: VariableDeclaration
): SymbolDescription => {
  const statement = declaration.getVariableStatementOrThrow()
  const jsDoc = statement.getJsDocs()[0]

  return {
    name,
    description: jsDoc?.getDescription(),
    tags: jsDoc?.getTags()
  }
}

function morphy(tsconfig: string, mainFile: string): ModuleDescription {
  /* Create a project */
  const project = new Project({ tsConfigFilePath: tsconfig })

  /* Add the main file */
  const main = project.getSourceFileOrThrow(mainFile)

  /* Rertrieve all declarations exported by the main file */
  const exportedDeclarations = main.getExportedDeclarations()

  const symbols = new Array<SymbolDescription>()

  for (const [name, declarations] of exportedDeclarations) {
    const declaration = declarations[0]
    if (VariableDeclaration.isVariableDeclaration(declaration)) {
      symbols.push(
        processVariableDeclaration(name, declaration as VariableDeclaration)
      )
    }
  }

  return {
    symbols
  }
}

export default morphy
