---
id: "Material_Composer"
title: "Module: Material Composer"
sidebar_label: "Material Composer"
sidebar_position: 0
custom_edit_url: null
---

## Type Aliases

### BlendFunction

Ƭ **BlendFunction**: <T\>(`a`: `Input`<`T`\>, `b`: `Input`<`T`\>, `opacity`: `Input`<``"float"``\>) => `Input`<`T`\>

#### Type declaration

▸ <`T`\>(`a`, `b`, `opacity`): `Input`<`T`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`BlendableType`](Material_Composer.md#blendabletype) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `Input`<`T`\> |
| `b` | `Input`<`T`\> |
| `opacity` | `Input`<``"float"``\> |

##### Returns

`Input`<`T`\>

#### Defined in

[material-composer/src/Layer.ts:6](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/Layer.ts#L6)

___

### BlendMode

Ƭ **BlendMode**: keyof typeof [`Blend`](Material_Composer.md#blend)

#### Defined in

[material-composer/src/Layer.ts:29](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/Layer.ts#L29)

___

### BlendableType

Ƭ **BlendableType**: ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"``

#### Defined in

[material-composer/src/Layer.ts:4](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/Layer.ts#L4)

___

### LayerArgs

Ƭ **LayerArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blend?` | [`BlendFunction`](Material_Composer.md#blendfunction) \| [`BlendMode`](Material_Composer.md#blendmode) |
| `modules?` | [`ModulePipe`](Material_Composer.md#modulepipe) |
| `opacity?` | `Input`<``"float"``\> |

#### Defined in

[material-composer/src/Layer.ts:31](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/Layer.ts#L31)

___

### Module

Ƭ **Module**: (`state`: [`ModuleState`](Material_Composer.md#modulestate)) => [`ModuleState`](Material_Composer.md#modulestate)

#### Type declaration

▸ (`state`): [`ModuleState`](Material_Composer.md#modulestate)

A Module is a function that accepts a module state as its input and returns a new module state.

##### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`ModuleState`](Material_Composer.md#modulestate) |

##### Returns

[`ModuleState`](Material_Composer.md#modulestate)

#### Defined in

[material-composer/src/index.ts:28](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/index.ts#L28)

___

### ModuleFactory

Ƭ **ModuleFactory**<`P`\>: (`props`: `P`) => [`Module`](Material_Composer.md#module)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends [`ModuleFactoryProps`](Material_Composer.md#modulefactoryprops) = {} |

#### Type declaration

▸ (`props`): [`Module`](Material_Composer.md#module)

A Module Factory is a function that returns a Module.

##### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `P` |

##### Returns

[`Module`](Material_Composer.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/index.ts#L33)

___

### ModuleFactoryProps

Ƭ **ModuleFactoryProps**: `Record`<`string`, `any`\>

#### Defined in

[material-composer/src/index.ts:37](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/index.ts#L37)

___

### ModulePipe

Ƭ **ModulePipe**: [`Module`](Material_Composer.md#module)[]

A Module Pipe is an array of Modules.

#### Defined in

[material-composer/src/index.ts:42](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/index.ts#L42)

___

### ModuleState

Ƭ **ModuleState**: `Object`

ModuleState describes the state going into a module (and returned by it.)
Modules are encouraged to change the values they're interested in, but can
also just pass through others without changing them.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `alpha` | `Input`<``"float"``\> |
| `color` | `Input`<``"vec3"``\> |
| `metalness` | `Input`<``"float"``\> |
| `normal` | `Input`<``"vec3"``\> |
| `position` | `Input`<``"vec3"``\> |
| `roughness` | `Input`<``"float"``\> |

#### Defined in

[material-composer/src/index.ts:16](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/index.ts#L16)

___

### PatchedMaterialMasterProps

Ƭ **PatchedMaterialMasterProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `alpha?` | `Input`<``"float"``\> |
| `color?` | `Input`<``"vec3"``\> |
| `emissiveColor?` | `Input`<``"vec3"``\> |
| `metalness?` | `Input`<``"float"``\> |
| `normal?` | `Input`<``"vec3"``\> |
| `position?` | `Input`<``"vec3"``\> |
| `roughness?` | `Input`<``"float"``\> |

#### Defined in

[material-composer-patch-material/src/master.ts:3](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer-patch-material/src/master.ts#L3)

___

### PatchedMaterialOptions

Ƭ **PatchedMaterialOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fragmentShader?` | `string` |
| `uniforms?` | { `[key: string]`: `IUniform`;  } |
| `vertexShader?` | `string` |

#### Defined in

[material-composer-patch-material/src/patchMaterial.ts:4](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer-patch-material/src/patchMaterial.ts#L4)

## Variables

### Blend

• `Const` **Blend**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `add` | [`BlendFunction`](Material_Composer.md#blendfunction) |
| `discard` | [`BlendFunction`](Material_Composer.md#blendfunction) |
| `normal` | [`BlendFunction`](Material_Composer.md#blendfunction) |

#### Defined in

[material-composer/src/Layer.ts:17](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/Layer.ts#L17)

## Functions

### Layer

▸ **Layer**(`props`): [`Module`](Material_Composer.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`LayerArgs`](Material_Composer.md#layerargs) |

#### Returns

[`Module`](Material_Composer.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/index.ts#L33)

___

### PatchedMaterialMaster

▸ **PatchedMaterialMaster**(`__namedParameters?`): `Unit`<``"bool"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`PatchedMaterialMasterProps`](Material_Composer.md#patchedmaterialmasterprops) |

#### Returns

`Unit`<``"bool"``\>

#### Defined in

[material-composer-patch-material/src/master.ts:13](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer-patch-material/src/master.ts#L13)

___

### compileModules

▸ **compileModules**(`modules`): `Unit`<``"bool"``\>

Compiles a list of Material Composer modules into a shader graph that
can be consumed by Shader Composer's `composeShader` function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `modules` | [`Module`](Material_Composer.md#module)[] | A list of Material Composer modules (see `Module`) |

#### Returns

`Unit`<``"bool"``\>

A shader master node that can be passed to `compileShader`

#### Defined in

[material-composer/src/compileModules.ts:11](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/compileModules.ts#L11)

___

### extend

▸ **extend**(`anchor`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `anchor` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `with` | (`target`: `string`) => (`source`: `string`) => `string` |

#### Defined in

[material-composer-patch-material/src/patchMaterial.ts:54](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer-patch-material/src/patchMaterial.ts#L54)

___

### initialModuleState

▸ **initialModuleState**(): [`ModuleState`](Material_Composer.md#modulestate)

#### Returns

[`ModuleState`](Material_Composer.md#modulestate)

#### Defined in

[material-composer/src/index.ts:47](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/index.ts#L47)

___

### patchMaterial

▸ **patchMaterial**<`M`\>(`material`, `__namedParameters?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `Material`<`M`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `material` | `M` |
| `__namedParameters` | [`PatchedMaterialOptions`](Material_Composer.md#patchedmaterialoptions) |

#### Returns

`void`

#### Defined in

[material-composer-patch-material/src/patchMaterial.ts:10](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer-patch-material/src/patchMaterial.ts#L10)

___

### pipeModules

▸ **pipeModules**(`initial`, ...`modules`): [`ModuleState`](Material_Composer.md#modulestate)

#### Parameters

| Name | Type |
| :------ | :------ |
| `initial` | [`ModuleState`](Material_Composer.md#modulestate) |
| `...modules` | [`Module`](Material_Composer.md#module)[] |

#### Returns

[`ModuleState`](Material_Composer.md#modulestate)

#### Defined in

[material-composer/src/index.ts:44](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer/src/index.ts#L44)

___

### prepend

▸ **prepend**(`anchor`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `anchor` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `with` | (`target`: `string`) => (`source`: `string`) => `string` |

#### Defined in

[material-composer-patch-material/src/patchMaterial.ts:59](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer-patch-material/src/patchMaterial.ts#L59)

___

### replace

▸ **replace**(`anchor`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `anchor` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `with` | (`target`: `string`) => (`source`: `string`) => `string` |

#### Defined in

[material-composer-patch-material/src/patchMaterial.ts:64](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/material-composer-patch-material/src/patchMaterial.ts#L64)
