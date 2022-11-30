/*

This module contains GLSL code from the glsl-rotate project. 

https://github.com/dmnsgn/glsl-rotate

Copyright (C) 2018 Damien Seguin

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
IN THE SOFTWARE.

*/

import { glsl } from "../expressions"
import { Snippet } from "../snippets"

export const rotation3d = Snippet(
	(name) => glsl`
		mat4 ${name}(vec3 axis, float angle) {
			axis = normalize(axis);
			float s = sin(angle);
			float c = cos(angle);
			float oc = 1.0 - c;
			return mat4(
				oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
				oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
				oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
				0.0,                                0.0,                                0.0,                                1.0
			);
		}
	`
)

export const rotation3dX = Snippet(
	(name) => glsl`
		mat3 ${name}(float angle) {
			float s = sin(angle);
			float c = cos(angle);
			return mat3(
				1.0, 0.0, 0.0,
				0.0, c, s,
				0.0, -s, c
			);
		}
	`
)

export const rotation3dY = Snippet(
	(name) => glsl`
		mat3 ${name}(float angle) {
			float s = sin(angle);
			float c = cos(angle);
		
			return mat3(
				c, 0.0, -s,
				0.0, 1.0, 0.0,
				s, 0.0, c
			);
		}
	`
)

export const rotation3dZ = Snippet(
	(name) => glsl`
		mat3 ${name}(float angle) {
			float s = sin(angle);
			float c = cos(angle);
		
			return mat3(
				c, s, 0.0,
				-s, c, 0.0,
				0.0, 0.0, 1.0
			);
		}
	`
)
