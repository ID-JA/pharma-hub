import {
  ActionIcon,
  Box,
  Button,
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
import { useDebouncedState } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { calculatePPH } from '@renderer/utils/functions'
import { http } from '@renderer/utils/http'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/_portal/orders/new')({
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
  orderMedications: z
    .array(
      z.object({
        quantity: z.number(),
        pph: z.number(),
        ppv: z.number(),
        inventoryId: z.number()
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
      orderMedications: []
    },
    validate: zodResolver(schema)
  })

  const handleAddItem = useCallback(
    (item: any) => {
      form.insertListItem('orderMedications', {
        inventoryId: item.inventory.id,
        quantity: 1,
        ppv: item.inventory.ppv,
        pph: item.inventory.pph
      })
    },
    [form]
  )

  const handleRemoveItem = useCallback(
    (index) => {
      form.removeListItem('orderMedications', index)
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
    totalProducts: 0
  })
  const { mutateAsync } = useMutation({
    mutationFn: async (data: Order) => {
      return (await http.post('/api/orders', data)).data
    },
    onSuccess: (res) => {
      console.log(res)
      toast.success('YEYYEYEYE!')
    }
  })
  useEffect(() => {
    if (form.getValues().orderMedications?.length) {
      setTotals({
        totalPpv: form
          .getValues()
          .orderMedications.reduce((acc, item) => acc + Number(item.ppv), 0),
        totalPphBrut: form
          .getValues()
          .orderMedications.reduce((acc, item) => acc + Number(item.pph), 0),
        totalProducts: form.getValues().orderMedications.length
      })
    }
  }, [form.values])

  return (
    <Box p="lg">
      <Grid>
        <Grid.Col span={7}>
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
            <Group grow mb="md">
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
            <ScrollArea h={400} type="never" mb="md">
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
                        }}
                      />
                    ))
                  ) : (
                    <Table.Tr ta="center" td="underline" fw="500" fz="lg">
                      <Table.Td colSpan={9}>
                        Select the Medications on right side by clicking on (+)
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
            <Group grow mb="md">
              <NumberInput
                hideControls
                label="Total PPV"
                readOnly
                value={totals.totalPpv}
              />
              <NumberInput
                hideControls
                label="Total PPH brut"
                readOnly
                value={totals.totalPphBrut}
              />
              <NumberInput
                hideControls
                label="Total PPH Net TTC"
                readOnly
                value={totals.totalPphBrut}
              />
              <NumberInput hideControls label="Discount for DN " />
              <NumberInput
                hideControls
                label="Total Products"
                readOnly
                value={totals.totalProducts}
              />
            </Group>
            <Group grow>
              <Button type="submit">Validate Delivery</Button>
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
              <Button>Add Order</Button>
              <Button>Load Orders</Button>
            </Group>
          </Form>
        </Grid.Col>
        <Grid.Col span={5}>
          <div style={{ minHeight: 'calc(100% - 40px)' }}>
            <Inventories handleAddItem={handleAdd} items={deliveryItems} />
          </div>
        </Grid.Col>
      </Grid>
    </Box>
  )
}

const OrderItem = ({ form, item, index, handleRemove }) => {
  const [totalPph, setTotalPph] = useState(0)

  useEffect(() => {
    const orderMedications = form.getValues().orderMedications
    if (orderMedications && orderMedications[index]) {
      const { pph, quantity } = orderMedications[index]
      setTotalPph(pph * quantity)
    }
  }, [form.getValues().orderMedications, index])
  return (
    <Table.Tr>
      <Table.Td>{item.medication.name}</Table.Td>
      <Table.Td ta="center">
        <NumberInput hideControls size="xs" min={0} defaultValue={1} />
      </Table.Td>
      <Table.Td ta="center">
        <NumberInput
          hideControls
          size="xs"
          min={0}
          {...form.getInputProps(`orderMedications.${index}.quantity`)}
        />
      </Table.Td>
      <Table.Td ta="center">
        <NumberInput
          hideControls
          size="xs"
          min={0}
          defaultValue={item.ppv}
          {...form.getInputProps(`orderMedications.${index}.ppv`)}
          key={form.key(`orderMedications.${index}.ppv`)}
          onBlur={(event) => {
            form.setFieldValue(
              `orderMedications.${index}.pph`,
              calculatePPH(Number(event.target.value), item.medication.marge)
            )
          }}
        />
      </Table.Td>
      <Table.Td ta="center">
        <NumberInput
          hideControls
          size="xs"
          min={0}
          defaultValue={item.pph}
          key={form.key(`orderMedications.${index}.pph`)}
          {...form.getInputProps(`orderMedications.${index}.pph`)}
        />
      </Table.Td>
      <Table.Td ta="center">
        <NumberInput
          hideControls
          size="xs"
          min={0}
          defaultValue={item.medication.discountRate}
        />
      </Table.Td>
      <Table.Td ta="center">
        <NumberInput hideControls size="xs" min={0} readOnly value={totalPph} />
      </Table.Td>
      <Table.Td ta="center">
        <NumberInput
          hideControls
          size="xs"
          min={0}
          readOnly
          value={item.inventory.quantity}
        />
      </Table.Td>
      <Table.Td ta="center">
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

function Inventories({
  handleAddItem,
  items
}: {
  handleAddItem?: any
  items?: any
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
    <div>
      <InputBase
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
    </div>
  )
}
