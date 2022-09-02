[Shader Composer](../README.md) / [Modules](../modules.md) / fun

# Module: fun

## Table of contents

### Functions

- [add](fun.md#add)
- [div](fun.md#div)
- [mix](fun.md#mix)
- [mul](fun.md#mul)
- [sub](fun.md#sub)

## Functions

### add

▸ **add**<`B`\>(`b`): <A\>(`a`: [`Input`](index.md#input)<`A`\>) => [`Unit`](index.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `B` | extends [`GLSLType`](index.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`Input`](index.md#input)<`B`\> |

#### Returns

`fn`

▸ <`A`\>(`a`): [`Unit`](index.md#unit-1)<`A`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`GLSLType`](index.md#glsltype) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](index.md#input)<`A`\> |

##### Returns

[`Unit`](index.md#unit-1)<`A`\>

#### Defined in

[fun.ts:10](https://github.com/hmans/composer-suite/blob/a9c12beb/packages/shader-composer/src/fun.ts#L10)

___

### div

▸ **div**<`B`\>(`b`): <A\>(`a`: [`Input`](index.md#input)<`A`\>) => [`Unit`](index.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `B` | extends [`GLSLType`](index.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`Input`](index.md#input)<`B`\> |

#### Returns

`fn`

▸ <`A`\>(`a`): [`Unit`](index.md#unit-1)<`A`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`GLSLType`](index.md#glsltype) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](index.md#input)<`A`\> |

##### Returns

[`Unit`](index.md#unit-1)<`A`\>

#### Defined in

[fun.ts:25](https://github.com/hmans/composer-suite/blob/a9c12beb/packages/shader-composer/src/fun.ts#L25)

___

### mix

▸ **mix**<`T`\>(`b`, `f`): (`a`: [`Input`](index.md#input)<`T`\>) => [`Unit`](index.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](index.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`Input`](index.md#input)<`T`\> |
| `f` | [`Input`](index.md#input)<``"float"``\> |

#### Returns

`fn`

▸ (`a`): [`Unit`](index.md#unit-1)<`T`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](index.md#input)<`T`\> |

##### Returns

[`Unit`](index.md#unit-1)<`T`\>

#### Defined in

[fun.ts:5](https://github.com/hmans/composer-suite/blob/a9c12beb/packages/shader-composer/src/fun.ts#L5)

___

### mul

▸ **mul**<`B`\>(`b`): <A\>(`a`: [`Input`](index.md#input)<`A`\>) => [`Unit`](index.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `B` | extends [`GLSLType`](index.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`Input`](index.md#input)<`B`\> |

#### Returns

`fn`

▸ <`A`\>(`a`): [`Unit`](index.md#unit-1)<`A`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`GLSLType`](index.md#glsltype) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](index.md#input)<`A`\> |

##### Returns

[`Unit`](index.md#unit-1)<`A`\>

#### Defined in

[fun.ts:20](https://github.com/hmans/composer-suite/blob/a9c12beb/packages/shader-composer/src/fun.ts#L20)

___

### sub

▸ **sub**<`B`\>(`b`): <A\>(`a`: [`Input`](index.md#input)<`A`\>) => [`Unit`](index.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `B` | extends [`GLSLType`](index.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`Input`](index.md#input)<`B`\> |

#### Returns

`fn`

▸ <`A`\>(`a`): [`Unit`](index.md#unit-1)<`A`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`GLSLType`](index.md#glsltype) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](index.md#input)<`A`\> |

##### Returns

[`Unit`](index.md#unit-1)<`A`\>

#### Defined in

[fun.ts:15](https://github.com/hmans/composer-suite/blob/a9c12beb/packages/shader-composer/src/fun.ts#L15)
