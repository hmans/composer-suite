---
id: "VFX_Composer"
title: "Module: VFX Composer"
sidebar_label: "VFX Composer"
sidebar_position: 0
custom_edit_url: null
---

## Classes

- [Particles](../classes/VFX_Composer.Particles.md)

## Type Aliases

### GLSLTypeFor

Ƭ **GLSLTypeFor**<`J`\>: `J` extends `number` ? ``"float"`` : `J` extends `Vector2` ? ``"vec2"`` : `J` extends `Vector3` ? ``"vec3"`` : `J` extends `Vector4` ? ``"vec4"`` : `J` extends `Color` ? ``"vec3"`` : `never`

#### Type parameters

| Name |
| :------ |
| `J` |

#### Defined in

[packages/vfx-composer/src/ParticleAttribute.ts:7](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/ParticleAttribute.ts#L7)

___

### InstanceSetupCallback

Ƭ **InstanceSetupCallback**: (`config`: { `index`: `number` ; `position`: `Vector3` ; `rotation`: `Quaternion` ; `scale`: `Vector3`  }) => `void`

#### Type declaration

▸ (`config`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Object` |
| `config.index` | `number` |
| `config.position` | `Vector3` |
| `config.rotation` | `Quaternion` |
| `config.scale` | `Vector3` |

##### Returns

`void`

#### Defined in

[packages/vfx-composer/src/Particles.ts:14](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/Particles.ts#L14)

___

### ParticleAttribute

Ƭ **ParticleAttribute**: `ReturnType`<typeof [`ParticleAttribute`](VFX_Composer.md#particleattribute-1)\>

#### Defined in

[packages/vfx-composer/src/ParticleAttribute.ts:19](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/ParticleAttribute.ts#L19)

[packages/vfx-composer/src/ParticleAttribute.ts:22](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/ParticleAttribute.ts#L22)

___

### ParticleUnits

Ƭ **ParticleUnits**: `ReturnType`<typeof [`createParticleUnits`](VFX_Composer.md#createparticleunits)\>

#### Defined in

[packages/vfx-composer/src/createParticleUnits.ts:3](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/createParticleUnits.ts#L3)

## Functions

### ParticleAttribute

▸ **ParticleAttribute**<`J`, `T`\>(`initialValue`): `IUnit`<`T`\> & `UnitAPI`<`T`\> & { `isParticleAttribute`: `boolean` = true; `name`: `string` ; `setupMesh`: (`__namedParameters`: [`Particles`](../classes/VFX_Composer.Particles.md)) => `void` ; `setupParticle`: (`__namedParameters`: [`Particles`](../classes/VFX_Composer.Particles.md)) => `void` ; `value`:   }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `J` | extends `number` \| `Vector2` \| `Vector3` \| `Color` \| `Vector4` |
| `T` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialValue` | `J` |

#### Returns

`IUnit`<`T`\> & `UnitAPI`<`T`\> & { `isParticleAttribute`: `boolean` = true; `name`: `string` ; `setupMesh`: (`__namedParameters`: [`Particles`](../classes/VFX_Composer.Particles.md)) => `void` ; `setupParticle`: (`__namedParameters`: [`Particles`](../classes/VFX_Composer.Particles.md)) => `void` ; `value`:   }

#### Defined in

[packages/vfx-composer/src/ParticleAttribute.ts:22](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/ParticleAttribute.ts#L22)

___

### createParticleUnits

▸ **createParticleUnits**(`lifetime`, `time`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `lifetime` | `Input`<``"vec2"``\> |
| `time` | `Input`<``"float"``\> |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `age` | `Unit`<``"float"``\> |
| `endTime` | `Unit`<``"float"``\> |
| `maxAge` | `Unit`<``"float"``\> |
| `progress` | `Unit`<``"float"``\> |
| `startTime` | `Unit`<``"float"``\> |

#### Defined in

[packages/vfx-composer/src/createParticleUnits.ts:5](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/createParticleUnits.ts#L5)
