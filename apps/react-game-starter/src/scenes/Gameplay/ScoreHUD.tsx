import { Text } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { useStore } from "statery"
import { enemyColor, playerColor } from "./configuration"
import { store } from "./state"

export function ScoreHUD(props: GroupProps) {
  const { playerScore, enemyScore } = useStore(store)

  return (
    <group {...props}>
      <Text fontSize={1.3} color={playerColor} position-x={-2}>
        {playerScore}
      </Text>
      <Text fontSize={1.3} color={enemyColor} position-x={+2}>
        {enemyScore}
      </Text>
    </group>
  )
}
