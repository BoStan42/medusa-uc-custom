---
displayed_sidebar: jsClientSidebar
---

# Class: TaxRate

[internal](../modules/internal-3.md).TaxRate

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`TaxRate`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:19

___

### code

• **code**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:8

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[created_at](internal-1.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[id](internal-1.BaseEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:12

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:9

___

### product\_count

• `Optional` **product\_count**: `number`

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:16

___

### product\_type\_count

• `Optional` **product\_type\_count**: `number`

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:17

___

### product\_types

• **product\_types**: [`ProductType`](internal-3.ProductType.md)[]

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:14

___

### products

• **products**: [`Product`](internal-3.Product.md)[]

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:13

___

### rate

• **rate**: ``null`` \| `number`

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:7

___

### region

• **region**: [`Region`](internal-3.Region.md)

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:11

___

### region\_id

• **region\_id**: `string`

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:10

___

### shipping\_option\_count

• `Optional` **shipping\_option\_count**: `number`

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:18

___

### shipping\_options

• **shipping\_options**: [`ShippingOption`](internal-3.ShippingOption.md)[]

#### Defined in

packages/medusa/dist/models/tax-rate.d.ts:15

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
