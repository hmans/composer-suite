import { PositionalAudio, PositionalAudioProps } from "audio-composer"
import { between } from "randomish"
import { ECS } from "./state"

export const Sounds = () => {
  return (
    <ECS.ArchetypeEntities archetype={["sound"]}>
      {({ sound }) => sound}
    </ECS.ArchetypeEntities>
  )
}

export const spawnSound = (props: PositionalAudioProps) =>
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

export const spawnFireSound = (props: Omit<PositionalAudioProps, "url">) =>
  spawnSound({
    ...props,
    url: "/sounds/pew.mp3",
    volume: 0.05,
    rate: between(0.5, 0.6)
  })