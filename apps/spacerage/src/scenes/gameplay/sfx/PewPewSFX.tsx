import { Gain, Oscillator } from "audio-composer"
import { between } from "randomish"
import { useLayoutEffect, useRef } from "react"

export const PewPewSFX = () => {
  const osc1 = useRef<OscillatorNode>(null!)
  const osc2 = useRef<OscillatorNode>(null!)
  const gain2 = useRef<GainNode>(null!)

  useLayoutEffect(() => {
    const t = osc1.current.context.currentTime
    osc1.current.frequency.linearRampToValueAtTime(20, t + 0.3)
    osc2.current.frequency.linearRampToValueAtTime(2000, t + 0.2)
    gain2.current.gain.linearRampToValueAtTime(0, t + 0.2)
  }, [])

  return (
    <Gain volume={0.1}>
      <Oscillator
        type="sine"
        frequency={between(1500, 1900)}
        duration={0.3}
        ref={osc1}
      />
      <Gain volume={0.4} ref={gain2}>
        <Oscillator
          type="sawtooth"
          frequency={between(500, 1500)}
          duration={0.2}
          ref={osc2}
        />
      </Gain>
    </Gain>
  )
}
