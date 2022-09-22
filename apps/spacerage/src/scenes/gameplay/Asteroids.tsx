import { Asteroid } from "./Asteroid"

export const Asteroids = () => {
  return (
    <>
      <Asteroid position={[5, 3, 0]} />
      <Asteroid position={[-3, -5, 0]} />
    </>
  )
}
