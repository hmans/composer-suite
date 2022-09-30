import { Filter, Gain, LinearRamp, Oscillator, Reverb } from "audio-composer"
import { Delay, Repeat } from "timeline-composer"

export const MenuDroneSFX = () => (
  <Gain volume={0.1}>
    <Reverb>
      <Filter type="lowpass" frequency={100}>
        <Oscillator type="sawtooth" frequency={55} />
        <Oscillator type="sawtooth" frequency={55} detune={10} />
        <Oscillator type="sawtooth" frequency={55} detune={-10} />
      </Filter>
    </Reverb>
  </Gain>
)
