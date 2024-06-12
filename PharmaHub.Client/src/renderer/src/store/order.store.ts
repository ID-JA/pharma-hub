import { create } from 'zustand'

type OrderItem = {
  order: {
    id: string
    orderDate: string
    status: string
    supplierId: string
  }
  inventory: {
    id: string
    medication: { name: string }
    ppv: string
  }
  medication: any
  orderId: any
  inventoryId: any
  supplierId: any
  status: any
  totalPurchasePrice: any
  purchasePriceUnit: any
  discountRate: any
  orderedQuantity: any
  deliveredQuantity: any
}

type OrderStore = {
  deliveryItems: any[]
  actions: {
    addDeliveryItem: (order: any) => void
    removeDeliveryItem: (orderId: string) => void
  }
}
const useOrderStore = create<OrderStore>((set) => ({
  deliveryItems: [],
  actions: {
    addDeliveryItem: ({
      orderId,
      inventoryId,
      supplierId,
      status,
      totalPurchasePrice,
      purchasePriceUnit,
      discountRate,
      orderedQuantity,
      deliveredQuantity,
      inventory,
      medication
    }: any) => {
      console.log({
        orderId,
        inventoryId,
        supplierId,
        status,
        totalPurchasePrice,
        purchasePriceUnit,
        discountRate,
        orderedQuantity,
        deliveredQuantity,
        inventory,
        medication
      })
      set((state) => ({
        deliveryItems: [
          ...state.deliveryItems,
          {
            orderId,
            inventoryId,
            supplierId,
            status,
            totalPurchasePrice,
            purchasePriceUnit,
            discountRate,
            orderedQuantity,
            deliveredQuantity,
            inventory,
            medication
          }
        ]
      }))
    },
    removeDeliveryItem: (inventoryId) =>
      set((state) => ({
        deliveryItems: state.deliveryItems.filter(
          (orderItem) => orderItem.inventoryId !== inventoryId
        )
      }))
  }
}))

export const useDeliveryItems = () =>
  useOrderStore((state) => state.deliveryItems)

export const useOrdersAction = () => useOrderStore((state) => state.actions)
