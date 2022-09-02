[Material Composer](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### Type Aliases

- [BlendFunction](index.md#blendfunction)
- [BlendMode](index.md#blendmode)
- [BlendableType](index.md#blendabletype)
- [LayerArgs](index.md#layerargs)
- [Module](index.md#module)
- [ModuleFactory](index.md#modulefactory)
- [ModuleFactoryProps](index.md#modulefactoryprops)
- [ModulePipe](index.md#modulepipe)
- [ModuleState](index.md#modulestate)
- [PatchedMaterialMasterProps](index.md#patchedmaterialmasterprops)
- [PatchedMaterialOptions](index.md#patchedmaterialoptions)

### Variables

- [Blend](index.md#blend)

### Functions

- [Layer](index.md#layer)
- [PatchedMaterialMaster](index.md#patchedmaterialmaster)
- [compileModules](index.md#compilemodules)
- [extend](index.md#extend)
- [initialModuleState](index.md#initialmodulestate)
- [patchMaterial](index.md#patchmaterial)
- [pipeModules](index.md#pipemodules)
- [prepend](index.md#prepend)
- [replace](index.md#replace)

## Type Aliases

### BlendFunction

Ƭ **BlendFunction**: <T\>(`a`: `Input`<`T`\>, `b`: `Input`<`T`\>, `opacity`: `Input`<``"float"``\>) => `Input`<`T`\>

#### Type declaration

▸ <`T`\>(`a`, `b`, `opacity`): `Input`<`T`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`BlendableType`](index.md#blendabletype) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `Input`<`T`\> |
| `b` | `Input`<`T`\> |
| `opacity` | `Input`<``"float"``\> |

##### Returns

`Input`<`T`\>

#### Defined in

[material-composer/src/Layer.ts:6](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/Layer.ts#L6)

___

### BlendMode

Ƭ **BlendMode**: keyof typeof [`Blend`](index.md#blend)

#### Defined in

[material-composer/src/Layer.ts:29](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/Layer.ts#L29)

___

### BlendableType

Ƭ **BlendableType**: ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"``

#### Defined in

[material-composer/src/Layer.ts:4](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/Layer.ts#L4)

___

### LayerArgs

Ƭ **LayerArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blend?` | [`BlendFunction`](index.md#blendfunction) \| [`BlendMode`](index.md#blendmode) |
| `modules?` | [`ModulePipe`](index.md#modulepipe) |
| `opacity?` | `Input`<``"float"``\> |

#### Defined in

[material-composer/src/Layer.ts:31](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/Layer.ts#L31)

___

### Module

Ƭ **Module**: (`state`: [`ModuleState`](index.md#modulestate)) => [`ModuleState`](index.md#modulestate)

#### Type declaration

▸ (`state`): [`ModuleState`](index.md#modulestate)

A Module is a function that accepts a module state as its input and returns a new module state.

##### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`ModuleState`](index.md#modulestate) |

##### Returns

[`ModuleState`](index.md#modulestate)

#### Defined in

[material-composer/src/index.ts:28](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/index.ts#L28)

___

### ModuleFactory

Ƭ **ModuleFactory**<`P`\>: (`props`: `P`) => [`Module`](index.md#module)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends [`ModuleFactoryProps`](index.md#modulefactoryprops) = {} |

#### Type declaration

▸ (`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

##### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `P` |

##### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/index.ts#L33)

___

### ModuleFactoryProps

Ƭ **ModuleFactoryProps**: `Record`<`string`, `any`\>

#### Defined in

[material-composer/src/index.ts:37](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/index.ts#L37)

___

### ModulePipe

Ƭ **ModulePipe**: [`Module`](index.md#module)[]

A Module Pipe is an array of Modules.

#### Defined in

[material-composer/src/index.ts:42](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/index.ts#L42)

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

[material-composer/src/index.ts:16](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/index.ts#L16)

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

[material-composer-patch-material/src/master.ts:3](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer-patch-material/src/master.ts#L3)

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

[material-composer-patch-material/src/patchMaterial.ts:4](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer-patch-material/src/patchMaterial.ts#L4)

## Variables

### Blend

• `Const` **Blend**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `add` | [`BlendFunction`](index.md#blendfunction) |
| `discard` | [`BlendFunction`](index.md#blendfunction) |
| `normal` | [`BlendFunction`](index.md#blendfunction) |

#### Defined in

[material-composer/src/Layer.ts:17](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/Layer.ts#L17)

## Functions

### Layer

▸ **Layer**(`props`): [`Module`](index.md#module)

A Module Factory is a function that returns a Module.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`LayerArgs`](index.md#layerargs) |

#### Returns

[`Module`](index.md#module)

#### Defined in

[material-composer/src/index.ts:33](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/index.ts#L33)

___

### PatchedMaterialMaster

▸ **PatchedMaterialMaster**(`__namedParameters?`): `Unit`<``"bool"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`PatchedMaterialMasterProps`](index.md#patchedmaterialmasterprops) |

#### Returns

`Unit`<``"bool"``\>

#### Defined in

[material-composer-patch-material/src/master.ts:13](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer-patch-material/src/master.ts#L13)

___

### compileModules

▸ **compileModules**(`modules`): `Unit`<``"bool"``\>

Compiles a list of Material Composer modules into a shader graph that
can be consumed by Shader Composer's `composeShader` function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `modules` | [`Module`](index.md#module)[] | A list of Material Composer modules (see `Module`) |

#### Returns

`Unit`<``"bool"``\>

A shader master node that can be passed to `compileShader`

#### Defined in

[material-composer/src/compileModules.ts:11](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/compileModules.ts#L11)

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

[material-composer-patch-material/src/patchMaterial.ts:54](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer-patch-material/src/patchMaterial.ts#L54)

___

### initialModuleState

▸ **initialModuleState**(): [`ModuleState`](index.md#modulestate)

#### Returns

[`ModuleState`](index.md#modulestate)

#### Defined in

[material-composer/src/index.ts:47](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/index.ts#L47)

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
| `__namedParameters` | [`PatchedMaterialOptions`](index.md#patchedmaterialoptions) |

#### Returns

`void`

#### Defined in

[material-composer-patch-material/src/patchMaterial.ts:10](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer-patch-material/src/patchMaterial.ts#L10)

___

### pipeModules

▸ **pipeModules**(`initial`, ...`modules`): [`ModuleState`](index.md#modulestate)

#### Parameters

| Name | Type |
| :------ | :------ |
| `initial` | [`ModuleState`](index.md#modulestate) |
| `...modules` | [`Module`](index.md#module)[] |

#### Returns

[`ModuleState`](index.md#modulestate)

#### Defined in

[material-composer/src/index.ts:44](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer/src/index.ts#L44)

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

[material-composer-patch-material/src/patchMaterial.ts:59](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer-patch-material/src/patchMaterial.ts#L59)

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

[material-composer-patch-material/src/patchMaterial.ts:64](https://github.com/hmans/composer-suite/blob/be64faec/packages/material-composer-patch-material/src/patchMaterial.ts#L64)
