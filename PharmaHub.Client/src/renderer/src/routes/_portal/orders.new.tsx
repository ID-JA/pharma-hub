import {
  ActionIcon,
  Button,
  Box,
  Group,
  NumberInput,
  ScrollArea,
  Select,
  Table,
  Text
} from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import dayjs from 'dayjs'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { IconTrash } from '@tabler/icons-react'
import { calculatePPH, calculatePurchasePrice } from '@renderer/utils/functions'
import { useForm } from '@mantine/form'
import { z } from 'zod'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useMutation } from '@tanstack/react-query'
import { http } from '@renderer/utils/http'
import { useInventorySelector } from '@renderer/components/Inventories/InventorySelectorDrawer'
import { modals } from '@mantine/modals'
import { toast } from 'sonner'
import { userSuppliers } from '@renderer/services/suppliers.service'

export const Route = createFileRoute('/_portal/orders/new')({
  component: NewOrder
})
const schema = z.object({
  orderDate: z.date(),
  supplierId: z.string().min(1, { message: 'Required' }),
  orderItems: z
    .array(
      z.object({
        orderedQuantity: z.number().min(1, { message: 'More then 0' }),
        totalPurchasePrice: z.number(),
        purchasePriceUnit: z.number(),
        discountRate: z.number(),
        inventoryId: z.number(),
        discountedPPH: z.number()
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
        orderedQuantity: 1,
        totalPurchasePrice: calculatePurchasePrice(
          item.inventory.ppv,
          item.medication.marge,
          1
        ),
        purchasePriceUnit: calculatePurchasePrice(
          item.inventory.ppv,
          item.medication.marge,
          1
        ),
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

const useOrderMutation = () => {
  return useMutation({
    mutationFn: async (data: Order) => {
      const response = await http.post('/api/deliveries/orders', data)
      return response.data
    }
  })
}

const TableHeader = memo(() => (
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
        Nom Medicament
      </Table.Th>
      <Table.Th>Quantité en STOCK</Table.Th>
      <Table.Th>Quantité Commandé</Table.Th>
      <Table.Th>PPV</Table.Th>
      <Table.Th>PPH</Table.Th>
      <Table.Th>Total PPH</Table.Th>
      <Table.Th>Taux Remise</Table.Th>
      <Table.Th>Prix Réduit</Table.Th>
    </Table.Tr>
  </Table.Thead>
))

function NewOrder() {
  const { form } = useOrderForm()
  const [selectedInventories, setSelectedInventories] = useState<any[]>([])
  const [totals, setTotals] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    totalPPV: 0,
    purchasePrice: 0,
    discountedPrice: 0
  })

  const { mutate, isPending } = useOrderMutation()
  const isInventorySelected = (inventoryId) => {
    return selectedInventories.some((item) => item.inventoryId == inventoryId)
  }

  const { InventorySelectorDrawer, InventorySelectorDrawerButton } =
    useInventorySelector({
      onAddInventory: (item) => {
        console.log({ item })
        if (!isInventorySelected(item.inventory.id)) {
          setSelectedInventories((prev) => [
            ...prev,
            {
              orderedQuantity: 1,
              inventoryId: item.inventory.id,
              discountRate: 0,
              purchasePriceUnit:
                item.inventory.ppv * (1 - item.medication.marge / 100),
              totalPurchasePrice:
                item.inventory.ppv * (1 - item.medication.marge / 100),
              medicationName: item.medication.name,
              marge: item.medication.marge,
              ppv: item.inventory.ppv,
              tva: item.inventory.tva,
              pph: item.inventory.pph,
              quantityInStock: item.inventory.boxQuantity,
              maxQuantity: item.medication.maxQuantity,
              minQuantity: item.medication.minQuantity
            }
          ])

          form.insertListItem('orderItems', {
            orderedQuantity: 1,
            totalPurchasePrice:
              item.inventory.ppv * (1 - item.medication.marge / 100),
            inventoryId: item.inventory.id,
            discountRate: 0,
            purchasePriceUnit:
              item.inventory.ppv * (1 - item.medication.marge / 100),
            discountedPPH: item.inventory.ppv * (1 - 0 / 100)
          })
        }
      }
    })

  useEffect(() => {
    const orderItems = form.getValues().orderItems || []

    const totalProducts = orderItems.length
    const totalQuantity = orderItems.reduce(
      (sum, item) => sum + item.orderedQuantity,
      0
    )
    const totalPPV = orderItems.reduce(
      (sum, item) => sum + item.purchasePriceUnit,
      0
    )
    const purchasePrice = orderItems.reduce(
      (sum, item) => sum + item.totalPurchasePrice,
      0
    )
    const discountedPrice = orderItems.reduce(
      (sum, item) =>
        sum + item.totalPurchasePrice * (1 - item.discountRate / 100),
      0
    )

    setTotals({
      totalProducts,
      totalQuantity,
      totalPPV,
      purchasePrice,
      discountedPrice
    })
  }, [form.getValues().orderItems])

  const { data: suppliers = [], isLoading: fetchingSuppliers } = userSuppliers()

  const suppliersMemo = useMemo(
    () =>
      suppliers.map((s: any) => ({
        value: s.id.toString(),
        label: s.name
      })),
    [suppliers]
  )

  return (
    <Box p="md">
      <InventorySelectorDrawer />
      <form
        onSubmit={form.onSubmit((values) => {
          mutate(values, {
            onSuccess: () => {
              toast.success('La commande a été effectuée avec succès. ')
              setSelectedInventories([])
              form.reset()
              form.setFieldValue('orderDate', new Date())
            },
            onError: () => {
              toast.error('Une erreur est survenue. ')
            }
          })
        })}
      >
        <Group justify="space-between" mb="lg">
          <Group>
            <Select
              required
              label="Fournisseur"
              data={suppliersMemo}
              disabled={fetchingSuppliers}
              {...form.getInputProps('supplierId')}
            />
            <DatePickerInput
              readOnly
              label="Date Commande"
              {...form.getInputProps('orderDate')}
            />
            <TimeInput
              label="Heur Commande"
              readOnly
              value={dayjs(form.getInputProps('orderDate').value).format(
                'HH:mm'
              )}
            />
          </Group>
          <div>
            <InventorySelectorDrawerButton />
            <Button type="submit" ml="md" loading={isPending}>
              Valider la commande
            </Button>
          </div>
        </Group>

        <ScrollArea
          h={520}
          mb="md"
          style={{
            display: 'block',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          <Table verticalSpacing="md" style={{ whiteSpace: 'nowrap' }}>
            <TableHeader />
            <Table.Tbody>
              {selectedInventories.map((item, index) => {
                console.log({
                  item
                })
                return (
                  <Table.Tr key={item.inventoryId}>
                    <Table.Th miw="50px">
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => {
                          setSelectedInventories((prev) =>
                            prev.filter(
                              (inventory) =>
                                inventory.inventoryId !== item.inventoryId
                            )
                          )
                          form.removeListItem('orderItems', index)
                        }}
                      >
                        <IconTrash
                          style={{ width: '80%', height: '80%' }}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Table.Th>
                    <Table.Td miw="200px">{item.medicationName}</Table.Td>
                    <Table.Td>
                      <NumberInput
                        hideControls
                        readOnly
                        defaultValue={item.quantityInStock}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        min={0}
                        {...form.getInputProps(
                          `orderItems.${index}.orderedQuantity`
                        )}
                        key={form.key(`orderItems.${index}.orderedQuantity`)}
                        onBlur={(event) => {
                          const value = Number(event.currentTarget.value)
                          if (
                            item.maxQuantity !== 0 &&
                            value > item.maxQuantity
                          ) {
                            modals.open({
                              title: 'Warning',
                              modalId: 'warning',
                              centered: true,
                              withCloseButton: false,
                              children: (
                                <>
                                  <Text size="sm" mb="md">
                                    quantité doit être inférieure ou égale à
                                    quantité maximale de{' '}
                                    <b>{item.maxQuantity}</b>
                                  </Text>
                                  <Button
                                    fullWidth
                                    onClick={() => {
                                      modals.close('warning')
                                      event.target.focus()
                                    }}
                                  >
                                    Compris?
                                  </Button>
                                </>
                              )
                            })
                            form.setFieldError(
                              `orderItems.${index}.orderedQuantity`,
                              ' '
                            )
                            return
                          }

                          form.setFieldValue(
                            `orderItems.${index}.totalPurchasePrice`,
                            calculatePPH(item.ppv, item.marge) * value
                          )
                          form.setFieldValue(
                            `orderItems.${index}.discountedPPH`,
                            calculatePPH(item.ppv, item.marge) *
                              value *
                              (1 -
                                form.getValues().orderItems[index]
                                  .discountRate /
                                  100)
                          )
                        }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        hideControls
                        readOnly
                        decimalScale={2}
                        defaultValue={item.ppv}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        hideControls
                        readOnly
                        decimalScale={2}
                        {...form.getInputProps(
                          `orderItems.${index}.purchasePriceUnit`
                        )}
                        key={form.key(`orderItems.${index}.purchasePriceUnit`)}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        hideControls
                        decimalScale={2}
                        readOnly
                        {...form.getInputProps(
                          `orderItems.${index}.totalPurchasePrice`
                        )}
                        key={form.key(`orderItems.${index}.totalPurchasePrice`)}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        max={99}
                        min={0}
                        decimalScale={2}
                        {...form.getInputProps(
                          `orderItems.${index}.discountRate`
                        )}
                        key={form.key(`orderItems.${index}.discountRate`)}
                        onBlur={(event) => {
                          const discountRate = parseFloat(event.target.value)
                          form.setFieldValue(
                            `orderItems.${index}.discountedPPH`,
                            calculatePPH(item.ppv, item.marge) *
                              form.getValues().orderItems[index]
                                .orderedQuantity *
                              (1 - discountRate / 100)
                          )
                        }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        readOnly
                        hideControls
                        decimalScale={2}
                        {...form.getInputProps(
                          `orderItems.${index}.discountedPPH`
                        )}
                        key={form.key(`orderItems.${index}.discountedPPH`)}
                      />
                    </Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </form>

      <Group grow>
        <NumberInput
          label="Total Produits"
          size="lg"
          decimalScale={2}
          readOnly
          hideControls
          value={totals.totalProducts}
        />
        <NumberInput
          label="Total Quantité"
          size="lg"
          decimalScale={2}
          readOnly
          hideControls
          value={totals.totalQuantity}
        />
        <NumberInput
          label="Total PPV"
          size="lg"
          decimalScale={2}
          readOnly
          hideControls
          value={totals.totalPPV}
        />
        <NumberInput
          label="Total PPH"
          size="lg"
          decimalScale={2}
          readOnly
          hideControls
          value={totals.purchasePrice}
        />
        <NumberInput
          label="Total PPH Réduit"
          size="lg"
          decimalScale={2}
          readOnly
          hideControls
          value={totals.discountedPrice}
        />
      </Group>
    </Box>
  )
}
export default NewOrder
