import { create } from 'zustand'

type OrderItem = {
  order: {
    id: string
    orderDate: string
    status: string
  }
  inventory: {
    id: string
    medication: { name: string }
    ppv: string
  }
  quantity: number
  status: string
  pph: string
}

type OrderStore = {
  pendingOrders: OrderItem[]
  selectedPendingOrders: any[]
  deliveryItems: any[]
  actions: {
    addPendingOrder: (order: OrderItem) => void
    removePendingOrder: (orderId: string) => void
    toggleSelectedRow: (orderItem: OrderItem) => void
  }
}
const useOrderStore = create<OrderStore>((set) => ({
  pendingOrders: [],
  selectedPendingOrders: [],
  deliveryItems: [],
  actions: {
    addPendingOrder: (order) =>
      set((state) => ({
        pendingOrders: [...state.pendingOrders, order]
      })),

    removePendingOrder: (orderId) =>
      set((state) => ({
        pendingOrders: state.pendingOrders.filter(
          (order) => order.order.id !== orderId
        )
      })),
    // toggleSelectedRow: (orderItem) =>
    //   set((state) => {
    //     const position = `${orderItem.order.id}-${orderItem.inventory.id}`
    //     const isSelected = state.selectedPendingOrders.some(
    //       (item) => `${item.order.id}-${item.inventory.id}` === position
    //     )

    //     return {
    //       selectedPendingOrders: isSelected
    //         ? state.selectedPendingOrders.filter(
    //             (item) => `${item.order.id}-${item.inventory.id}` !== position
    //           )
    //         : [...state.selectedPendingOrders, orderItem]
    //     }
    //   })
    toggleSelectedRow: (orderItem) =>
      set((state) => {
        const position = `${orderItem.order.id}-${orderItem.inventory.id}`
        const isSelected = state.selectedPendingOrders.some(
          (item) => `${item.orderId}-${item.inventoryId}` === position
        )

        if (isSelected) {
          return {
            selectedPendingOrders: state.selectedPendingOrders.filter(
              (item) => `${item.orderId}-${item.inventoryId}` !== position
            )
            // deliveryItems: state.deliveryItems.filter(
            //   (item) => `${item.orderId}-${item.inventoryId}` !== position
            // )
          }
        } else {
          return {
            selectedPendingOrders: [
              ...state.selectedPendingOrders,
              {
                inventoryId: orderItem.inventory.id,
                quantity: orderItem.quantity,
                ppv: orderItem.inventory.ppv,
                pph: orderItem.pph,
                orderId: orderItem.order.id,
                discount: 0
              }
            ]
            // deliveryItems: [
            //   ...state.deliveryItems,
            //   { medication: orderItem.inventory.medication, ...orderItem }
            // ]
          }
        }
      })
  }
}))

export const usePendingOrders = () =>
  useOrderStore((state) => state.pendingOrders)
export const useSelectedPendingOrders = () =>
  useOrderStore((state) => state.selectedPendingOrders)

export const useDeliveryItems = () =>
  useOrderStore((state) => state.deliveryItems)

export const useOrdersAction = () => useOrderStore((state) => state.actions)
