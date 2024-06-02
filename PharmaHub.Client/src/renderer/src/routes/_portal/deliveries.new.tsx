import {
  ActionIcon,
  Box,
  Button,
  Drawer,
  Grid,
  Group,
  InputBase,
  NumberInput,
  ScrollArea,
  Select,
  Table,
  Text
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Form, useForm, zodResolver } from '@mantine/form'
import { useDebouncedState, useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { useListOrdersModal } from '@renderer/components/Orders/ListOrdersModal'
import {
  calculatePPH,
  calculatePriceAfterDiscount
} from '@renderer/utils/functions'
import { http } from '@renderer/utils/http'
import { IconPlus, IconShoppingCart, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
        quantity: z.number(),
        discount: z.number(),
        pph: z.number(),
        ppv: z.number(),
        inventoryId: z.number(),
        orderId: z.number().default(0)
      })
    )
    .default([])
})

type Order = z.infer<typeof schema>

function useDeliveryForm() {
  const form = useForm<Order>({
    initialValues: {
      totalQuantity: 0,
      supplierId: '',
      deliveryNumber: '',
      deliveryDate: new Date(),
      deliveryMedications: []
    },
    validate: zodResolver(schema)
  })

  const handleAddItem = useCallback(
    (item: any) => {
      form.insertListItem('deliveryMedications', {
        inventoryId: item.inventory.id,
        quantity: 1,
        ppv: item.inventory.ppv,
        pph: item.inventory.pph,
        discount: 0,
        orderId: 0
      })
    },
    [form]
  )

  const handleRemoveItem = useCallback(
    (index) => {
      form.removeListItem('deliveryMedications', index)
    },
    [form]
  )

  return {
    form,
    handleAddItem,
    handleRemoveItem
  }
}

