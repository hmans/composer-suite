import ReactMarkdown from "react-markdown"
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

function ingestModule(tsconfig: string, mainFile: string) {
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

const Tags = ({ tags }: { tags: any }) => {
  console.log(tags)
  return null
}

const Symbol = ({
  name,
  description,
  tags
}: SymbolEntry & { name: string }) => {
  return (
    <div className="symbol">
      <h3>{name}</h3>
      {description && <ReactMarkdown>{description}</ReactMarkdown>}
      {tags && <Tags tags={tags} />}
    </div>
  )
}

const Morphy = () => {
  const symbols = ingestModule(
    "../../tsconfig.json",
    "../../packages/shader-composer/src/index.ts"
  )

  return (
    <div>
      <h1>shader-composer</h1>
      {[...symbols.keys()].map((name) => (
        <Symbol name={name} {...symbols.get(name)!} />
      ))}
    </div>
  )
}

export default Morphy
