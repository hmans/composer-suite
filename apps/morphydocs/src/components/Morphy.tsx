import { Project, VariableDeclaration } from "ts-morph"

async function ingestModule(tsconfig: string, mainFile: string) {
  const project = new Project({
    tsConfigFilePath: tsconfig
  })

  const main = project.getSourceFileOrThrow(mainFile)

  const exportedDeclarations = main.getExportedDeclarations()

  for (const [name, declarations] of exportedDeclarations) {
    for (const declaration of declarations) {
      if (VariableDeclaration.isVariableDeclaration(declaration)) {
        console.log(
          (declaration as VariableDeclaration)
            .getVariableStatement()
            ?.getJsDocs()[0]
            ?.getFullText()
        )
      }
    }
  }
}

ingestModule(
  "../../tsconfig.json",
  "../../packages/shader-composer/src/index.ts"
)

const Morphy = () => {
  return <p>Hiiii</p>
}

export default Morphy
