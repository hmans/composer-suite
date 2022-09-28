import { useLoader } from "@react-three/fiber"
import * as React from "react"
import { useStore } from "statery"
import { AudioLoader, PositionalAudio as PositionalAudioImpl } from "three"
import { gameplayStore } from "../scenes/gameplay/state"

export type PositionalAudioProps = JSX.IntrinsicElements["positionalAudio"] & {
  url: string
  distance?: number
  loop?: boolean
  volume?: number
}

export const PositionalAudio = React.forwardRef(
  (
    {
      url,
      distance = 1,
      volume = 1,
      loop = false,
      autoplay = true,
      ...props
    }: PositionalAudioProps,
    ref
  ) => {
    const sound = React.useRef<PositionalAudioImpl>(null!)
    const buffer = useLoader(AudioLoader, url)
    const { listener } = useStore(gameplayStore)
    console.log("PositionalAudio", url, listener)

    React.useEffect(() => {
      if (!sound.current || !buffer) return

      sound.current.setBuffer(buffer)
      sound.current.setRefDistance(distance)
      sound.current.setLoop(loop)
      sound.current.setVolume(volume)

      if (autoplay && !sound.current.isPlaying) {
        sound.current.play()
      }
    }, [buffer, distance, loop, listener])

    React.useImperativeHandle(ref, () => sound.current)

    return (
      <>
        {listener && (
          <positionalAudio ref={sound} args={[listener!]} {...props} />
        )}
      </>
    )
  }
)
