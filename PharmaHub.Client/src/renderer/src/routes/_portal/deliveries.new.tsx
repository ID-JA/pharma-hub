import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Group,
  InputBase,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Form, useForm, zodResolver } from '@mantine/form'
import { useDebouncedState, useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { useListOrdersModal } from '@renderer/components/Orders/ListOrdersModal'
import { useDeliveryItems, useOrdersAction } from '@renderer/store/order.store'
import {
  calculatePPH,
  calculatePriceAfterDiscount
} from '@renderer/utils/functions'
import { http } from '@renderer/utils/http'
import { IconPlus, IconShoppingCart, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/_portal/deliveries/new')({
  component: NewDeliveryPage
})

const schema = z.object({
  totalQuantity: z.number(),
  supplierId: z.string().min(1, {
    message: 'Required'
  }),
  deliveryNumber: z.string().min(1, {
    message: 'Required'
  }),
  deliveryDate: z.date(),
  deliveryMedications: z
    .array(
      z.object({
        deliveredQuantity: z.number(),
        discount: z.number(),
        inventoryId: z.number(),
        totalFreeUnits: z.number().default(0),
        orderId: z.number().default(0)
      })
    )
    .default([])
})

type Order = z.infer<typeof schema>

function useDeliveryForm() {
  return useForm<Order>({
    initialValues: {
      totalQuantity: 0,
      supplierId: '',
      deliveryNumber: '',
      deliveryDate: new Date(),
      deliveryMedications: []
    },
    validate: zodResolver(schema)
  })
}

const MemoizedNumberInput = memo((props: any) => <NumberInput {...props} />)

