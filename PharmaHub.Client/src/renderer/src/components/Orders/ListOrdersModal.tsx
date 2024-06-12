import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Select,
  Table,
  Text
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useOrdersAction, useDeliveryItems } from '@renderer/store/order.store'
import { http } from '@renderer/utils/http'
import { IconPlus } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'

function ListOrdersModal() {
  const { addDeliveryItem } = useOrdersAction()
  const deliveryItems = useDeliveryItems()
  const [filterOptions, setFilterOptions] = useState<any>({
    status: 'Pending',
    from: dayjs().subtract(7, 'days').toDate(),
    to: dayjs().toDate(),
    supplier: null
  })

  const { data } = useQuery({
    queryKey: ['orders', filterOptions],
    queryFn: async () => {
      const response = await http.get('/api/deliveries/orders', {
        params: filterOptions
      })
      return response.data.data
    },
    staleTime: Infinity
  })

  const isSelected = (inventoryId) => {
    return deliveryItems.some((item) => item.inventoryId === inventoryId)
  }

  return (
    <Box mih="400px">
      <Group mb="md" grow>
        <Select
          label="Supplier"
          onChange={(value) =>
            setFilterOptions((prev) => ({
              ...prev,
              supplier: value
            }))
          }
          value={filterOptions.supplier}
          data={[
            {
              label: 'Supplier One',
              value: '1'
            }
          ]}
        />
        <DatePickerInput
          label="Select date range"
          type="range"
          defaultValue={[filterOptions.from, filterOptions.to]}
          value={filterOptions.dates}
          onChange={(value) =>
            setFilterOptions((prev) => ({
              ...prev,
              from: value[0],
              to: value[1]
            }))
          }
        />
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>Order Date</Table.Th>
            <Table.Th>Product Name</Table.Th>
            <Table.Th>Quantities</Table.Th>
            <Table.Th>PPV</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.map((orderItem) => {
            const { order, inventory } = orderItem
            return (
              <Table.Tr
                key={`${order.id}-${inventory.id}`}
                bg={
                  isSelected(orderItem)
                    ? 'var(--mantine-color-blue-light)'
                    : undefined
                }
              >
                <Table.Td>
                  <ActionIcon
                    variant="default"
                    onClick={() => {
                      addDeliveryItem({
                        orderId: orderItem.order.id,
                        inventoryId: orderItem.inventory.id,
                        supplierId: orderItem.supplierId,
                        status: orderItem.status,
                        totalPurchasePrice: orderItem.totalPurchasePrice,
                        purchasePriceUnit: orderItem.purchasePriceUnit,
                        discountRate: orderItem.discountRate,
                        orderedQuantity: orderItem.orderedQuantity,
                        deliveredQuantity: orderItem.orderedQuantity,
                        inventory: orderItem.inventory,
                        medication: orderItem.inventory.medication
                      })
                    }}
                    disabled={isSelected(orderItem.inventory.id)}
                  >
                    <IconPlus
                      style={{ width: '70%', height: '70%' }}
                      stroke={1.7}
                    />
                  </ActionIcon>
                </Table.Td>
                <Table.Td>
                  {`${dayjs(order.orderDate).format('DD/MM/YYYY')} - ${dayjs(order.orderDate).format('HH:mm')}`}
                </Table.Td>
                <Table.Td>{inventory.medication.name}</Table.Td>
                <Table.Td>{orderItem.quantity}</Table.Td>
                <Table.Td>{inventory.ppv}</Table.Td>
                <Table.Td>
                  <Badge
                    color={order.status === 'Delivered' ? 'green' : 'orange'}
                  >
                    {orderItem.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    </Box>
  )
}

export const useListOrdersModal = () => {
  const [opened, setOpened] = useState(false)
  const ListOrdersModalModalCallback = useCallback(() => {
    return (
      <Modal
        size="xl"
        onClose={() => setOpened(false)}
        opened={opened}
        title={
          <Text fw="600" td="underline">
            Pending orders from the same selected supplier
          </Text>
        }
      >
        <ListOrdersModal />
      </Modal>
    )
  }, [opened, setOpened])

  const ListOrdersModalButtonCallback = useCallback(() => {
    return (
      <Button
        onClick={() => {
          setOpened(true)
        }}
        variant="light"
      >
        Load Pending Orders
      </Button>
    )
  }, [setOpened])

  return useMemo(
    () => ({
      opened,
      setOpened,
      ListOrdersModal: ListOrdersModalModalCallback,
      ListOrdersModalButton: ListOrdersModalButtonCallback
    }),
    [
      opened,
      setOpened,
      ListOrdersModalModalCallback,
      ListOrdersModalButtonCallback
    ]
  )
}
