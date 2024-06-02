import {
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  Modal,
  Select,
  Table,
  Text,
  Title
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'

function ListOrdersModal({ selectedRows, onRowSelect }) {
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
    }
  })

  const handleSelect = (value) => {
    setFilterOptions((prev) => ({
      ...prev,
      supplier: value
    }))
  }

  const handleChangeDateRange = (value) => {
    setFilterOptions((prev) => ({
      ...prev,
      from: value[0],
      to: value[1]
    }))
  }
  return (
    <Box mih="400px">
      <Group mb="md" grow>
        <Select
          label="Supplier"
          onChange={handleSelect}
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
          onChange={handleChangeDateRange}
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
            const position = `${order.id}-${inventory.id}`
            const isSelected = selectedRows.some(
              (item) => `${item.order.id}-${item.inventory.id}` === position
            )
            return (
              <Table.Tr
                key={position}
                bg={isSelected ? 'var(--mantine-color-blue-light)' : undefined}
              >
                <Table.Td>
                  <Checkbox
                    aria-label="Select row"
                    checked={isSelected}
                    onChange={(event) =>
                      onRowSelect(orderItem, event.currentTarget.checked)
                    }
                  />
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
  const ListOrdersModalModalCallback = useCallback(
    ({
      selectedRows,
      onRowSelect
    }: {
      selectedRows: any[]
      onRowSelect: (orderItem: any, isSelected: boolean) => void
    }) => {
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
          <ListOrdersModal
            selectedRows={selectedRows}
            onRowSelect={onRowSelect}
          />
        </Modal>
      )
    },
    [opened, setOpened]
  )

  const ListOrdersModalButtonCallback = useCallback(() => {
    return (
      <Button
        onClick={() => {
          setOpened(true)
        }}
        variant="light"
      >
        Add New Inventory
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