export function NewDeliveryPage() {
  const { ListOrdersModal, ListOrdersModalButton } = useListOrdersModal()
  const selectedPendingOrders = useDeliveryItems()
  const form = useDeliveryForm()

  const [opened, { close, open }] = useDisclosure(false)

  const [totals, setTotals] = useState<any>({
    totalPpv: 0,
    totalPphBrut: 0,
    totalPphTtc: 0,
    totalProducts: 0,
    totalQuantities: 0,
    discountedPriceDN: 0
  })

  const calculateTotals = () => {
    const totalPphTtc = selectedPendingOrders.reduce(
      (acc, item) =>
        acc +
        calculatePriceAfterDiscount(item.inventory.pph, item.discountRate) *
          item.deliveredQuantity,
      0
    )
    const totalPphBrut = selectedPendingOrders.reduce(
      (acc, item) => acc + Number(item.inventory.pph) * item.deliveredQuantity,
      0
    )
    const totalPpv = selectedPendingOrders.reduce(
      (acc, item) => acc + Number(item.inventory.ppv) * item.deliveredQuantity,
      0
    )
    const totalQuantities = selectedPendingOrders.reduce(
      (acc, item) => acc + Number(item.deliveredQuantity),
      0
    )

    setTotals({
      totalPpv,
      totalPphBrut,
      totalPphTtc,
      totalQuantities,
      discountedPriceDN: totalPphBrut - totalPphTtc,
      totalProducts: selectedPendingOrders.length
    })
  }

  useEffect(() => {
    form.setFieldValue('deliveryMedications', selectedPendingOrders)
    calculateTotals()
  }, [selectedPendingOrders])

  const itemCount = selectedPendingOrders.length
  return (
    <Box p="lg">
      <ListOrdersModal />
      <Group justify="space-between" align="center">
        <Stack>
          <Group>
            <Select
              label="Supplier"
              data={[{ value: '1', label: 'Supplier 1' }]}
              {...form.getInputProps('supplierId')}
              key={form.key('supplierId')}
            />
            <InputBase
              label="Delivery Number"
              {...form.getInputProps('deliveryNumber')}
              key={form.key('deliveryNumber')}
              onBlur={() => {}}
            />
            <DatePickerInput
              label="Delivery Date"
              {...form.getInputProps('deliveryDate')}
              key={form.key('deliveryDate')}
            />
          </Group>
          <div>
            <ListOrdersModalButton />
            <Button onClick={open}>Add Medications</Button>
          </div>
        </Stack>
        <Stack>
          <Group>
            <MemoizedNumberInput
              size="xl"
              w="170px"
              decimalScale={2}
              fixedDecimalScale
              hideControls
              label="Total PPV"
              readOnly
              value={totals.totalPpv}
            />
            <MemoizedNumberInput
              size="xl"
              w="170px"
              hideControls
              decimalScale={2}
              fixedDecimalScale
              label="Total PPH brut"
              readOnly
              defaultValue={0}
              value={totals.totalPphBrut}
            />
            <MemoizedNumberInput
              size="xl"
              w="170px"
              hideControls
              label="Total PPH Net TTC"
              decimalScale={2}
              defaultValue={0}
              fixedDecimalScale
              readOnly
              value={totals.totalPphTtc}
            />
          </Group>
          <Group>
            <MemoizedNumberInput
              size="xl"
              w="170px"
              hideControls
              label="Discount Price"
              readOnly
              decimalScale={2}
              defaultValue={0}
              fixedDecimalScale
              value={totals.discountedPriceDN}
            />
            <MemoizedNumberInput
              size="xl"
              w="170px"
              hideControls
              label="Total Products"
              defaultValue={0}
              readOnly
              value={totals.totalProducts}
            />
            <MemoizedNumberInput
              size="xl"
              w="170px"
              hideControls
              label="Total Quantities"
              defaultValue={0}
              readOnly
              value={totals.totalQuantities}
            />
          </Group>
        </Stack>
      </Group>
      <Divider my="md" />
      <Form form={form}>
        <ScrollArea h={350} type="never" mb="md">
          <Table verticalSpacing="md" style={{ whiteSpace: 'nowrap' }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w="200px">Product Name</Table.Th>
                <Table.Th ta="center">Quantity Ordered</Table.Th>
                <Table.Th ta="center">Quantity Delivered</Table.Th>
                <Table.Th ta="center">PPV. Unit</Table.Th>
                <Table.Th ta="center">PPH. Unit</Table.Th>
                <Table.Th ta="center">Discount</Table.Th>
                <Table.Th ta="center">TVA</Table.Th>
                <Table.Th ta="center">Marge</Table.Th>
                <Table.Th ta="center">Total PPH</Table.Th>
                <Table.Th ta="center">Quantity Stock</Table.Th>
                <Table.Th ta="center"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {itemCount > 0 ? (
                selectedPendingOrders.map((item, index) => (
                  <OrderItem
                    key={index}
                    form={form}
                    item={item}
                    index={index}
                  />
                ))
              ) : (
                <Table.Tr ta="center" td="underline" fw="500" fz="lg">
                  <Table.Td colSpan={11}>
                    <IconShoppingCart
                      stroke={1.2}
                      style={{ width: '90px', height: '90px' }}
                    />
                    <br />
                    Select the Medications on right side by clicking on (+)
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Form>
    </Box>
  )
}

const OrderItem = memo(({ form, item, index }: any) => {
  const [totalPph, setTotalPph] = useState(item.pph * item.quantity)
  const { removeDeliveryItem } = useOrdersAction()

  const calculateTotalPph = useCallback(() => {
    const deliveryMedications = form.getValues().deliveryMedications
    if (deliveryMedications && deliveryMedications[index]) {
      const { pph, quantity, discount } = deliveryMedications[index]
      setTotalPph(calculatePriceAfterDiscount(pph, discount) * quantity)
    }
  }, [form, index])

  useEffect(() => {
    calculateTotalPph()
  }, [calculateTotalPph])

  return (
    <Table.Tr key={index}>
      <Table.Td>{item.medication.name}</Table.Td>
      <Table.Td ta="center" role-description="Quantity Ordered">
        <MemoizedNumberInput
          readOnly
          size="xs"
          defaultValue={item.orderedQuantity || 0}
        />
      </Table.Td>
      <Table.Td ta="center" role-description="Quantity Delivered">
        <MemoizedNumberInput
          size="xs"
          min={0}
          {...form.getInputProps(
            `deliveryMedications.${index}.orderedQuantity`
          )}
          key={form.key(`deliveryMedications.${index}.orderedQuantity`)}
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="PPV">
        <MemoizedNumberInput
          size="xs"
          readOnly
          hideControls
          defaultValue={item.inventory.ppv}
          {...form.getInputProps(`deliveryMedications.${index}.ppv`)}
          key={form.key(`deliveryMedications.${index}.ppv`)}
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="PPH">
        <MemoizedNumberInput
          hideControls
          readOnly
          size="xs"
          defaultValue={item.inventory.pph}
          key={form.key(`deliveryMedications.${index}.pph`)}
          {...form.getInputProps(`deliveryMedications.${index}.pph`)}
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="Discount Rate">
        <MemoizedNumberInput
          size="xs"
          min={0}
          max={99}
          defaultValue={0}
          {...form.getInputProps(`deliveryMedications.${index}.discountRate`)}
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="TVA">
        <MemoizedNumberInput
          size="xs"
          defaultValue={item.medication.tva}
          readOnly
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="Marge">
        <MemoizedNumberInput
          size="xs"
          readOnly
          defaultValue={item.medication.marge}
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="Total PPH">
        <MemoizedNumberInput
          hideControls
          size="xs"
          readOnly
          decimalScale={2}
          value={totalPph}
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="Quantity in stock">
        <MemoizedNumberInput
          hideControls
          size="xs"
          readOnly
          value={item.inventory.quantity}
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="Actions">
        <ActionIcon
          color="red"
          variant="light"
          size="sm"
          onClick={() => removeDeliveryItem(item.inventory.id)}
        >
          <IconTrash style={{ height: '80%', width: '80%' }} stroke={1.2} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  )
})
