import { Filter, Gain, LinearRamp, Oscillator } from "audio-composer"
import { Delay, Repeat } from "timeline-composer"

export const MenuDroneSFX = () => (
  <Gain volume={0.2}>
    <Filter type="bandpass" frequency={50} Q={5}>
      {/* Oscillate the filter's Q property... a lot */}
      <Gain target="Q" volume={5}>
        <Oscillator frequency={3} type="sine">
          {/* Oscillate the the oscillator's oscillation. IT'S OSCILLEPTION */}
          <Gain target="frequency" volume={5}>
            <Oscillator frequency={1} type="sawtooth" />
          </Gain>
        </Oscillator>
      </Gain>

      {/* The actual sound. */}
      <Oscillator frequency={55} type="sawtooth" />

      <Oscillator frequency={440} type="sawtooth" detune={50}>
        <Repeat seconds={20}>
          <LinearRamp property="frequency" duration={10} to={110} />
          <Delay seconds={10}>
            <LinearRamp property="frequency" duration={10} to={440} />
          </Delay>
        </Repeat>
      </Oscillator>

      <Oscillator frequency={110} type="sawtooth" detune={-50}>
        <Repeat seconds={20}>
          <LinearRamp property="frequency" duration={10} to={440} />
          <Delay seconds={10}>
            <LinearRamp property="frequency" duration={10} to={110} />
          </Delay>
        </Repeat>
      </Oscillator>
    </Filter>
  </Gain>
)
