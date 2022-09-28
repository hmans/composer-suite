import { PositionalAudio } from "@react-three/drei"
import { PositionalAudioProps } from "@react-three/fiber"
import { between } from "randomish"
import { ECS } from "./state"

export const Sounds = () => {
  return (
    <ECS.ArchetypeEntities archetype={["sound"]}>
      {({ sound }) => sound}
    </ECS.ArchetypeEntities>
  )
}

export const spawnSound = (props: PositionalAudioProps & { url: string }) =>
  ECS.world.createEntity({
    age: 0,
    destroyAfter: 1,

    sound: (
      <PositionalAudio
        distance={between(3, 4)}
        autoplay
        loop={false}
        {...props}
      />
    )
  })

export const spawnFireSound = (props: PositionalAudioProps) =>
  spawnSound({ ...props, url: "/sounds/pew.mp3" })
