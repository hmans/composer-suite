import {
  ExportedDeclarations,
  JSDocTag,
  Project,
  VariableDeclaration
} from "ts-morph"
import {
  DocComment,
  DocExcerpt,
  DocNode,
  ParserContext,
  TSDocParser
} from "@microsoft/tsdoc"

export type SymbolDescription = {
  name: string
  fullDoc?: string
  doc?: {
    description: string
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

  const fullDoc = jsDoc?.getFullText()

  return {
    name,
    fullDoc,
    doc: jsDoc ? processDocComment(fullDoc) : undefined
  }
}

const processDocComment = (comment: string) => {
  const tsdocParser: TSDocParser = new TSDocParser()
  const parserContext: ParserContext = tsdocParser.parseString(comment)
  const docComment: DocComment = parserContext.docComment

  return {
    description: renderDocNodes(docComment.summarySection.getChildNodes())
  }
}

const processTags = (tags: JSDocTag[]) => tags.map(processTag)

const processTag = (tag: JSDocTag): TagDescription => {
  return {
    original: tag,
    name: tag.getTagName(),
    description: tag.getCommentText()
  }
}

const renderDocNode = (docNode: DocNode): string => {
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

const renderDocNodes = (docNodes: ReadonlyArray<DocNode>): string => {
  let result: string = ""
  for (const docNode of docNodes) {
    result += renderDocNode(docNode)
  }
  return result
}

export default morphy
