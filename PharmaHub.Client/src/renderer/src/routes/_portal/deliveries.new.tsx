import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Group,
  Input,
  InputBase,
  NumberInput,
  ScrollArea,
  Select,
  Table,
  Text
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { useInventorySelector } from '@renderer/components/Inventories/InventorySelectorDrawer'
import { usePendingOrdersSelectorModal } from '@renderer/components/Orders/PendingOrdersSelectorModal'
import { http } from '@renderer/utils/http'
import { IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { memo, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/_portal/deliveries/new')({
  component: NewDeliveryPage
})

const schema = z.object({
  totalQuantity: z.number(),
  deliveryId: z.number().default(0),
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
        discountRate: z.number(),
        inventoryId: z.number(),
        totalFreeUnits: z.number().default(0),
        orderItemId: z.number().default(0),
        pph: z.number().default(0),
        ppv: z.number().default(0)
      })
    )
    .default([])
})

type Order = z.infer<typeof schema>

function useDeliveryForm() {
  return useForm<Order>({
    initialValues: {
      deliveryId: 0,
      totalQuantity: 0,
      supplierId: '',
      deliveryNumber: '',
      deliveryDate: new Date(),
      deliveryMedications: []
    },
    validate: zodResolver(schema)
  })
}

export function NewDeliveryPage() {
  const [isDeliveryValidated, setIsDeliveryValidated] = useState(false)
  const [totals, setTotals] = useState({
    totalPpv: 0,
    gratPpv: 0,
    totalPphBrut: 0,
    totalPphNet: 0,
    totalProducts: 0,
    discountedPrice: 0,
    totalQuantities: 0
  })
  const [selectedDeliveryItems, setSelectedDeliveryItems] = useState<any>([])
  const form = useDeliveryForm()

  const isAdded = (key) => {
    return selectedDeliveryItems.some((item) => item.key === key)
  }

  const { PendingOrdersSelector, PendingOrdersSelectorButton } =
    usePendingOrdersSelectorModal({
      onAddOrderItem(orderItem) {
        console.log(orderItem)
        const key = `${orderItem.id}-${orderItem.inventory.id}`
        if (!isAdded(key)) {
          setSelectedDeliveryItems((prev) => [
            ...prev,
            {
              key,
              orderItemId: orderItem.id,
              orderedQuantity: orderItem.orderedQuantity,
              deliveredQuantity: orderItem.orderedQuantity,
              inventoryId: orderItem.inventory.id,
              discountRate: 0,
              medicationName: orderItem.inventory.medication.name,
              marge: orderItem.inventory.medication.marge,
              expirationDate: orderItem.inventory.expirationDate,
              ppv: orderItem.inventory.ppv,
              tva: orderItem.inventory.medication.tva,
              pph: orderItem.inventory.pph,
              quantityInStock: orderItem.inventory.quantity,
              totalFreeUnits: 0,
              totalPpv: orderItem.inventory.ppv * orderItem.orderedQuantity,
              totalPph: orderItem.inventory.pph * orderItem.orderedQuantity
            }
          ])
          form.insertListItem('deliveryMedications', {
            deliveredQuantity: orderItem.orderedQuantity,
            discountRate: 0,
            inventoryId: orderItem.inventory.id,
            totalFreeUnits: 0,
            orderItemId: orderItem.id,
            pph: orderItem.inventory.pph,
            ppv: orderItem.inventory.ppv
          })
        } else {
          toast.warning('Item already added')
        }
      },
      buttonProps: {
        variant: 'light',
        disabled: form.getValues().deliveryNumber.length < 1
      }
    })

  const { open: openInventories, InventorySelectorDrawer } =
    useInventorySelector({
      onAddInventory({ inventory, medication }) {
        const key = `0-${inventory.id}`
        if (!isAdded(key)) {
          setSelectedDeliveryItems((prev) => [
            ...prev,
            {
              key,
              orderItemId: 0,
              orderedQuantity: 0,
              deliveredQuantity: 1,
              inventoryId: inventory.id,
              discountRate: 0,
              medicationName: medication.name,
              marge: medication.marge,
              expirationDate: inventory.expirationDate,
              ppv: inventory.ppv,
              tva: medication.tva,
              pph: inventory.pph,
              quantityInStock: inventory.quantity,
              totalFreeUnits: 0,
              totalPpv: inventory.ppv * 1,
              totalPph: inventory.pph * 1
            }
          ])
          form.insertListItem('deliveryMedications', {
            deliveredQuantity: 1,
            discountRate: 0,
            inventoryId: inventory.id,
            totalFreeUnits: 0,
            orderItemId: 0,
            pph: inventory.pph,
            ppv: inventory.ppv
          })
        } else {
          toast.warning('Item already added')
        }
      }
    })

  const rows = selectedDeliveryItems?.map((item, index) => {
    return (
      <Table.Tr key={item.key}>
        <Table.Td>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => {
              setSelectedDeliveryItems((prev) =>
                prev.filter((i) => item.key !== i.key)
              )
              form.removeListItem('deliveryMedications', index)
            }}
          >
            <IconTrash />
          </ActionIcon>
        </Table.Td>
        <Table.Td>{item.medicationName}</Table.Td>
        <Table.Td>
          <Input w="80px" readOnly defaultValue={item.orderedQuantity} />
        </Table.Td>
        <Table.Td>
          <NumberInput
            w="80px"
            min={0}
            {...form.getInputProps(
              `deliveryMedications.${index}.deliveredQuantity`
            )}
            onBlur={(event) => {
              setSelectedDeliveryItems((prev) => {
                prev[index].totalPph =
                  prev[index].pph *
                  (1 - prev[index].discountRate / 100) *
                  Number(event.target.value)
                prev[index].deliveredQuantity = Number(event.target.value)
                return [...prev]
              })
            }}
          />
        </Table.Td>
        <Table.Td>
          <Input w="80px" readOnly defaultValue={item.ppv} />
        </Table.Td>
        <Table.Td>
          <Input w="80px" readOnly defaultValue={item.pph} />
        </Table.Td>
        <Table.Td>
          <NumberInput
            w="80px"
            min={0}
            max={100}
            {...form.getInputProps(`deliveryMedications.${index}.discountRate`)}
            onBlur={(event) => {
              setSelectedDeliveryItems((prev) => {
                prev[index].totalPph =
                  prev[index].pph *
                  (1 - Number(event.target.value) / 100) *
                  prev[index].deliveredQuantity
                prev[index].discountRate = Number(event.target.value)
                return [...prev]
              })
            }}
          />
        </Table.Td>
        <Table.Td>
          <Input w="80px" readOnly value={item.totalPph.toFixed(2)} />
        </Table.Td>
        <Table.Td>
          {new Date(item.expirationDate).toLocaleDateString()}
        </Table.Td>
        <Table.Td>
          <NumberInput
            w="80px"
            min={0}
            defaultValue={item.totalFreeUnits}
            {...form.getInputProps(
              `deliveryMedications.${index}.totalFreeUnits`
            )}
          />
        </Table.Td>
        <Table.Td>
          <Input w="80px" readOnly value={item.totalPpv} />
        </Table.Td>
        <Table.Td>
          <Input w="80px" readOnly defaultValue={item.quantityInStock} />
        </Table.Td>
        <Table.Td>
          <Input w="80px" readOnly defaultValue={item.tva} />
        </Table.Td>
        <Table.Td>
          <Input w="80px" readOnly defaultValue={item.marge} />
        </Table.Td>
      </Table.Tr>
    )
  })

  useEffect(() => {
    const deliveryMedications = form.getValues().deliveryMedications

    const totals = selectedDeliveryItems.reduce(
      (acc, item, index) => {
        const deliveredQuantity =
          deliveryMedications[index]?.deliveredQuantity || 0
        const totalFreeUnits = deliveryMedications[index]?.totalFreeUnits || 0
        const discountRate = deliveryMedications[index]?.discountRate || 0

        acc.totalQuantities += deliveredQuantity
        acc.gratPpv += totalFreeUnits * item.ppv
        acc.totalPpv += item.ppv * deliveredQuantity
        acc.totalPphBrut += item.pph * deliveredQuantity
        acc.totalPphNet +=
          item.pph * (1 - discountRate / 100) * deliveredQuantity

        return acc
      },
      {
        totalQuantities: 0,
        gratPpv: 0,
        totalPpv: 0,
        totalPphBrut: 0,
        totalPphNet: 0
      }
    )

    setTotals({
      totalProducts: selectedDeliveryItems.length,
      totalQuantities: totals.totalQuantities,
      gratPpv: totals.gratPpv,
      totalPpv: totals.totalPpv,
      totalPphBrut: totals.totalPphBrut,
      totalPphNet: totals.totalPphNet,
      discountedPrice: totals.totalPphBrut - totals.totalPphNet
    })
  }, [selectedDeliveryItems, form.getValues().deliveryMedications])

  const { refetch } = useQuery({
    queryKey: ['existedDelivery', form.getValues().deliveryNumber],
    queryFn: async () => {
      try {
        const res = await http.get('api/deliveries/search', {
          params: {
            deliveryNumber: form.getValues().deliveryNumber
          }
        })
        if (res.status === 200) {
          modals.openConfirmModal({
            title: 'Message de Confirmation',
            children: (
              <Text>
                This Delivery {form.getValues().deliveryNumber} is Already
                validated. Do you want to modify it?
              </Text>
            ),
            labels: { confirm: 'Oui', cancel: 'Non' },
            onCancel: () => form.setFieldValue('deliveryNumber', ''),
            onConfirm: () => {
              setIsDeliveryValidated(true)
              setSelectedDeliveryItems(
                res.data.orderDeliveryInventories.map((item) => {
                  const key = `${item.id}-${item.inventory.id}`
                  return {
                    key,
                    orderItemId: item.id,
                    orderedQuantity: item.orderedQuantity,
                    deliveredQuantity: item.deliveredQuantity,
                    inventoryId: item.inventory.id,
                    discountRate: item.discountRate,
                    medicationName: item.inventory.medication.name,
                    marge: item.inventory.medication.marge,
                    expirationDate: item.inventory.expirationDate,
                    ppv: item.inventory.ppv,
                    tva: item.inventory.medication.tva,
                    pph: item.inventory.pph,
                    quantityInStock:
                      item.inventory.quantity -
                      item.deliveredQuantity -
                      item.totalFreeUnits,
                    totalFreeUnits: item.totalFreeUnits,
                    totalPpv: item.inventory.ppv * item.deliveredQuantity,
                    totalPph: item.inventory.pph * item.deliveredQuantity
                  }
                })
              )
              form.setValues({
                deliveryId: res.data.id,
                supplierId: res.data.supplier.id.toString(),
                totalQuantity: res.data.totalQuantity,
                deliveryNumber: res.data.deliveryNumber.toString(),
                deliveryDate: new Date(res.data.deliveryDate),
                deliveryMedications: res.data.orderDeliveryInventories.map(
                  (item) => ({
                    deliveredQuantity: item.deliveredQuantity,
                    discountRate: item.discountRate,
                    inventoryId: item.inventory.id,
                    totalFreeUnits: item.totalFreeUnits,
                    orderItemId: item.id,
                    pph: item.inventory.pph,
                    ppv: item.inventory.ppv
                  })
                )
              })
            }
          })
          return res.data
        }
      } catch (error) {
        setIsDeliveryValidated(false)
        setSelectedDeliveryItems([])
        form.setValues({
          supplierId: undefined,
          totalQuantity: 0,
          deliveryDate: new Date(),
          deliveryMedications: []
        })
      }
      return null
    },
    retry: false,
    enabled: false
  })

  const { mutate: createDelivery } = useMutation({
    mutationFn: async (values: any) => {
      const res = await http.post('/api/deliveries', values)
      return res.data
    }
  })

  const { mutate: updateDelivery } = useMutation({
    mutationFn: async (values: any) => {
      const res = await http.put(`/api/deliveries/${values.deliveryId}`, values)
      return res.data
    }
  })

  return (
    <Box px="lg" py="md">
      {isDeliveryValidated && (
        <Alert
          style={{
            position: 'fixed',
            zIndex: 9999,
            top: '0px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          title="Cette Bon de Livraison est déjà valide"
          color="green"
          variant="filled"
        />
      )}
      <PendingOrdersSelector />
      <InventorySelectorDrawer />
      <form
        onSubmit={form.onSubmit((values) => {
          if (!isDeliveryValidated) {
            createDelivery(values, {
              onSuccess: () => {
                toast.success('La livraison a été mise à jour avec succès.')
                form.reset()
                setSelectedDeliveryItems([])
              },
              onError: () => {
                toast.error("Quelque chose de grave s'est produit.")
              }
            })
          } else {
            modals.openConfirmModal({
              title: 'Message de Confirmation',
              children: (
                <Text>Voulez-vous mettre à jour cette livraison ?</Text>
              ),
              labels: { confirm: 'Oui', cancel: 'Non' },
              onConfirm: () =>
                updateDelivery(values, {
                  onSuccess: () => {
                    toast.success('La livraison a été mise à jour avec succès.')
                    form.reset()
                    setSelectedDeliveryItems([])
                  },
                  onError: () => {
                    toast.error("Quelque chose de grave s'est produit.")
                  }
                })
            })
          }
        })}
      >
        <Group justify="space-between" mb="md">
          <Group>
            <Select
              data={[
                {
                  label: 'Supplier 1',
                  value: '1'
                }
              ]}
              label="Selection Fournisseur"
              {...form.getInputProps('supplierId')}
            />
            <InputBase
              label="N° du Bon de Livraison"
              {...form.getInputProps('deliveryNumber')}
              onBlur={() => {
                refetch()
              }}
            />
            <DatePickerInput
              label="Date deLivraison"
              w="180px"
              {...form.getInputProps('deliveryDate')}
            />
          </Group>

          <div>
            <PendingOrdersSelectorButton />
            <Button
              variant="light"
              ml="md"
              onClick={openInventories}
              disabled={form.getValues().deliveryNumber.length < 1}
            >
              Ajouter Produits
            </Button>
          </div>
        </Group>
        <ScrollArea
          h={490}
          style={{
            display: 'block',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          <Table verticalSpacing="md">
            <TableHeader />
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </form>

      <Group grow>
        <NumberInput
          label="TOTAL PPV"
          decimalScale={2}
          size="lg"
          readOnly
          hideControls
          value={totals.totalPpv}
        />
        <NumberInput
          label="GRAT.(PPV)"
          decimalScale={2}
          size="lg"
          readOnly
          hideControls
          value={totals.gratPpv}
        />
        <NumberInput
          label="TOTAL PPH BRUT"
          decimalScale={2}
          size="lg"
          readOnly
          hideControls
          value={totals.totalPphBrut}
        />
        <NumberInput
          label="TOTAL PPH NET TTC"
          decimalScale={2}
          size="lg"
          readOnly
          hideControls
          value={totals.totalPphNet}
        />
        <NumberInput
          label="REMISE SUR BL"
          decimalScale={2}
          size="lg"
          readOnly
          hideControls
          value={totals.discountedPrice}
        />
        <NumberInput
          label="NOMBRE PRODUITS"
          decimalScale={2}
          size="lg"
          readOnly
          hideControls
          value={totals.totalProducts}
        />
        <NumberInput
          label="TOTAL QUANTITIES"
          decimalScale={2}
          size="lg"
          readOnly
          hideControls
          value={totals.totalQuantities}
        />
      </Group>
      <Group justify="space-between" mt="md">
        <Button
          mr="md"
          type="submit"
          disabled={form.getValues().deliveryMedications.length < 1}
        >
          Validate Livraison
        </Button>
        <Button ml="md" color="red" disabled={!isDeliveryValidated}>
          Annuler Livraison
        </Button>
      </Group>
    </Box>
  )
}

const TableHeader = memo(() => {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th></Table.Th>
        <Table.Th w="200px">Produit</Table.Th>
        <Table.Th>Qté Cmd</Table.Th>
        <Table.Th>Qté Livrée</Table.Th>
        <Table.Th>PPV. Unit</Table.Th>
        <Table.Th>PPH. Unit</Table.Th>
        <Table.Th>Remise %</Table.Th>
        <Table.Th>Total PPh</Table.Th>
        <Table.Th>Périmé</Table.Th>
        <Table.Th>U. Gratuit</Table.Th>
        <Table.Th>Total PPV</Table.Th>
        <Table.Th>Qté Stock</Table.Th>
        <Table.Th>TVA %</Table.Th>
        <Table.Th>Marge %</Table.Th>
      </Table.Tr>
    </Table.Thead>
  )
})
