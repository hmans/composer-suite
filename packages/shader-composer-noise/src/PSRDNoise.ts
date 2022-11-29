/*

This module contains a number of Shader Composer-specific implementations of
Stefan Gustavson's and Ian McEwan's PSRDNoise algorithms, from this repository:

https://github.com/stegu/psrdnoise/tree/main/src

Original license notices are included with the functions.

*/

import {
  $,
  Float,
  glsl,
  Input,
  Snippet,
  Vec2,
  Vec3
} from "@shader-composer/core"

export const psrdnoise2 = Snippet(
  (psrdnoise2) => glsl`
    //
    // psrdnoise2.glsl
    //
    // Authors: Stefan Gustavson (stefan.gustavson@gmail.com)
    // and Ian McEwan (ijm567@gmail.com)
    // Version 2021-12-02, published under the MIT license (see below)
    //
    // Copyright (c) 2021 Stefan Gustavson and Ian McEwan.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the "Software"),
    // to deal in the Software without restriction, including without limitation
    // the rights to use, copy, modify, merge, publish, distribute, sublicense,
    // and/or sell copies of the Software, and to permit persons to whom the
    // Software is furnished to do so, subject to the following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
    // THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    // FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    // DEALINGS IN THE SOFTWARE.
    //

    //
    // Periodic (tiling) 2-D simplex noise (hexagonal lattice gradient noise)
    // with rotating gradients and analytic derivatives.
    //
    // This is (yet) another variation on simplex noise. Unlike previous
    // implementations, the grid is axis-aligned and slightly stretched in
    // the y direction to permit rectangular tiling.
    // The noise pattern can be made to tile seamlessly to any integer period
    // in x and any even integer period in y. Odd periods may be specified
    // for y, but then the actual tiling period will be twice that number.
    //
    // The rotating gradients give the appearance of a swirling motion, and
    // can serve a similar purpose for animation as motion along z in 3-D
    // noise. The rotating gradients in conjunction with the analytic
    // derivatives allow for "flow noise" effects as presented by Ken
    // Perlin and Fabrice Neyret.
    //


    //
    // 2-D tiling simplex noise with rotating gradients and analytical derivative.
    // "vec2 x" is the point (x,y) to evaluate,
    // "vec2 period" is the desired periods along x and y, and
    // "float alpha" is the rotation (in radians) for the swirling gradients.
    // The "float" return value is the noise value, and
    // the "out vec2 gradient" argument returns the x,y partial derivatives.
    //
    // Setting either period to 0.0 or a negative value will skip the wrapping
    // along that dimension. Setting both periods to 0.0 makes the function
    // execute about 15% faster.
    //
    // Not using the return value for the gradient will make the compiler
    // eliminate the code for computing it. This speeds up the function
    // by 10-15%.
    //
    // The rotation by alpha uses one single addition. Unlike the 3-D version
    // of psrdnoise(), setting alpha == 0.0 gives no speedup.
    //

    float ${psrdnoise2}(vec2 x, vec2 period, float alpha, out vec2 gradient) {
      // Transform to simplex space (axis-aligned hexagonal grid)
      vec2 uv = vec2(x.x + x.y*0.5, x.y);

      // Determine which simplex we're in, with i0 being the "base"
      vec2 i0 = floor(uv);
      vec2 f0 = fract(uv);

      // o1 is the offset in simplex space to the second corner
      float cmp = step(f0.y, f0.x);
      vec2 o1 = vec2(cmp, 1.0-cmp);

      // Enumerate the remaining simplex corners
      vec2 i1 = i0 + o1;
      vec2 i2 = i0 + vec2(1.0, 1.0);

      // Transform corners back to texture space
      vec2 _v0 = vec2(i0.x - i0.y * 0.5, i0.y);
      vec2 _v1 = vec2(_v0.x + o1.x - o1.y * 0.5, _v0.y + o1.y);
      vec2 _v2 = vec2(_v0.x + 0.5, _v0.y + 1.0);

      // Compute vectors from v to each of the simplex corners
      vec2 x0 = x - _v0;
      vec2 x1 = x - _v1;
      vec2 x2 = x - _v2;

      vec3 iu, iv;
      vec3 xw, yw;

      // Wrap to periods, if desired
      if(any(greaterThan(period, vec2(0.0)))) {
        xw = vec3(_v0.x, _v1.x, _v2.x);
        yw = vec3(_v0.y, _v1.y, _v2.y);

        if(period.x > 0.0)
          xw = mod(vec3(_v0.x, _v1.x, _v2.x), period.x);

        if(period.y > 0.0)
          yw = mod(vec3(_v0.y, _v1.y, _v2.y), period.y);

        // Transform back to simplex space and fix rounding errors
        iu = floor(xw + 0.5*yw + 0.5);
        iv = floor(yw + 0.5);
      } else {
        // Shortcut if neither x nor y periods are specified
        iu = vec3(i0.x, i1.x, i2.x);
        iv = vec3(i0.y, i1.y, i2.y);
      }

      // Compute one pseudo-random hash value for each corner
      vec3 hash = mod(iu, 289.0);
      hash = mod((hash*51.0 + 2.0)*hash + iv, 289.0);
      hash = mod((hash*34.0 + 10.0)*hash, 289.0);

      // Pick a pseudo-random angle and add the desired rotation
      vec3 psi = hash * 0.07482 + alpha;
      vec3 gx = cos(psi);
      vec3 gy = sin(psi);

      // Reorganize for dot products below
      vec2 g0 = vec2(gx.x,gy.x);
      vec2 g1 = vec2(gx.y,gy.y);
      vec2 g2 = vec2(gx.z,gy.z);

      // Radial decay with distance from each simplex corner
      vec3 w = 0.8 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2));
      w = max(w, 0.0);
      vec3 w2 = w * w;
      vec3 w4 = w2 * w2;

      // The value of the linear ramp from each of the corners
      vec3 gdotx = vec3(dot(g0, x0), dot(g1, x1), dot(g2, x2));

      // Multiply by the radial decay and sum up the noise value
      float n = dot(w4, gdotx);

      // Compute the first order partial derivatives
      vec3 w3 = w2 * w;
      vec3 dw = -8.0 * w3 * gdotx;
      vec2 dn0 = w4.x * g0 + dw.x * x0;
      vec2 dn1 = w4.y * g1 + dw.y * x1;
      vec2 dn2 = w4.z * g2 + dw.z * x2;
      gradient = 10.9 * (dn0 + dn1 + dn2);

      // Scale the return value to fit nicely into the range [-1,1]
      return 10.9 * n;
    }
  `
)

