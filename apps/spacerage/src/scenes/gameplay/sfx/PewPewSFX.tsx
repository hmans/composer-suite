import { Gain, Oscillator, useAudioContext } from "audio-composer"
import { between } from "randomish"
import { useLayoutEffect } from "react"

export const PewPewSFX = () => (
  <Gain volume={0.1}>
    <LinearRamp property="gain" value={0} duration={0.2} />

    <Oscillator type="sine" frequency={between(1500, 1900)} duration={0.3}>
      <LinearRamp property="frequency" value={20} duration={0.3} />
    </Oscillator>

    <Gain volume={0.4}>
      <Oscillator type="sawtooth" frequency={between(500, 1500)} duration={0.2}>
        <LinearRamp property="frequency" value={2000} duration={0.2} />
      </Oscillator>
    </Gain>
  </Gain>
)

type LinearRampProps = {
  property: string
  value: number
  duration: number
}

const LinearRamp = ({ value, duration, property }: LinearRampProps) => {
  const parent = useAudioContext()

  useLayoutEffect(() => {
    if (!parent) return

    const t = parent.context.currentTime
    const prop = parent[property] as AudioParam

    if (!prop) {
      console.error("Invalid property", property)
      return
    }

    prop.linearRampToValueAtTime(value, t + duration)
  }, [parent])

  return null
}
