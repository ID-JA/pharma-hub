import {
  ActionIcon,
  Box,
  Button,
  Group,
  Input,
  InputBase,
  NumberInput,
  ScrollArea,
  Select,
  Table
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm, zodResolver } from '@mantine/form'
import { usePendingOrdersSelectorModal } from '@renderer/components/Orders/PendingOrdersSelectorModal'
import { IconTrash } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { memo, useEffect, useState } from 'react'
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
        discountRate: z.number(),
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

export function NewDeliveryPage() {
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

  const isOrderItemSelected = (orderId) => {
    return selectedDeliveryItems.some((item) => item.orderId === orderId)
  }
  const { PendingOrdersSelector, PendingOrdersSelectorButton } =
    usePendingOrdersSelectorModal({
      onAddOrderItem(orderItem) {
        if (!isOrderItemSelected(orderItem.id)) {
          setSelectedDeliveryItems((prev) => [
            ...prev,
            {
              orderId: orderItem.id,
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
            totalFreeUnits: 0
          })
        }
      },
      isOrderItemSelected
    })

  const rows = selectedDeliveryItems?.map((item, index) => {
    return (
      <Table.Tr key={item.orderId}>
        <Table.Td>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => {
              setSelectedDeliveryItems((prev) =>
                prev.filter((item) => item.orderId !== item.orderId)
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

  return (
    <Box p="lg">
      <PendingOrdersSelector />
      {JSON.stringify(form.getValues())}
      <Group justify="space-between" mb="md">
        <Group>
          <Select
            label="Selection Fournisseur"
            {...form.getInputProps('supplierId')}
          />
          <InputBase
            label="N° du Bon de Livraison"
            {...form.getInputProps('deliveryNumber')}
          />
          <DatePickerInput
            label="Date deLivraison"
            w="180px"
            {...form.getInputProps('deliveryDate')}
          />
        </Group>

        <div>
          <PendingOrdersSelectorButton />
          <Button variant="light" ml="md">
            Ajouter Produit
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
        <Table verticalSpacing="md">
          <TableHeader />
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
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
