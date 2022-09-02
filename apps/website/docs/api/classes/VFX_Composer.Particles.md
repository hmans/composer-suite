---
id: "VFX_Composer.Particles"
title: "Class: Particles"
sidebar_label: "Particles"
custom_edit_url: null
---

[VFX Composer](../modules/VFX_Composer.md).Particles

## Hierarchy

- `InstancedMesh`<`BufferGeometry`\>

  ↳ **`Particles`**

## Constructors

### constructor

• **new Particles**(`geometry`, `material`, `capacity?`, `safetyCapacity?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `geometry` | `undefined` \| `BufferGeometry` | `undefined` |
| `material` | `undefined` \| `Material` | `undefined` |
| `capacity` | `number` | `1000` |
| `safetyCapacity` | `number` | `undefined` |

#### Overrides

InstancedMesh&lt;BufferGeometry\&gt;.constructor

#### Defined in

[packages/vfx-composer/src/Particles.ts:41](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/Particles.ts#L41)

## Properties

### animations

• **animations**: `AnimationClip`[]

Array with animation clips.

**`Default`**

[]

#### Inherited from

InstancedMesh.animations

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:160

___

### attributeUnits

• `Private` **attributeUnits**: `Object`[] = `[]`

#### Defined in

[packages/vfx-composer/src/Particles.ts:32](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/Particles.ts#L32)

___

### capacity

• **capacity**: `number`

#### Defined in

[packages/vfx-composer/src/Particles.ts:29](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/Particles.ts#L29)

___

### castShadow

• **castShadow**: `boolean`

Gets rendered into shadow map.

**`Default`**

false

#### Inherited from

InstancedMesh.castShadow

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:133

___

### children

• **children**: `Object3D`<`Event`\>[]

Array with object's children.

**`Default`**

[]

#### Inherited from

InstancedMesh.children

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:51

___

### count

• **count**: `number`

#### Inherited from

InstancedMesh.count

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/InstancedMesh.d.ts:15

___

### cursor

• **cursor**: `number` = `0`

#### Defined in

[packages/vfx-composer/src/Particles.ts:28](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/Particles.ts#L28)

___

### customDepthMaterial

• **customDepthMaterial**: `Material`

Custom depth material to be used when rendering to the depth map. Can only be used in context of meshes.
When shadow-casting with a DirectionalLight or SpotLight, if you are (a) modifying vertex positions in
the vertex shader, (b) using a displacement map, (c) using an alpha map with alphaTest, or (d) using a
transparent texture with alphaTest, you must specify a customDepthMaterial for proper shadows.

#### Inherited from

InstancedMesh.customDepthMaterial

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:174

___

### customDistanceMaterial

• **customDistanceMaterial**: `Material`

Same as customDepthMaterial, but used with PointLight.

#### Inherited from

InstancedMesh.customDistanceMaterial

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:179

___

### frustumCulled

• **frustumCulled**: `boolean`

When this is set, it checks every frame if the object is in the frustum of the camera before rendering the object.
If set to false the object gets rendered every frame even if it is not in the frustum of the camera.

**`Default`**

true

#### Inherited from

InstancedMesh.frustumCulled

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:146

___

### geometry

• **geometry**: `BufferGeometry`

#### Inherited from

InstancedMesh.geometry

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/Mesh.d.ts:13

___

### id

• **id**: `number`

Unique number of this object instance.

#### Inherited from

InstancedMesh.id

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:26

___

### instanceColor

• **instanceColor**: ``null`` \| `InstancedBufferAttribute`

#### Inherited from

InstancedMesh.instanceColor

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/InstancedMesh.d.ts:16

___

### instanceMatrix

• **instanceMatrix**: `InstancedBufferAttribute`

#### Inherited from

InstancedMesh.instanceMatrix

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/InstancedMesh.d.ts:17

___

### isInstancedMesh

• `Readonly` **isInstancedMesh**: ``true``

#### Inherited from

InstancedMesh.isInstancedMesh

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/InstancedMesh.d.ts:18

___

### isMesh

• `Readonly` **isMesh**: ``true``

#### Inherited from

InstancedMesh.isMesh

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/Mesh.d.ts:17

___

### isObject3D

• `Readonly` **isObject3D**: ``true``

Used to check whether this or derived classes are Object3Ds. Default is true.
You should not change this, as it is used internally for optimisation.

#### Inherited from

InstancedMesh.isObject3D

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:185

___

### lastCursor

• `Private` **lastCursor**: `number` = `0`

#### Defined in

[packages/vfx-composer/src/Particles.ts:39](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/Particles.ts#L39)

___

### layers

• **layers**: `Layers`

**`Default`**

new THREE.Layers()

#### Inherited from

InstancedMesh.layers

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:121

___

### material

• **material**: `Material` \| `Material`[]

#### Inherited from

InstancedMesh.material

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/Mesh.d.ts:14

___

### matrix

• **matrix**: `Matrix4`

Local transform.

**`Default`**

new THREE.Matrix4()

#### Inherited from

InstancedMesh.matrix

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:97

___

### matrixAutoUpdate

• **matrixAutoUpdate**: `boolean`

When this is set, it calculates the matrix of position, (rotation or quaternion) and scale every frame and also
recalculates the matrixWorld property.

**`Default`**

THREE.Object3D.DefaultMatrixAutoUpdate

#### Inherited from

InstancedMesh.matrixAutoUpdate

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:110

___

### matrixWorld

• **matrixWorld**: `Matrix4`

The global transform of the object. If the Object3d has no parent, then it's identical to the local transform.

**`Default`**

new THREE.Matrix4()

#### Inherited from

InstancedMesh.matrixWorld

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:103

___

### matrixWorldNeedsUpdate

• **matrixWorldNeedsUpdate**: `boolean`

When this is set, it calculates the matrixWorld in that frame and resets this property to false.

**`Default`**

false

#### Inherited from

InstancedMesh.matrixWorldNeedsUpdate

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:116

___

### modelViewMatrix

• `Readonly` **modelViewMatrix**: `Matrix4`

**`Default`**

new THREE.Matrix4()

#### Inherited from

InstancedMesh.modelViewMatrix

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:86

___

### morphTargetDictionary

• `Optional` **morphTargetDictionary**: `Object`

#### Index signature

▪ [key: `string`]: `number`

#### Inherited from

InstancedMesh.morphTargetDictionary

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/Mesh.d.ts:16

___

### morphTargetInfluences

• `Optional` **morphTargetInfluences**: `number`[]

#### Inherited from

InstancedMesh.morphTargetInfluences

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/Mesh.d.ts:15

___

### name

• **name**: `string`

Optional name of the object (doesn't need to be unique).

**`Default`**

''

#### Inherited from

InstancedMesh.name

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:34

___

### normalMatrix

• `Readonly` **normalMatrix**: `Matrix3`

**`Default`**

new THREE.Matrix3()

#### Inherited from

InstancedMesh.normalMatrix

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:91

___

### onAfterRender

• **onAfterRender**: (`renderer`: `WebGLRenderer`, `scene`: `Scene`, `camera`: `Camera`, `geometry`: `BufferGeometry`, `material`: `Material`, `group`: `Group`) => `void`

#### Type declaration

▸ (`renderer`, `scene`, `camera`, `geometry`, `material`, `group`): `void`

Calls after rendering object

##### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `WebGLRenderer` |
| `scene` | `Scene` |
| `camera` | `Camera` |
| `geometry` | `BufferGeometry` |
| `material` | `Material` |
| `group` | `Group` |

##### Returns

`void`

#### Inherited from

InstancedMesh.onAfterRender

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:202

___

### onBeforeRender

• **onBeforeRender**: (`renderer`: `WebGLRenderer`, `scene`: `Scene`, `camera`: `Camera`, `geometry`: `BufferGeometry`, `material`: `Material`, `group`: `Group`) => `void`

#### Type declaration

▸ (`renderer`, `scene`, `camera`, `geometry`, `material`, `group`): `void`

Calls before rendering object

##### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `WebGLRenderer` |
| `scene` | `Scene` |
| `camera` | `Camera` |
| `geometry` | `BufferGeometry` |
| `material` | `Material` |
| `group` | `Group` |

##### Returns

`void`

#### Inherited from

InstancedMesh.onBeforeRender

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:190

___

### parent

• **parent**: ``null`` \| `Object3D`<`Event`\>

Object's parent in the scene graph.

**`Default`**

null

#### Inherited from

InstancedMesh.parent

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:45

___

### position

• `Readonly` **position**: `Vector3`

Object's local position.

**`Default`**

new THREE.Vector3()

#### Inherited from

InstancedMesh.position

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:63

___

### quaternion

• `Readonly` **quaternion**: `Quaternion`

Object's local rotation as a Quaternion.

**`Default`**

new THREE.Quaternion()

#### Inherited from

InstancedMesh.quaternion

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:75

___

### receiveShadow

• **receiveShadow**: `boolean`

Material gets baked in shadow receiving.

**`Default`**

false

#### Inherited from

InstancedMesh.receiveShadow

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:139

___

### renderOrder

• **renderOrder**: `number`

Overrides the default rendering order of scene graph objects, from lowest to highest renderOrder.
Opaque and transparent objects remain sorted independently though.
When this property is set for an instance of Group, all descendants objects will be sorted and rendered together.

**`Default`**

0

#### Inherited from

InstancedMesh.renderOrder

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:154

___

### rotation

• `Readonly` **rotation**: `Euler`

Object's local rotation (Euler angles), in radians.

**`Default`**

new THREE.Euler()

#### Inherited from

InstancedMesh.rotation

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:69

___

### safetyCapacity

• **safetyCapacity**: `number`

#### Defined in

[packages/vfx-composer/src/Particles.ts:30](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/Particles.ts#L30)

___

### scale

• `Readonly` **scale**: `Vector3`

Object's local scale.

**`Default`**

new THREE.Vector3()

#### Inherited from

InstancedMesh.scale

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:81

___

### type

• **type**: `string`

#### Inherited from

InstancedMesh.type

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/Mesh.d.ts:18

___

### up

• **up**: `Vector3`

Up direction.

**`Default`**

THREE.Object3D.DefaultUp.clone()

#### Inherited from

InstancedMesh.up

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:57

___

### uploadableAttributes

• `Private` **uploadableAttributes**: (`BufferAttribute` \| `InterleavedBufferAttribute`)[] = `[]`

#### Defined in

[packages/vfx-composer/src/Particles.ts:34](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/Particles.ts#L34)

___

### userData

• **userData**: `Object`

An object that can be used to store custom data about the Object3d. It should not hold references to functions as these will not be cloned.

**`Default`**

#### Index signature

▪ [key: `string`]: `any`

#### Inherited from

InstancedMesh.userData

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:166

___

### uuid

• **uuid**: `string`

#### Inherited from

InstancedMesh.uuid

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:28

___

### visible

• **visible**: `boolean`

Object gets rendered if true.

**`Default`**

true

#### Inherited from

InstancedMesh.visible

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:127

___

### DefaultMatrixAutoUpdate

▪ `Static` **DefaultMatrixAutoUpdate**: `boolean`

#### Inherited from

InstancedMesh.DefaultMatrixAutoUpdate

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:212

___

### DefaultUp

▪ `Static` **DefaultUp**: `Vector3`

#### Inherited from

InstancedMesh.DefaultUp

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:211

## Methods

### add

▸ **add**(...`object`): [`Particles`](VFX_Composer.Particles.md)

Adds object as child of this object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...object` | `Object3D`<`Event`\>[] |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.add

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:332

___

### addEventListener

▸ **addEventListener**<`T`\>(`type`, `listener`): `void`

Adds a listener to an event type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `T` | The type of event to listen to. |
| `listener` | `EventListener`<`Event`, `T`, [`Particles`](VFX_Composer.Particles.md)\> | The function that gets called when the event is fired. |

#### Returns

`void`

#### Inherited from

InstancedMesh.addEventListener

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/EventDispatcher.d.ts:30

___

### applyMatrix4

▸ **applyMatrix4**(`matrix`): `void`

Applies the matrix transform to the object and updates the object's position, rotation and scale.

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | `Matrix4` |

#### Returns

`void`

#### Inherited from

InstancedMesh.applyMatrix4

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:217

___

### applyQuaternion

▸ **applyQuaternion**(`quaternion`): [`Particles`](VFX_Composer.Particles.md)

Applies the rotation represented by the quaternion to the object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `quaternion` | `Quaternion` |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.applyQuaternion

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:222

___

### attach

▸ **attach**(`object`): [`Particles`](VFX_Composer.Particles.md)

Adds object as a child of this, while maintaining the object's world transform.

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `Object3D`<`Event`\> |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.attach

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:352

___

### clear

▸ **clear**(): [`Particles`](VFX_Composer.Particles.md)

Removes all child objects.

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.clear

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:347

___

### clone

▸ **clone**(`recursive?`): [`Particles`](VFX_Composer.Particles.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `recursive?` | `boolean` |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.clone

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:400

___

### copy

▸ **copy**(`source`, `recursive?`): [`Particles`](VFX_Composer.Particles.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`Particles`](VFX_Composer.Particles.md) |
| `recursive?` | `boolean` |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.copy

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:407

___

### dispatchEvent

▸ **dispatchEvent**(`event`): `void`

Fire an event type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`void`

#### Inherited from

InstancedMesh.dispatchEvent

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/EventDispatcher.d.ts:50

___

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Inherited from

InstancedMesh.dispose

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/InstancedMesh.d.ts:24

___

### emit

▸ **emit**(`count?`, `setupInstance?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `count` | `number` | `1` |
| `setupInstance?` | [`InstanceSetupCallback`](../modules/VFX_Composer.md#instancesetupcallback) | `undefined` |

#### Returns

`void`

#### Defined in

[packages/vfx-composer/src/Particles.ts:101](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/Particles.ts#L101)

___

### getColorAt

▸ **getColorAt**(`index`, `color`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |
| `color` | `Color` |

#### Returns

`void`

#### Inherited from

InstancedMesh.getColorAt

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/InstancedMesh.d.ts:20

___

### getMatrixAt

▸ **getMatrixAt**(`index`, `matrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |
| `matrix` | `Matrix4` |

#### Returns

`void`

#### Inherited from

InstancedMesh.getMatrixAt

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/InstancedMesh.d.ts:21

___

### getObjectById

▸ **getObjectById**(`id`): `undefined` \| `Object3D`<`Event`\>

Searches through the object's children and returns the first with a matching id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `number` | Unique number of the object instance |

#### Returns

`undefined` \| `Object3D`<`Event`\>

#### Inherited from

InstancedMesh.getObjectById

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:358

___

### getObjectByName

▸ **getObjectByName**(`name`): `undefined` \| `Object3D`<`Event`\>

Searches through the object's children and returns the first with a matching name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | String to match to the children's Object3d.name property. |

#### Returns

`undefined` \| `Object3D`<`Event`\>

#### Inherited from

InstancedMesh.getObjectByName

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:364

___

### getObjectByProperty

▸ **getObjectByProperty**(`name`, `value`): `undefined` \| `Object3D`<`Event`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `value` | `string` |

#### Returns

`undefined` \| `Object3D`<`Event`\>

#### Inherited from

InstancedMesh.getObjectByProperty

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:366

___

### getWorldDirection

▸ **getWorldDirection**(`target`): `Vector3`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `Vector3` |

#### Returns

`Vector3`

#### Inherited from

InstancedMesh.getWorldDirection

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:371

___

### getWorldPosition

▸ **getWorldPosition**(`target`): `Vector3`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `Vector3` |

#### Returns

`Vector3`

#### Inherited from

InstancedMesh.getWorldPosition

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:368

___

### getWorldQuaternion

▸ **getWorldQuaternion**(`target`): `Quaternion`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `Quaternion` |

#### Returns

`Quaternion`

#### Inherited from

InstancedMesh.getWorldQuaternion

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:369

___

### getWorldScale

▸ **getWorldScale**(`target`): `Vector3`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `Vector3` |

#### Returns

`Vector3`

#### Inherited from

InstancedMesh.getWorldScale

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:370

___

### hasEventListener

▸ **hasEventListener**<`T`\>(`type`, `listener`): `boolean`

Checks if listener is added to an event type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `T` | The type of event to listen to. |
| `listener` | `EventListener`<`Event`, `T`, [`Particles`](VFX_Composer.Particles.md)\> | The function that gets called when the event is fired. |

#### Returns

`boolean`

#### Inherited from

InstancedMesh.hasEventListener

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/EventDispatcher.d.ts:37

___

### localToWorld

▸ **localToWorld**(`vector`): `Vector3`

Updates the vector from local space to world space.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vector` | `Vector3` | A local vector. |

#### Returns

`Vector3`

#### Inherited from

InstancedMesh.localToWorld

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:313

___

### lookAt

▸ **lookAt**(`vector`, `y?`, `z?`): `void`

Optionally, the x, y and z components of the world space position.
Rotates the object to face a point in world space.
This method does not support objects having non-uniformly-scaled parent(s).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vector` | `number` \| `Vector3` | A world vector to look at. |
| `y?` | `number` | - |
| `z?` | `number` | - |

#### Returns

`void`

#### Inherited from

InstancedMesh.lookAt

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:327

___

### raycast

▸ **raycast**(`raycaster`, `intersects`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `raycaster` | `Raycaster` |
| `intersects` | `Intersection`<`Object3D`<`Event`\>\>[] |

#### Returns

`void`

#### Inherited from

InstancedMesh.raycast

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/Mesh.d.ts:21

___

### remove

▸ **remove**(...`object`): [`Particles`](VFX_Composer.Particles.md)

Removes object as child of this object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...object` | `Object3D`<`Event`\>[] |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.remove

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:337

___

### removeEventListener

▸ **removeEventListener**<`T`\>(`type`, `listener`): `void`

Removes a listener from an event type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `T` | The type of the listener that gets removed. |
| `listener` | `EventListener`<`Event`, `T`, [`Particles`](VFX_Composer.Particles.md)\> | The listener function that gets removed. |

#### Returns

`void`

#### Inherited from

InstancedMesh.removeEventListener

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/EventDispatcher.d.ts:44

___

### removeFromParent

▸ **removeFromParent**(): [`Particles`](VFX_Composer.Particles.md)

Removes this object from its current parent.

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.removeFromParent

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:342

___

### rotateOnAxis

▸ **rotateOnAxis**(`axis`, `angle`): [`Particles`](VFX_Composer.Particles.md)

Rotate an object along an axis in object space. The axis is assumed to be normalized.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `axis` | `Vector3` | A normalized vector in object space. |
| `angle` | `number` | The angle in radians. |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.rotateOnAxis

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:257

___

### rotateOnWorldAxis

▸ **rotateOnWorldAxis**(`axis`, `angle`): [`Particles`](VFX_Composer.Particles.md)

Rotate an object along an axis in world space. The axis is assumed to be normalized. Method Assumes no rotated parent.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `axis` | `Vector3` | A normalized vector in object space. |
| `angle` | `number` | The angle in radians. |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.rotateOnWorldAxis

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:264

___

### rotateX

▸ **rotateX**(`angle`): [`Particles`](VFX_Composer.Particles.md)

Rotates the object around x axis in local space.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `angle` | `number` | the angle to rotate in radians. |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.rotateX

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:270

___

### rotateY

▸ **rotateY**(`angle`): [`Particles`](VFX_Composer.Particles.md)

Rotates the object around y axis in local space.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `angle` | `number` | the angle to rotate in radians. |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.rotateY

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:276

___

### rotateZ

▸ **rotateZ**(`angle`): [`Particles`](VFX_Composer.Particles.md)

Rotates the object around z axis in local space.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `angle` | `number` | the angle to rotate in radians. |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.rotateZ

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:282

___

### setColorAt

▸ **setColorAt**(`index`, `color`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |
| `color` | `Color` |

#### Returns

`void`

#### Inherited from

InstancedMesh.setColorAt

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/InstancedMesh.d.ts:22

___

### setMatrixAt

▸ **setMatrixAt**(`index`, `matrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |
| `matrix` | `Matrix4` |

#### Returns

`void`

#### Inherited from

InstancedMesh.setMatrixAt

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/InstancedMesh.d.ts:23

___

### setRotationFromAxisAngle

▸ **setRotationFromAxisAngle**(`axis`, `angle`): `void`

axis -- A normalized vector in object space.
angle -- angle in radians

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `axis` | `Vector3` | A normalized vector in object space. |
| `angle` | `number` | angle in radians |

#### Returns

`void`

#### Inherited from

InstancedMesh.setRotationFromAxisAngle

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:230

___

### setRotationFromEuler

▸ **setRotationFromEuler**(`euler`): `void`

Calls setRotationFromEuler(euler) on the .quaternion.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `euler` | `Euler` | Euler angle specifying rotation amount. |

#### Returns

`void`

#### Inherited from

InstancedMesh.setRotationFromEuler

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:236

___

### setRotationFromMatrix

▸ **setRotationFromMatrix**(`m`): `void`

Calls setFromRotationMatrix(m) on the .quaternion.

Note that this assumes that the upper 3x3 of m is a pure rotation matrix (i.e, unscaled).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `m` | `Matrix4` | rotate the quaternion by the rotation component of the matrix. |

#### Returns

`void`

#### Inherited from

InstancedMesh.setRotationFromMatrix

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:244

___

### setRotationFromQuaternion

▸ **setRotationFromQuaternion**(`q`): `void`

Copy the given quaternion into .quaternion.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `q` | `Quaternion` | normalized Quaternion |

#### Returns

`void`

#### Inherited from

InstancedMesh.setRotationFromQuaternion

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:250

___

### setupParticles

▸ **setupParticles**(`shaderRoot`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `shaderRoot` | `Unit`<`GLSLType`\> |

#### Returns

`void`

#### Defined in

[packages/vfx-composer/src/Particles.ts:78](https://github.com/hmans/composer-suite/blob/3226b513/packages/vfx-composer/src/Particles.ts#L78)

___

### toJSON

▸ **toJSON**(`meta?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `meta?` | `Object` |
| `meta.geometries` | `any` |
| `meta.images` | `any` |
| `meta.materials` | `any` |
| `meta.textures` | `any` |

#### Returns

`any`

#### Inherited from

InstancedMesh.toJSON

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:398

___

### translateOnAxis

▸ **translateOnAxis**(`axis`, `distance`): [`Particles`](VFX_Composer.Particles.md)

Translate an object by distance along an axis in object space. The axis is assumed to be normalized.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `axis` | `Vector3` | A normalized vector in object space. |
| `distance` | `number` | The distance to translate. |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.translateOnAxis

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:289

___

### translateX

▸ **translateX**(`distance`): [`Particles`](VFX_Composer.Particles.md)

Translates object along x axis by distance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `distance` | `number` | Distance. |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.translateX

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:295

___

### translateY

▸ **translateY**(`distance`): [`Particles`](VFX_Composer.Particles.md)

Translates object along y axis by distance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `distance` | `number` | Distance. |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.translateY

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:301

___

### translateZ

▸ **translateZ**(`distance`): [`Particles`](VFX_Composer.Particles.md)

Translates object along z axis by distance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `distance` | `number` | Distance. |

#### Returns

[`Particles`](VFX_Composer.Particles.md)

#### Inherited from

InstancedMesh.translateZ

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:307

___

### traverse

▸ **traverse**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`object`: `Object3D`<`Event`\>) => `any` |

#### Returns

`void`

#### Inherited from

InstancedMesh.traverse

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:375

___

### traverseAncestors

▸ **traverseAncestors**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`object`: `Object3D`<`Event`\>) => `any` |

#### Returns

`void`

#### Inherited from

InstancedMesh.traverseAncestors

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:379

___

### traverseVisible

▸ **traverseVisible**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`object`: `Object3D`<`Event`\>) => `any` |

#### Returns

`void`

#### Inherited from

InstancedMesh.traverseVisible

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:377

___

### updateMatrix

▸ **updateMatrix**(): `void`

Updates local transform.

#### Returns

`void`

#### Inherited from

InstancedMesh.updateMatrix

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:384

___

### updateMatrixWorld

▸ **updateMatrixWorld**(`force?`): `void`

Updates global transform of the object and its children.

#### Parameters

| Name | Type |
| :------ | :------ |
| `force?` | `boolean` |

#### Returns

`void`

#### Inherited from

InstancedMesh.updateMatrixWorld

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:389

___

### updateMorphTargets

▸ **updateMorphTargets**(): `void`

#### Returns

`void`

#### Inherited from

InstancedMesh.updateMorphTargets

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/objects/Mesh.d.ts:20

___

### updateWorldMatrix

▸ **updateWorldMatrix**(`updateParents`, `updateChildren`): `void`

Updates the global transform of the object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `updateParents` | `boolean` | recursively updates global transform of ancestors. |
| `updateChildren` | `boolean` | recursively updates global transform of descendants. |

#### Returns

`void`

#### Inherited from

InstancedMesh.updateWorldMatrix

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:396

___

### worldToLocal

▸ **worldToLocal**(`vector`): `Vector3`

Updates the vector from world space to local space.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vector` | `Vector3` | A world vector. |

#### Returns

`Vector3`

#### Inherited from

InstancedMesh.worldToLocal

#### Defined in

node_modules/.pnpm/@types+three@0.143.2/node_modules/@types/three/src/core/Object3D.d.ts:319
