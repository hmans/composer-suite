import { Filter, Gain, Oscillator, Reverb } from "audio-composer"

export const MenuDroneSFX = () => (
  <Gain volume={0.1}>
    <Reverb>
      <Filter type="lowpass" frequency={200}>
        <Oscillator type="sawtooth" frequency={55} />
        <Oscillator type="sawtooth" frequency={55} detune={10} />
        <Oscillator type="sawtooth" frequency={55} detune={-10} />
      </Filter>
    </Reverb>
  </Gain>
)