export const PSRDNoise2D = (
  p: Input<"vec2">,
  period: Input<"vec2"> = [0, 0],
  alpha: Input<"float"> = 0
) => {
  const gradient = Vec2([0, 0], {
    name: "PSRDNoise2D Gradient"
  })

  const unit = Float($`${psrdnoise2}(${p}, ${period}, ${alpha}, ${gradient})`, {
    name: "PSRDNoise2D"
  })

  return {
    ...unit,
    gradient
  }
}

export const psrdnoise3 = Snippet(
  (psrdnoise3) => glsl`
    //
    // psrdnoise3.glsl
    //
    // Authors: Stefan Gustavson (stefan.gustavson@gmail.com)
    // and Ian McEwan (ijm567@gmail.com)
    // Version 2021-12-02, published under the MIT license (see below)
    //
    // Copyright (c) 2021 Stefan Gustavson and Ian McEwan.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the "Software"),
    // to deal in the Software without restriction, including without limitation
    // the rights to use, copy, modify, merge, publish, distribute, sublicense,
    // and/or sell copies of the Software, and to permit persons to whom the
    // Software is furnished to do so, subject to the following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
    // THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    // FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    // DEALINGS IN THE SOFTWARE.
    //

    //
    // Periodic (tiling) 3-D simplex noise (tetrahedral lattice gradient noise)
    // with rotating gradients and analytic derivatives.
    //
    // This is (yet) another variation on simplex noise. Unlike previous
    // implementations, the grid is axis-aligned to permit rectangular tiling.
    // The noise pattern can be made to tile seamlessly to any integer periods
    // up to 289 units in the x, y and z directions. Specifying a longer
    // period than 289 will result in errors in the noise field.
    //
    // This particular version of 3-D noise also implements animation by rotating
    // the generating gradient at each lattice point around a pseudo-random axis.
    // The rotating gradients give the appearance of a swirling motion, and
    // can serve a similar purpose for animation as motion along the fourth
    // dimension in 4-D noise.
    //
    // The rotating gradients in conjunction with the built-in ability to
    // compute exact analytic derivatives allow for "flow noise" effects
    // as presented by Ken Perlin and Fabrice Neyret.
    //

    // Use Perlin's rotated grid instead of the new tiling grid?
    // Enabling this adds about 1% to the execution time and
    // requires all periods to be multiples of 3. Other
    // integer periods can be specified, but when not evenly
    // divisible by 3, the actual period will be 3 times longer.
    // Take care not to overstep the maximum allowed period (288).
    //#define PERLINGRID

    // Enable faster gradient rotations?
    // Enabling this saves about 10% on execution time,
    // but the function will not run faster for alpha = 0.
    #define FASTROTATION


    // Permutation polynomial for the hash value
    vec4 ${psrdnoise3}_permute(vec4 x) {
      vec4 xm = mod(x, 289.0);
      return mod(((xm * 34.0) + 10.0) * xm, 289.0);
    }

    //
    // 3-D tiling simplex noise with rotating gradients and first order
    // analytical derivatives.
    // "vec3 x" is the point (x,y,z) to evaluate
    // "vec3 period" is the desired periods along x,y,z, up to 289.
    // (If Perlin's grid is used, multiples of 3 up to 288 are allowed.)
    // "float alpha" is the rotation (in radians) for the swirling gradients.
    // The "float" return value is the noise value, and
    // the "out vec3 gradient" argument returns the x,y,z partial derivatives.
    //
    // The function executes 15-20% faster if alpha is constant == 0.0
    // across all fragments being executed in parallel.
    // (This speedup will not happen if FASTROTATION is enabled. Do not specify
    // FASTROTATION if you are not actually going to use the rotation.)
    //
    // Setting any period to 0.0 or a negative value will skip the periodic
    // wrap for that dimension. Setting all periods to 0.0 makes the function
    // execute 10-15% faster.
    //
    // Not using the return value for the gradient will make the compiler
    // eliminate the code for computing it. This speeds up the function by
    // around 10%.
    //

    float ${psrdnoise3}(vec3 x, vec3 period, float alpha, out vec3 gradient)
    {
      #ifndef PERLINGRID
      // Transformation matrices for the axis-aligned simplex grid
      const mat3 M = mat3(0.0, 1.0, 1.0,
                          1.0, 0.0, 1.0,
                          1.0, 1.0, 0.0);

      const mat3 Mi = mat3(-0.5, 0.5, 0.5,
                            0.5,-0.5, 0.5,
                            0.5, 0.5,-0.5);
      #endif

      vec3 uvw;

      // Transform to simplex space (tetrahedral grid)
      #ifndef PERLINGRID
      // Use matrix multiplication, let the compiler optimise
      uvw = M * x;
      #else
      // Optimised transformation to uvw (slightly faster than
      // the equivalent matrix multiplication on most platforms)
      uvw = x + dot(x, vec3(1.0/3.0));
      #endif

      // Determine which simplex we're in, i0 is the "base corner"
      vec3 i0 = floor(uvw);
      vec3 f0 = fract(uvw); // coords within "skewed cube"

      // To determine which simplex corners are closest, rank order the
      // magnitudes of u,v,w, resolving ties in priority order u,v,w,
      // and traverse the four corners from largest to smallest magnitude.
      // o1, o2 are offsets in simplex space to the 2nd and 3rd corners.
      vec3 g_ = step(f0.xyx, f0.yzz); // Makes comparison "less-than"
      vec3 l_ = 1.0 - g_;             // complement is "greater-or-equal"
      vec3 g = vec3(l_.z, g_.xy);
      vec3 l = vec3(l_.xy, g_.z);
      vec3 o1 = min( g, l );
      vec3 o2 = max( g, l );

      // Enumerate the remaining simplex corners
      vec3 i1 = i0 + o1;
      vec3 i2 = i0 + o2;
      vec3 i3 = i0 + vec3(1.0);
      vec3 _v0;
      vec3 _v1;
      vec3 _v2;
      vec3 v3;

      // Transform the corners back to texture space
      #ifndef PERLINGRID
        _v0 = Mi * i0;
        _v1 = Mi * i1;
        _v2 = Mi * i2;
        v3 = Mi * i3;
      #else
        // Optimised transformation (mostly slightly faster than a matrix)
        _v0 = i0 - dot(i0, vec3(1.0/6.0));
        _v1 = i1 - dot(i1, vec3(1.0/6.0));
        _v2 = i2 - dot(i2, vec3(1.0/6.0));
        v3 = i3 - dot(i3, vec3(1.0/6.0));
      #endif

      // Compute vectors to each of the simplex corners
      vec3 x0 = x - _v0;
      vec3 x1 = x - _v1;
      vec3 x2 = x - _v2;
      vec3 x3 = x - v3;

      if(any(greaterThan(period, vec3(0.0)))) {
        // Wrap to periods and transform back to simplex space
        vec4 vx = vec4(_v0.x, _v1.x, _v2.x, v3.x);
        vec4 vy = vec4(_v0.y, _v1.y, _v2.y, v3.y);
        vec4 vz = vec4(_v0.z, _v1.z, _v2.z, v3.z);

        // Wrap to periods where specified
        if (period.x > 0.0) vx = mod(vx, period.x);
        if (period.y > 0.0) vy = mod(vy, period.y);
        if (period.z > 0.0) vz = mod(vz, period.z);

        // Transform back
        #ifndef PERLINGRID
          i0 = M * vec3(vx.x, vy.x, vz.x);
          i1 = M * vec3(vx.y, vy.y, vz.y);
          i2 = M * vec3(vx.z, vy.z, vz.z);
          i3 = M * vec3(vx.w, vy.w, vz.w);
        #else
          _v0 = vec3(vx.x, vy.x, vz.x);
          _v1 = vec3(vx.y, vy.y, vz.y);
          _v2 = vec3(vx.z, vy.z, vz.z);
          v3 = vec3(vx.w, vy.w, vz.w);
          // Transform wrapped coordinates back to uvw
          i0 = _v0 + dot(_v0, vec3(1.0/3.0));
          i1 = _v1 + dot(_v1, vec3(1.0/3.0));
          i2 = _v2 + dot(_v2, vec3(1.0/3.0));
          i3 = v3 + dot(v3, vec3(1.0/3.0));
        #endif

        // Fix rounding errors
        i0 = floor(i0 + 0.5);
        i1 = floor(i1 + 0.5);
        i2 = floor(i2 + 0.5);
        i3 = floor(i3 + 0.5);
      }

      // Compute one pseudo-random hash value for each corner
      vec4 hash = ${psrdnoise3}_permute( ${psrdnoise3}_permute( ${psrdnoise3}_permute(
                vec4(i0.z, i1.z, i2.z, i3.z ))
              + vec4(i0.y, i1.y, i2.y, i3.y ))
              + vec4(i0.x, i1.x, i2.x, i3.x ));

      // Compute generating gradients from a Fibonacci spiral on the unit sphere
      vec4 theta = hash * 3.883222077;  // 2*pi/golden ratio
      vec4 sz    = hash * -0.006920415 + 0.996539792; // 1-(hash+0.5)*2/289
      vec4 psi   = hash * 0.108705628 ; // 10*pi/289, chosen to avoid correlation

      vec4 Ct = cos(theta);
      vec4 St = sin(theta);
      vec4 sz_prime = sqrt( 1.0 - sz*sz ); // s is a point on a unit fib-sphere

      vec4 gx, gy, gz;

      // Rotate gradients by angle alpha around a pseudo-random ortogonal axis
      #ifdef FASTROTATION
        // Fast algorithm, but without dynamic shortcut for alpha = 0
        vec4 qx = St;         // q' = norm ( cross(s, n) )  on the equator
        vec4 qy = -Ct;
        vec4 qz = vec4(0.0);

        vec4 px =  sz * qy;   // p' = cross(q, s)
        vec4 py = -sz * qx;
        vec4 pz = sz_prime;

        psi += alpha;         // psi and alpha in the same plane
        vec4 Sa = sin(psi);
        vec4 Ca = cos(psi);

        gx = Ca * px + Sa * qx;
        gy = Ca * py + Sa * qy;
        gz = Ca * pz + Sa * qz;
      #else
        // Slightly slower algorithm, but with g = s for alpha = 0, and a
        // useful conditional speedup for alpha = 0 across all fragments
        if(alpha != 0.0) {
          vec4 Sp = sin(psi);          // q' from psi on equator
          vec4 Cp = cos(psi);

          vec4 px = Ct * sz_prime;     // px = sx
          vec4 py = St * sz_prime;     // py = sy
          vec4 pz = sz;

          vec4 Ctp = St*Sp - Ct*Cp;    // q = (rotate( cross(s,n), dot(s,n))(q')
          vec4 qx = mix( Ctp*St, Sp, sz);
          vec4 qy = mix(-Ctp*Ct, Cp, sz);
          vec4 qz = -(py*Cp + px*Sp);

          vec4 Sa = vec4(sin(alpha));       // psi and alpha in different planes
          vec4 Ca = vec4(cos(alpha));

          gx = Ca * px + Sa * qx;
          gy = Ca * py + Sa * qy;
          gz = Ca * pz + Sa * qz;
        } else {
          gx = Ct * sz_prime;  // alpha = 0, use s directly as gradient
          gy = St * sz_prime;
          gz = sz;
        }
      #endif

      // Reorganize for dot products below
      vec3 g0 = vec3(gx.x, gy.x, gz.x);
      vec3 g1 = vec3(gx.y, gy.y, gz.y);
      vec3 g2 = vec3(gx.z, gy.z, gz.z);
      vec3 g3 = vec3(gx.w, gy.w, gz.w);

      // Radial decay with distance from each simplex corner
      vec4 w = 0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3));
      w = max(w, 0.0);
      vec4 w2 = w * w;
      vec4 w3 = w2 * w;

      // The value of the linear ramp from each of the corners
      vec4 gdotx = vec4(dot(g0,x0), dot(g1,x1), dot(g2,x2), dot(g3,x3));

      // Multiply by the radial decay and sum up the noise value
      float n = dot(w3, gdotx);

      // Compute the first order partial derivatives
      vec4 dw = -6.0 * w2 * gdotx;
      vec3 dn0 = w3.x * g0 + dw.x * x0;
      vec3 dn1 = w3.y * g1 + dw.y * x1;
      vec3 dn2 = w3.z * g2 + dw.z * x2;
      vec3 dn3 = w3.w * g3 + dw.w * x3;
      gradient = 39.5 * (dn0 + dn1 + dn2 + dn3);

      // Scale the return value to fit nicely into the range [-1,1]
      return 39.5 * n;
    }
  `
)

export const PSRDNoise3D = (
  p: Input<"vec3">,
  period: Input<"vec3"> = [0, 0, 0],
  alpha: Input<"float"> = 0
) => {
  const gradient = Vec3([0, 0, 0], {
    name: "PSRDNoise3D Gradient"
  })

  const unit = Float($`${psrdnoise3}(${p}, ${period}, ${alpha}, ${gradient})`, {
    name: "PSRDNoise3D"
  })

  return {
    ...unit,
    gradient
  }
}
