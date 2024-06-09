import {
  ActionIcon,
  Box,
  Button,
  ButtonProps,
  Modal,
  Table,
  Text
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { http } from '@renderer/utils/http'
import { IconPlus } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'

function PendingOrdersSelectorModal({
  onAddOrderItem
  // isOrderItemSelected
}: {
  onAddOrderItem: (orderItem: any) => void
}) {
  const [filterOptions, setFilterOptions] = useState<any>({
    status: 'Pending',
    from: dayjs().subtract(7, 'days').toDate(),
    to: dayjs().toDate(),
    supplier: null
  })

  const { data } = useQuery({
    queryKey: ['pendingOrders', filterOptions],
    queryFn: async () => {
      const response = await http.get('/api/deliveries/orders', {
        params: filterOptions
      })
      return response.data.data
    }
  })

  const rows = data?.map((item) => {
    return (
      <Table.Tr key={item.id}>
        <Table.Td>
          {dayjs(item.order.orderDate).format('DD/MM/YYYY HH:mm')}
        </Table.Td>
        <Table.Td>{item.inventory.medication.name}</Table.Td>
        <Table.Td>{item.orderedQuantity}</Table.Td>
        <Table.Td>{item.inventory.ppv}</Table.Td>
        <Table.Td>
          {new Date(item.inventory.expirationDate).toLocaleDateString()}
        </Table.Td>
        <Table.Td>
          <ActionIcon
            // disabled={isAdded}
            size="sm"
            variant="default"
            onClick={() => onAddOrderItem(item)}
          >
            <IconPlus />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    )
  })

  return (
    <Box mih="400px">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Date</Table.Th>
            <Table.Th>Produit</Table.Th>
            <Table.Th>Quantité</Table.Th>
            <Table.Th>PPV. Unité</Table.Th>
            <Table.Th>Péremption</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  )
}

export const usePendingOrdersSelectorModal = ({
  onAddOrderItem,
  buttonProps
}: {
  onAddOrderItem: (orderItem: any) => void
  buttonProps?: ButtonProps
}) => {
  const [opened, { open, close }] = useDisclosure(false)
  const PendingOrdersSelectorModalCallback = useCallback(() => {
    return (
      <Modal
        centered
        size="xl"
        onClose={close}
        opened={opened}
        title={
          <Text fw="600">
            Détail des commandes passées au même fournisseur et non encore
            livrées
          </Text>
        }
      >
        <PendingOrdersSelectorModal
          onAddOrderItem={onAddOrderItem}
          // isOrderItemSelected={isOrderItemSelected}
        />
      </Modal>
    )
  }, [opened, close, onAddOrderItem])

  const PendingOrdersSelectorModalButtonCallback = useCallback(() => {
    return (
      <Button onClick={open} {...buttonProps}>
        Ajouter Commands
      </Button>
    )
  }, [open, buttonProps])

  return useMemo(
    () => ({
      opened,
      open,
      close,
      PendingOrdersSelector: PendingOrdersSelectorModalCallback,
      PendingOrdersSelectorButton: PendingOrdersSelectorModalButtonCallback
    }),
    [
      opened,
      open,
      close,
      PendingOrdersSelectorModalCallback,
      PendingOrdersSelectorModalButtonCallback
    ]
  )
}
