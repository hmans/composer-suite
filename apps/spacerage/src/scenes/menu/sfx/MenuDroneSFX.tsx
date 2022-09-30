import { Filter, Gain, Oscillator } from "audio-composer"

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
      <Oscillator frequency={220} type="sine" />
    </Filter>
  </Gain>
)
