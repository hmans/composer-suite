import { Gain, LinearRamp, Oscillator } from "audio-composer"
import { between } from "randomish"

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
