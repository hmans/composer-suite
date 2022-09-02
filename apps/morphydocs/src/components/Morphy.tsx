import { Project, VariableDeclaration } from "ts-morph"

const module = {
  tsconfig: "../../tsconfig.json",
  mainFile: "../../packages/shader-composer/src/index.ts"
}

const project = new Project({
  tsConfigFilePath: module.tsconfig
})

/* Getting the source file for the main file. */
const indexFile = project.getSourceFileOrThrow(module.mainFile)
const mathFile = project.getSourceFileOrThrow(
  "../../packages/shader-composer/src/stdlib/math.ts"
)

/* Getting all the exported declarations from the index file. */
const exportedDeclarations = indexFile.getExportedDeclarations()

const thingy = exportedDeclarations.get("Negate")![0]

// console.log((thingy as VariableDeclaration).getStructure())
console.log(thingy.getKindName())
console.log((thingy as VariableDeclaration).getVariableStatement())

// const project = await createProject({
//   tsConfigFilePath: "../../tsconfig.json",
//   skipAddingFilesFromTsConfig: true
// })

// await project.addSourceFileAtPath("../../packages/shader-composer/src/index.ts")

// const indexFile = project.getSourceFileOrThrow("../../packages/shader-composer/src/index.ts");
// const exportedDeclarations = indexFile

// const file = project
//   .getLanguageService()
//   .getSyntacticClassifications("../../packages/shader-composer/src/index.ts")
// console.log(file)
// // console.log(project.getSourceFiles()[0])
// // console.log(project.getSourceFiles().map((s) => s.fileName))

const Morphy = () => {
  return <p>Hiiii</p>
}

export default Morphy
