import { MaterialModules, Velocity } from "material-composer-r3f"
import { Description } from "r3f-stage"
import { useMemo } from "react"
import { Time, Vec3 } from "shader-composer"
import { RGBADepthPacking } from "three"

const Modules = () => {
  const time = useMemo(() => Time(), [])

  return (
    <MaterialModules>
      <Velocity direction={Vec3([0.15, 0, 0])} time={time} />
    </MaterialModules>
  )
}

export default function VelocityExample() {
  return (
    <group position-y={1.5}>
      <mesh castShadow>
        <sphereGeometry />

        {/* Create the actual material */}
        <meshStandardMaterial children={<Modules />} />

        {/* Create a depth material using the same modules */}
        <meshDepthMaterial
          attach="customDepthMaterial"
          depthPacking={RGBADepthPacking}
          children={<Modules />}
        />
      </mesh>

      <Description>
        The <strong>Velocity</strong> module implements stateless velocity
        animation, translating vertices by a given velocity vector multiplied by
        the time. Useful for particles!
      </Description>
    </group>
  )
}
