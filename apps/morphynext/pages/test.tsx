import { InferGetStaticPropsType, NextPage } from "next"
import morphy from "../src/morphy"
import { GetStaticProps } from "next"

const Test: NextPage = ({
  symbols
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <p>hi!</p>
}

export const getStaticProps: GetStaticProps = async (context) => {
  const symbols = morphy(
    "../../tsconfig.json",
    "../../packages/shader-composer/src/index.ts"
  )

  console.log(symbols)

  return {
    props: { symbols }
  }
}

export default Test