export function NewDeliveryPage() {
  const [deliveryItems, setDeliveryItems] = useState<any[]>([])
  const { ListOrdersModal, setOpened } = useListOrdersModal()
  const { form, handleAddItem, handleRemoveItem } = useDeliveryForm()

  const deliveryItemsMemo = useMemo(() => {
    return deliveryItems
  }, [deliveryItems])

  const handleRemoveDeliveryItem = useCallback(
    (index) => {
      setDeliveryItems((prev) => prev.filter((_, i) => i !== index))
    },
    [setDeliveryItems]
  )

  const handleAdd = (item) => {
    handleAddItem(item)
    setDeliveryItems((prev) => [...prev, item])
  }

  const [totals, setTotals] = useState<any>({
    totalPpv: 0,
    totalPphBrut: 0,
    totalPphTtc: 0,
    totalProducts: 0,
    totalQuantities: 0,
    discountedPriceDN: 0
  })
  const { mutateAsync } = useMutation({
    mutationFn: async (data: Order) => {
      return (await http.post('/api/deliveries', data)).data
    },
    onSuccess: () => {
      toast.success('Delivery validated with success!')
    }
  })
  useEffect(() => {
    if (form.getValues().deliveryMedications?.length) {
      recalculateTotals()
    }
  }, [form.getValues().deliveryMedications])

  const recalculateTotals = () => {
    const totalPphTtc = form
      .getValues()
      .deliveryMedications.reduce(
        (acc, item) =>
          acc +
          calculatePriceAfterDiscount(item.pph, item.discount) * item.quantity,
        0
      )

    const totalPphBrut = form
      .getValues()
      .deliveryMedications.reduce(
        (acc, item) => acc + Number(item.pph) * item.quantity,
        0
      )
    setTotals({
      totalPpv: form
        .getValues()
        .deliveryMedications.reduce(
          (acc, item) => acc + Number(item.ppv) * item.quantity,
          0
        ),
      totalPphBrut,
      totalPphTtc,
      totalProducts: form.getValues().deliveryMedications.length,
      totalQuantities: form
        .getValues()
        .deliveryMedications.reduce(
          (acc, item) => acc + Number(item.quantity),
          0
        ),
      discountedPriceDN: totalPphBrut - totalPphTtc
    })
  }
  const [selectedPendingOrders, setSelectedPendingOrders] = useState<any[]>([])
  const handleRowSelect = (orderItem, isSelected) => {
    console.log({ orderItem })
    setSelectedPendingOrders((prevSelectedRows) =>
      isSelected
        ? [...prevSelectedRows, orderItem]
        : prevSelectedRows.filter(
            (item) =>
              `${item.order.id}-${item.inventory.id}` !==
              `${orderItem.order.id}-${orderItem.inventory.id}`
          )
    )

    if (isSelected) {
      form.insertListItem('deliveryMedications', {
        inventoryId: orderItem.inventory.id,
        quantity: orderItem.quantity,
        ppv: orderItem.inventory.ppv,
        pph: orderItem.inventory.pph,
        orderId: orderItem.order.id,
        discount: 0
      })
      setDeliveryItems((prev) => [
        ...prev,
        { medication: orderItem.inventory.medication, ...orderItem }
      ])
    } else {
      const index = form
        .getValues()
        .deliveryMedications.findIndex(
          (item) => item.inventoryId === orderItem.inventory.id
        )
      if (index !== -1) {
        form.removeListItem('deliveryMedications', index)
        setDeliveryItems((prev) => prev.filter((_, i) => i !== index))
        recalculateTotals()
      }
    }
  }

  const [opened, { close, open }] = useDisclosure(false)

  return (
    <Box p="lg">
      <ListOrdersModal
        selectedRows={selectedPendingOrders}
        onRowSelect={handleRowSelect}
      />
      <Inventories
        handleAddItem={handleAdd}
        items={deliveryItems}
        onClose={close}
        opened={opened}
      />
      <Form
        form={form}
        onSubmit={(values) => {
          modals.openConfirmModal({
            centered: true,
            title: 'Please confirm your action',
            children: (
              <Text size="sm">
                Are you sure you want to validate this delivery?
              </Text>
            ),
            labels: { confirm: 'Validate Delivery', cancel: 'Cancel' },
            onConfirm: async () => {
              await mutateAsync(values, {
                onSuccess: () => {
                  form.reset()
                  setDeliveryItems([])
                  setTotals({
                    totalPpv: 0,
                    totalPphBrut: 0,
                    totalProducts: 0
                  })
                }
              })
            }
          })
        }}
      >
        <Group mb="md" justify="space-between" align="center">
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
            />
            <DatePickerInput
              label="Delivery Date"
              {...form.getInputProps('deliveryDate')}
              key={form.key('deliveryDate')}
            />
          </Group>
          <Group>
            <NumberInput
              decimalScale={2}
              fixedDecimalScale
              w="130px"
              hideControls
              label="Total PPV"
              readOnly
              value={totals.totalPpv}
            />
            <NumberInput
              hideControls
              decimalScale={2}
              fixedDecimalScale
              w="130px"
              label="Total PPH brut"
              readOnly
              defaultValue={0}
              value={totals.totalPphBrut}
            />
            <NumberInput
              hideControls
              label="Total PPH Net TTC"
              decimalScale={2}
              defaultValue={0}
              fixedDecimalScale
              w="130px"
              readOnly
              value={totals.totalPphTtc}
            />
            <NumberInput
              hideControls
              label="Discount for DN "
              readOnly
              decimalScale={2}
              defaultValue={0}
              fixedDecimalScale
              w="130px"
              value={totals.discountedPriceDN}
            />
            <NumberInput
              hideControls
              label="Total Products"
              defaultValue={0}
              w="130px"
              readOnly
              value={totals.totalProducts}
            />
            <NumberInput
              hideControls
              label="Total Quantities"
              defaultValue={0}
              w="130px"
              readOnly
              value={totals.totalQuantities}
            />
          </Group>
        </Group>
        <ScrollArea h={550} type="never" mb="md">
          <Table
            verticalSpacing="md"
            style={{
              whiteSpace: 'nowrap'
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th w="200px">Product Name</Table.Th>
                <Table.Th ta="center">
                  Quantity <br /> Ordered
                </Table.Th>
                <Table.Th ta="center">
                  Quantity <br />
                  Delivered
                </Table.Th>
                <Table.Th ta="center">PPV. Unit</Table.Th>
                <Table.Th ta="center">PPH. Unit</Table.Th>
                <Table.Th ta="center">Discount</Table.Th>
                <Table.Th ta="center">TVA</Table.Th>
                <Table.Th ta="center">Marge</Table.Th>
                <Table.Th ta="center">Total PPH </Table.Th>
                <Table.Th ta="center">
                  Quantity <br /> Stock
                </Table.Th>
                <Table.Th ta="center"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {deliveryItems.length ? (
                deliveryItemsMemo.map((item: any, index: any) => (
                  <OrderItem
                    key={item.inventory.id}
                    form={form}
                    item={item}
                    index={index}
                    handleRemove={() => {
                      handleRemoveDeliveryItem(index)
                      handleRemoveItem(index)
                      recalculateTotals()

                      setSelectedPendingOrders((prev) =>
                        prev.filter(
                          (item) =>
                            `${item.order.id}-${item.inventory.id}` !==
                            `${item.order.id}-${item.inventory.id}`
                        )
                      )
                    }}
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
        <Group grow justify="center" w="50%" m="auto">
          <Button onClick={open}>Add Medications</Button>
          <Button
            type="submit"
            disabled={!form.getValues().deliveryMedications.length}
          >
            Validate Delivery
          </Button>
          <Button
            onClick={() => {
              modals.openConfirmModal({
                centered: true,
                title: 'Please confirm your action',
                children: (
                  <Text size="sm">
                    Are you sure you want to cancel this delivery?
                  </Text>
                ),
                labels: { confirm: 'Yes', cancel: 'No' },
                confirmProps: { color: 'red' },
                onConfirm: async () => {
                  form.reset()
                  setDeliveryItems([])
                  setTotals({
                    totalPpv: 0,
                    totalPphBrut: 0,
                    totalProducts: 0
                  })
                }
              })
            }}
          >
            Cancel
          </Button>
          <Button onClick={() => setOpened(true)}>Load Orders</Button>
        </Group>
      </Form>
    </Box>
  )
}

const OrderItem = ({ form, item, index, handleRemove }) => {
  const [totalPph, setTotalPph] = useState(item.pph * item.quantity)

  useEffect(() => {
    const deliveryMedications = form.getValues().deliveryMedications
    if (deliveryMedications && deliveryMedications[index]) {
      const { pph, quantity, discount } = deliveryMedications[index]
      console.log({ pph, quantity })
      setTotalPph(calculatePriceAfterDiscount(pph, discount) * quantity)
    }
  }, [form.getValues().deliveryMedications, index])
  return (
    <Table.Tr>
      <Table.Td>{item.medication.name}</Table.Td>
      <Table.Td ta="center" role-description="Quantity Ordered">
        <NumberInput readOnly size="xs" defaultValue={item.quantity || 1} />
      </Table.Td>
      <Table.Td ta="center" role-description="Quantity Delivered">
        <NumberInput
          size="xs"
          min={0}
          {...form.getInputProps(`deliveryMedications.${index}.quantity`)}
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="PPV">
        <NumberInput
          size="xs"
          readOnly
          hideControls
          defaultValue={item.ppv}
          {...form.getInputProps(`deliveryMedications.${index}.ppv`)}
          key={form.key(`deliveryMedications.${index}.ppv`)}
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="PPH">
        <NumberInput
          hideControls
          readOnly
          size="xs"
          defaultValue={item.pph}
          key={form.key(`deliveryMedications.${index}.pph`)}
          {...form.getInputProps(`deliveryMedications.${index}.pph`)}
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="Discount Rate">
        <NumberInput
          size="xs"
          min={0}
          max={99}
          defaultValue={0}
          {...form.getInputProps(`deliveryMedications.${index}.discount`)}
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="TVA">
        <NumberInput size="xs" defaultValue={item.medication.tva} readOnly />
      </Table.Td>

      <Table.Td ta="center" aria-roledescription="Marge">
        <NumberInput size="xs" readOnly defaultValue={item.medication.marge} />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="Total PPH">
        <NumberInput
          hideControls
          size="xs"
          readOnly
          value={totalPph}
          decimalScale={2}
        />
      </Table.Td>
      <Table.Td ta="center" aria-roledescription="Quantity in stock">
        <NumberInput
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
          onClick={handleRemove}
        >
          <IconTrash style={{ height: '80%', width: '80%' }} stroke={1.2} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  )
}

export function Inventories({
  handleAddItem,
  items,
  onClose,
  opened
}: {
  handleAddItem?: any
  items?: any
  onClose: () => void
  opened: boolean
}) {
  const [medicamentName, setMedicamentName] = useDebouncedState('', 500)
  // implement the infinity scroll
  const { data } = useQuery({
    queryKey: ['inventories', medicamentName],
    queryFn: async () => {
      return (
        await http.get('/api/inventories', {
          params: {
            medicament: medicamentName ? medicamentName : undefined
          }
        })
      ).data.data
    }
  })

  function isItemAdded(idToCheck) {
    return items.some((item) => item.inventory.id === idToCheck)
  }
  const rows = data?.map((item) => {
    return (
      <Table.Tr key={item.inventory.id}>
        <Table.Td>{item.medication.name}</Table.Td>
        <Table.Td ta="center">{item.inventory.quantity}</Table.Td>
        <Table.Td ta="center">{item.inventory.ppv}</Table.Td>
        <Table.Td ta="center">{item.inventory.pph}</Table.Td>
        <Table.Td ta="center">
          {dayjs(item.inventory.expirationDate).format('DD/MM/YYYY')}
        </Table.Td>
        <Table.Td ta="center">
          <ActionIcon
            variant="default"
            onClick={() => handleAddItem(item)}
            disabled={isItemAdded(item.inventory.id)}
          >
            <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.7} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    )
  })
  return (
    <Drawer
      onClose={onClose}
      opened={opened}
      title="Select Medication's Inventory"
    >
      <InputBase
        w="50%"
        label="Search for Medicaments"
        defaultValue={medicamentName}
        onChange={(event) => setMedicamentName(event.target.value)}
        placeholder="Medicament Name"
        mb="md"
      />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th ta="center">Quantity</Table.Th>
            <Table.Th ta="center">PPV</Table.Th>
            <Table.Th ta="center">PPH</Table.Th>
            <Table.Th ta="center">Expiration Date</Table.Th>
            <Table.Th ta="center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Drawer>
  )
}
