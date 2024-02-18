import { LineItem } from "@medusajs/medusa"
import { ReservationItemDTO } from "@medusajs/types"

import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"
import ReservationIndicator from "../../components/reservation-indicator/reservation-indicator"

type OrderLineProps = {
  item: LineItem
  currencyCode: string
  reservations?: ReservationItemDTO[]
  isAllocatable?: boolean
}

const OrderLine = ({
  item,
  currencyCode,
  reservations,
  isAllocatable = true,
}: OrderLineProps) => {
  const { isFeatureEnabled } = useFeatureFlag()
  return (
    <div className="hover:bg-grey-5 rounded-rounded mx-[-5px] mb-2 flex items-start justify-between py-2 px-[5px]">
      <div className="flex justify-center space-x-4">
        <div className="rounded-rounded flex h-[48px] w-[36px] overflow-hidden">
          {item.thumbnail ? (
            <img src={item.thumbnail} className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex flex-col justify-start">
          <div className="inter-small-regular text-grey-90 ">{item.title}</div>
          {!!item?.variant && (
            <>
              <div className="inter-small-regular text-grey-50 ">
                {item.variant.title}
              </div>
              {!!item.variant.sku && (
                <div className="inter-small-regular text-grey-50 ">
                  SKU: {item.variant.sku}
                </div>
              )}
            </>
          )}
          {!!item?.metadata?.Holster && (
            <span className="inter-small-regular text-grey-50">
              {`Holster: ${item.metadata.Holster}`}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <div className="small:space-x-2 medium:space-x-4 large:space-x-6 mr-3 flex">
          <div className="inter-small-regular text-grey-50">
            {formatAmountWithSymbol({
              amount: item?.unit_price ?? 0,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
          <div className="inter-small-regular text-grey-50 whitespace-nowrap">
            x {item.quantity}
          </div>
          {/*
          {isFeatureEnabled("inventoryService") && isAllocatable && (
            <ReservationIndicator reservations={reservations} lineItem={item} />
          )}
          */}
          <div className="inter-small-regular text-grey-90 min-w-[55px] text-right">
            {formatAmountWithSymbol({
              amount: item.subtotal ?? 0,
              currency: currencyCode,
              digits: 2,
              tax: [],
            })}
          </div>
        </div>
        <div className="inter-small-regular text-grey-50">
          {currencyCode.toUpperCase()}
        </div>
      </div>
    </div>
  )
}

export default OrderLine
