import {
  ExportedDeclarations,
  JSDocTag,
  Project,
  VariableDeclaration
} from "ts-morph"

export type SymbolDescription = {
  name: string
  description?: string
  tags?: TagDescription[]
}

export type TagDescription = {
  name: string
  description?: string
}

export type ModuleDescription = {
  symbols: SymbolDescription[]
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
    const processed = processDeclaration(name, declaration)
    if (processed) symbols.push(processed)
  }

  return {
    symbols
  }
}

const processDeclaration = (name: string, declaration: ExportedDeclarations) =>
  VariableDeclaration.isVariableDeclaration(declaration)
    ? processVariableDeclaration(name, declaration)
    : undefined

const processVariableDeclaration = (
  name: string,
  declaration: VariableDeclaration
): SymbolDescription => {
  const statement = declaration.getVariableStatementOrThrow()
  const jsDoc = statement.getJsDocs()[0]
  const tags = jsDoc?.getTags()

  return {
    name,
    description: jsDoc?.getDescription(),
    tags: tags ? processTags(tags) : undefined
  }
}

const processTags = (tags: JSDocTag[]) => tags.map(processTag)

const processTag = (tag: JSDocTag): TagDescription => {
  return { name: tag.getTagName(), description: tag.getCommentText() }
}

export default morphy
