---
displayed_sidebar: jsClientSidebar
---

# Class: AdminPostProductsProductVariantsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminPostProductsProductVariantsReq

**`Schema`**

AdminPostProductsProductVariantsReq
type: object
required:
  - title
  - prices
  - options
properties:
  title:
    description: The title of the product variant.
    type: string
  sku:
    description: The unique SKU of the product variant.
    type: string
  ean:
    description: The EAN number of the product variant.
    type: string
  upc:
    description: The UPC number of the product variant.
    type: string
  barcode:
    description: A generic GTIN field of the product variant.
    type: string
  hs_code:
    description: The Harmonized System code of the product variant.
    type: string
  inventory_quantity:
    description: The amount of stock kept of the product variant.
    type: integer
    default: 0
  allow_backorder:
    description: Whether the product variant can be purchased when out of stock.
    type: boolean
  manage_inventory:
    description: Whether Medusa should keep track of the inventory of this product variant.
    type: boolean
    default: true
  weight:
    description: The wieght of the product variant.
    type: number
  length:
    description: The length of the product variant.
    type: number
  height:
    description: The height of the product variant.
    type: number
  width:
    description: The width of the product variant.
    type: number
  origin_country:
    description: The country of origin of the product variant.
    type: string
  mid_code:
    description: The Manufacturer Identification code of the product variant.
    type: string
  material:
    description: The material composition of the product variant.
    type: string
  metadata:
    description: An optional set of key-value pairs with additional information.
    type: object
    externalDocs:
      description: "Learn about the metadata attribute, and how to delete and update it."
      url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
  prices:
    type: array
    description: An array of product variant prices. A product variant can have different prices for each region or currency code.
    externalDocs:
      url: https://docs.medusajs.com/modules/products/admin/manage-products#product-variant-prices
      description: Product variant pricing.
    items:
      type: object
      required:
        - amount
      properties:
        region_id:
          description: The ID of the Region the price will be used in. This is only required if `currency_code` is not provided.
          type: string
        currency_code:
          description: The 3 character ISO currency code the price will be used in. This is only required if `region_id` is not provided.
          type: string
          externalDocs:
            url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
            description: See a list of codes.
        amount:
          description: The price amount.
          type: integer
        min_quantity:
         description: The minimum quantity required to be added to the cart for the price to be used.
         type: integer
        max_quantity:
          description: The maximum quantity required to be added to the cart for the price to be used.
          type: integer
  options:
    type: array
    description: An array of Product Option values that the variant corresponds to.
    items:
      type: object
      required:
        - option_id
        - value
      properties:
        option_id:
          description: The ID of the Product Option.
          type: string
        value:
          description: A value to give to the Product Option.
          type: string

## Properties

### allow\_backorder

• `Optional` **allow\_backorder**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:213

___

### barcode

• `Optional` **barcode**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:210

___

### ean

• `Optional` **ean**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:208

___

### height

• `Optional` **height**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:217

___

### hs\_code

• `Optional` **hs\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:211

___

### inventory\_quantity

• `Optional` **inventory\_quantity**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:212

___

### length

• `Optional` **length**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:216

___

### manage\_inventory

• `Optional` **manage\_inventory**: `boolean`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:214

___

### material

• `Optional` **material**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:221

___

### metadata

• `Optional` **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:222

___

### mid\_code

• `Optional` **mid\_code**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:220

___

### options

• `Optional` **options**: [`ProductVariantOptionReq`](internal-8.ProductVariantOptionReq.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:224

___

### origin\_country

• `Optional` **origin\_country**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:219

___

### prices

• **prices**: [`ProductVariantPricesCreateReq`](internal-8.ProductVariantPricesCreateReq.md)[]

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:223

___

### sku

• `Optional` **sku**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:207

___

### title

• **title**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:206

___

### upc

• `Optional` **upc**: `string`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:209

___

### weight

• `Optional` **weight**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:215

___

### width

• `Optional` **width**: `number`

#### Defined in

packages/medusa/dist/api/routes/admin/products/create-variant.d.ts:218
