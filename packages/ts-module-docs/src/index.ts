import {
  DocComment,
  DocExcerpt,
  DocNode,
  DocParamBlock,
  ParserContext,
  TSDocParser
} from "@microsoft/tsdoc"
import {
  ExportedDeclarations,
  JSDocTag,
  Project,
  VariableDeclaration
} from "ts-morph"

export type SymbolDescription = {
  name: string
  doc?: {
    description: string
    params: ReadonlyArray<DocParamBlock>
  }
}

export type TagDescription = {
  original: JSDocTag
  name: string
  description?: string
}

export type ModuleDescription = {
  symbols: SymbolDescription[]
}

export const extractModuleDocumentation = (
  tsconfig: string,
  mainFile: string
): ModuleDescription => {
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

  const fullDoc = jsDoc?.getFullText()

  return {
    name,
    doc: jsDoc ? processDocComment(fullDoc) : undefined
  }
}

const processDocComment = (comment: string) => {
  const tsdocParser: TSDocParser = new TSDocParser()
  const parserContext: ParserContext = tsdocParser.parseString(comment)
  const docComment: DocComment = parserContext.docComment

  return {
    description: renderDocNodes(docComment.summarySection.getChildNodes()),
    params: docComment.params.blocks
  }
}

export const renderDocNode = (docNode: DocNode): string => {
  let result: string = ""

  if (docNode) {
    if (docNode instanceof DocExcerpt) {
      result += docNode.content.toString()
    }

    for (const childNode of docNode.getChildNodes()) {
      result += renderDocNode(childNode)
    }
  }

  return result
}

export const renderDocNodes = (docNodes: ReadonlyArray<DocNode>): string => {
  let result: string = ""
  for (const docNode of docNodes) {
    result += renderDocNode(docNode)
  }
  return result
}
