[Material Composer](../README.md) / [Modules](../modules.md) / modules

# Module: modules

## Table of contents

### Type Aliases

- [AccelerationProps](modules.md#accelerationprops)
- [AlphaArgs](modules.md#alphaargs)
- [ColorArgs](modules.md#colorargs)
- [FresnelArgs](modules.md#fresnelargs)
- [GradientArgs](modules.md#gradientargs)
- [Space](modules.md#space)
- [SurfaceWobbleProps](modules.md#surfacewobbleprops)
- [TextureArgs](modules.md#textureargs)

### Functions

- [Acceleration](modules.md#acceleration)
- [Alpha](modules.md#alpha)
- [Billboard](modules.md#billboard)
- [Color](modules.md#color)
- [CustomModule](modules.md#custommodule)
- [Fresnel](modules.md#fresnel)
- [Gradient](modules.md#gradient)
- [Lifetime](modules.md#lifetime)
- [Rotate](modules.md#rotate)
- [Scale](modules.md#scale)
- [Softness](modules.md#softness)
- [SurfaceWobble](modules.md#surfacewobble)
- [Texture](modules.md#texture)
- [Translate](modules.md#translate)
- [Velocity](modules.md#velocity)

## Type Aliases

### AccelerationProps

Ƭ **AccelerationProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `direction` | `Input`<``"vec3"``\> |
| `space?` | [`Space`](modules.md#space) |
| `time` | `Input`<``"float"``\> |

#### Defined in

[material-composer/src/modules/Acceleration.ts:6](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/modules/Acceleration.ts#L6)

___

### AlphaArgs

Ƭ **AlphaArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `alpha` | `Input`<``"float"``\> \| (`a`: `Input`<``"float"``\>) => `Input`<``"float"``\> |

#### Defined in

[material-composer/src/modules/Alpha.ts:4](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/modules/Alpha.ts#L4)

___

### ColorArgs

Ƭ **ColorArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `color` | `Input`<``"vec3"``\> \| `ColorRepresentation` \| (`a`: `Input`<``"vec3"``\>) => `Input`<``"vec3"``\> |

#### Defined in

[material-composer/src/modules/Color.ts:5](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/modules/Color.ts#L5)

___

### FresnelArgs

Ƭ **FresnelArgs**: `FresnelProps`

#### Defined in

[material-composer/src/modules/Fresnel.ts:6](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/modules/Fresnel.ts#L6)

___

### GradientArgs

Ƭ **GradientArgs**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `contrast?` | `Input`<``"float"``\> | Contrast. Increase this above 1 to weigh the gradient towards its center. |
| `position?` | `Input`<``"float"``\> | Position within the gradient. This defaults to the vertex position on the Y axis. |
| `start?` | `Input`<``"float"``\> | Start of the range that the `position` value moves within. |
| `stop?` | `Input`<``"float"``\> | End of the range that the `position` value moves within. |
| `stops` | `GradientStop`<``"vec3"``\>[] | The gradient, as defined by a list of vec3 gradient stops. |

#### Defined in

[material-composer/src/modules/Gradient.ts:14](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/modules/Gradient.ts#L14)

___

### Space

Ƭ **Space**: ``"world"`` \| ``"local"`` \| ``"view"``

#### Defined in

[material-composer/src/modules/Translate.ts:5](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/modules/Translate.ts#L5)

___

### SurfaceWobbleProps

Ƭ **SurfaceWobbleProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amplitude?` | `Input`<``"float"``\> |
| `offset?` | `Input`<``"vec3"`` \| ``"float"``\> |

#### Defined in

[material-composer/src/modules/SurfaceWobble.ts:6](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/modules/SurfaceWobble.ts#L6)

___

### TextureArgs

Ƭ **TextureArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `texture` | `Unit`<``"sampler2D"``\> \| `THREE.Texture` |
| `uv?` | `Unit`<``"vec2"``\> |

#### Defined in

[material-composer/src/modules/Texture.ts:5](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/modules/Texture.ts#L5)

## Functions

### Acceleration

▸ **Acceleration**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`AccelerationProps`](modules.md#accelerationprops) |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/index.ts#L33)

___

### Alpha

▸ **Alpha**(`__namedParameters`): [`Module`](index.md#module)

Sets or modifies the fragment's alpha value.

**`Example`**

This will set the alpha value to 0.5:

```jsx
Alpha({ alpha: 0.5 })
```

Just like any other module, you can use a Shader Composer sub-graph here:

```jsx
Alpha({ alpha: NormalizePlusMinusOne(Sin(Time())) })
```

Alternatively, you can pass a function; this function will receive the _current_ alpha value as its argument.
This gives you a chance to modify the value instead of overwriting it:

```jsx
Alpha({ alpha: (alpha) => Mul(alpha, 0.5) })
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`AlphaArgs`](modules.md#alphaargs) |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/modules/Alpha.ts:35](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/modules/Alpha.ts#L35)

___

### Billboard

▸ **Billboard**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `Object` |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/index.ts#L33)

___

### Color

▸ **Color**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`ColorArgs`](modules.md#colorargs) |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/index.ts#L33)

___

### CustomModule

▸ **CustomModule**(`__namedParameters`): [`Module`](index.md#module)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.module` | [`Module`](index.md#module) |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/modules/index.ts:18](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/modules/index.ts#L18)

___

### Fresnel

▸ **Fresnel**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `FresnelProps` |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/index.ts#L33)

___

### Gradient

▸ **Gradient**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`GradientArgs`](modules.md#gradientargs) |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/index.ts#L33)

___

### Lifetime

▸ **Lifetime**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `Object` |
| `props.progress` | `Input`<``"float"``\> |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/index.ts#L33)

___

### Rotate

▸ **Rotate**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `RotateProps` |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/index.ts#L33)

___

### Scale

▸ **Scale**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `ScaleProps` |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/index.ts#L33)

___

### Softness

▸ **Softness**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `Object` |
| `props.depthTexture` | `Unit`<``"sampler2D"``\> |
| `props.softness` | `Input`<``"float"``\> |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/index.ts#L33)

___

### SurfaceWobble

▸ **SurfaceWobble**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`SurfaceWobbleProps`](modules.md#surfacewobbleprops) |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/index.ts#L33)

___

### Texture

▸ **Texture**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`TextureArgs`](modules.md#textureargs) |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/index.ts#L33)

___

### Translate

▸ **Translate**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `TranslateProps` |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/index.ts#L33)

___

### Velocity

▸ **Velocity**(`__namedParameters`): [`Module`](index.md#module)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `VelocityProps` |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/modules/Velocity.ts:10](https://github.com/hmans/composer-suite/blob/cba622ee/packages/material-composer/src/modules/Velocity.ts#L10)
