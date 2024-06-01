import {
  ActionIcon,
  Button,
  Box,
  Group,
  NumberInput,
  ScrollArea,
  Select,
  Table
} from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { Inventories } from './deliveries.new'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { IconTrash } from '@tabler/icons-react'
import {
  calculatePPH,
  calculatePriceAfterDiscount,
  calculatePurchasePrice
} from '@renderer/utils/functions'
import { Form, useForm } from '@mantine/form'
import { z } from 'zod'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useMutation } from '@tanstack/react-query'
import { http } from '@renderer/utils/http'
import { toast } from 'sonner'

export const Route = createFileRoute('/_portal/orders/new')({
  component: NewOrder
})
const schema = z.object({
  orderDate: z.date(),
  supplierId: z.string().min(1, { message: 'Required' }),
  orderItems: z
    .array(
      z.object({
        quantity: z.number().min(1, { message: 'More then 0' }),
        totalPurchasePrice: z.number(),
        pph: z.number(),
        discountRate: z.number(),
        inventoryId: z.number()
      })
    )
    .default([])
})

type Order = z.infer<typeof schema>

const useOrderForm = () => {
  const form = useForm<Order>({
    validate: zodResolver(schema),
    initialValues: {
      orderDate: new Date(),
      supplierId: '',
      orderItems: []
    }
  })

  const handleAddItem = useCallback(
    (item) => {
      form.insertListItem('orderItems', {
        inventoryId: item.inventory.id,
        quantity: 1,
        totalPurchasePrice:
          item.inventory.ppv * (1 - item.medication.marge / 100),
        pph: calculatePPH(item.inventory.ppv, item.medication.marge),
        discountRate: 0
      })
    },
    [form]
  )

  const handleRemoveItem = useCallback(
    (index) => {
      form.removeListItem('orderItems', index)
    },
    [form]
  )

  return {
    form,
    handleAddItem,
    handleRemoveItem
  }
}

const useOrderMutation = (form, setOrderedItems) => {
  return useMutation({
    mutationFn: async (data: Order) => {
      const response = await http.post('/api/deliveries/orders', data)
      return response.data
    },
    onSuccess: () => {
      setOrderedItems([])
      form.reset()
      toast.success('Order Created with Success')
      form.setFieldValue('orderDate', new Date())
    }
  })
}

const TableRow = ({ item, index, form, handleRemoveItem }) => (
  <Table.Tr key={item.inventory.id}>
    <Table.Th
      miw="50px"
      style={{
        position: 'sticky',
        left: 0,
        backgroundColor: 'var(--mantine-color-body)',
        zIndex: 1
      }}
    >
      <ActionIcon
        color="red"
        variant="light"
        onClick={() => handleRemoveItem(index, item.inventory.id)}
      >
        <IconTrash style={{ width: '80%', height: '80%' }} stroke={1.5} />
      </ActionIcon>
    </Table.Th>
    <Table.Td
      miw="200px"
      style={{
        position: 'sticky',
        left: '50px',
        backgroundColor: 'var(--mantine-color-body)',
        zIndex: 1
      }}
    >
      {item.medication.name}
    </Table.Td>
    <Table.Td>
      <NumberInput
        hideControls
        readOnly
        defaultValue={item.inventory.quantity}
      />
    </Table.Td>
    <Table.Td>
      <NumberInput
        defaultValue={0}
        {...form.getInputProps(`orderItems.${index}.quantity`)}
        key={form.key(`orderItems.${index}.quantity`)}
        onChange={(value) => {
          const updatedPPH = calculatePriceAfterDiscount(
            calculatePPH(item.inventory.ppv, item.medication.marge) *
              Number(value),
            form.getValues().orderItems[index].discountRate
          )
          form.setFieldValue(`orderItems.${index}.pph`, updatedPPH)
          form.setFieldValue(`orderItems.${index}.quantity`, value)
        }}
      />
    </Table.Td>
    <Table.Td aria-roledescription="Sale Price">
      <NumberInput
        hideControls
        w="100px"
        readOnly
        decimalScale={2}
        defaultValue={item.inventory.ppv}
      />
    </Table.Td>
    <Table.Td aria-roledescription="Purchase Price">
      <NumberInput
        hideControls
        w="100px"
        decimalScale={2}
        readOnly
        value={calculatePurchasePrice(
          item.inventory.ppv,
          item.medication.marge,
          form.getValues().orderItems[index].quantity
        ).toFixed(2)}
      />
    </Table.Td>
    <Table.Td>
      <NumberInput
        w="100px"
        {...form.getInputProps(`orderItems.${index}.discountRate`)}
        max={99}
        min={0}
        decimalScale={2}
        key={form.key(`orderItems.${index}.discountRate`)}
        onChange={(value) => {
          const updatedPPH = calculatePriceAfterDiscount(
            calculatePPH(item.inventory.ppv, item.medication.marge) *
              form.getValues().orderItems[index].quantity,
            Number(value)
          )
          form.setFieldValue(`orderItems.${index}.pph`, updatedPPH)
          form.setFieldValue(`orderItems.${index}.discountRate`, value)
        }}
      />
    </Table.Td>
    <Table.Td>
      <NumberInput
        readOnly
        hideControls
        decimalScale={2}
        w="100px"
        {...form.getInputProps(`orderItems.${index}.pph`)}
      />
    </Table.Td>
    <Table.Td>
      <NumberInput
        hideControls
        w="100px"
        readOnly
        decimalScale={2}
        defaultValue={(
          item.inventory.ppv *
          (1 - item.medication.marge / 100)
        ).toFixed(2)}
      />
    </Table.Td>
  </Table.Tr>
)
const TableHeader = () => (
  <Table.Thead>
    <Table.Tr>
      <Table.Th
        miw="50px"
        style={{
          position: 'sticky',
          left: 0,
          backgroundColor: 'var(--mantine-color-body)',
          zIndex: 1
        }}
      >
        ####
      </Table.Th>
      <Table.Th
        miw="200px"
        style={{
          position: 'sticky',
          left: '50px',
          backgroundColor: 'var(--mantine-color-body)',
          zIndex: 1
        }}
      >
        Product Name
      </Table.Th>
      <Table.Th>Quantity inStock</Table.Th>
      <Table.Th>Quantity Ordered</Table.Th>
      <Table.Th>Sale Price</Table.Th>
      <Table.Th>Purchase Price</Table.Th>
      <Table.Th>Discount Rate</Table.Th>
      <Table.Th>Discounted PPH</Table.Th>
      <Table.Th>Purchase Price Unit</Table.Th>
    </Table.Tr>
  </Table.Thead>
)

function NewOrder() {
  const [orderedItems, setOrderedItems] = useState<any>([])

  const { form, handleAddItem, handleRemoveItem } = useOrderForm()
  const { mutate, isPending } = useOrderMutation(form, setOrderedItems)

  const handleAdd = (item) => {
    handleAddItem(item)
    setOrderedItems((prev) => [...prev, item])
  }

  const handleRemove = (index, itemId) => {
    handleRemoveItem(index)
    setOrderedItems((prev) =>
      prev.filter((item) => item.inventory.id !== itemId)
    )
  }

  return (
    <Box p="md">
      <Box mih="330px">
        <Inventories items={orderedItems} handleAddItem={handleAdd} />
      </Box>

      <Form form={form} onSubmit={(values) => mutate(values)}>
        <Group>
          <Select
            label="Select Supplier"
            placeholder="Select a supplier"
            data={[{ value: '1', label: 'ABC Medications' }]}
            {...form.getInputProps('supplierId')}
            key={form.key('supplierId')}
          />
          <DatePickerInput
            readOnly
            label="Order Date"
            {...form.getInputProps('orderDate')}
          />
          <TimeInput
            label="Order Time"
            readOnly
            value={dayjs(form.getInputProps('orderDate').value).format('HH:mm')}
          />
        </Group>

        <ScrollArea h={300} type="never" my="md">
          <Table verticalSpacing="md" style={{ whiteSpace: 'nowrap' }}>
            <TableHeader />
            <Table.Tbody>
              {orderedItems.map((item, index) => (
                <TableRow
                  key={item.inventory.id}
                  item={item}
                  index={index}
                  form={form}
                  handleRemoveItem={handleRemove}
                />
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
        <Group justify="end" p="md">
          <Button
            type="submit"
            loading={isPending}
            disabled={orderedItems.length === 0}
          >
            Validate Order
          </Button>
          <Button variant="outline">Cancel Order</Button>
          <Button variant="outline">Print Order</Button>
        </Group>
      </Form>
    </Box>
  )
}
export default NewOrder
