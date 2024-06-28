import {
  Box,
  Button,
  Checkbox,
  Grid,
  Group,
  Loader,
  Radio,
  ScrollArea,
  Select,
  Stack,
  Table,
  TextInput,
  Title
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { userSuppliers } from '@renderer/services/suppliers.service'
import { http } from '@renderer/utils/http'
import { useQueries } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useMemo, useState, useCallback } from 'react'

type Supplier = {
  id: number
  name: string
}

type MedicationBase = {
  inventory: {
    ppv: number
    pph: number
    medication: {
      medicationType: string
      tva: number
      marge: number
    }
  }
}

type CreditNoteMedication = MedicationBase & {
  acceptedQuantity: number
}

type CreditNote = {
  id: number
  creditNoteNumber: number
  totalQuantities: number
  totalFreePpv: number
  totalPpv: number
  totalBrutPph: number
  totalNetPph: number
  discountedAmount: number
  createdAt: string
  creditNoteMedications: CreditNoteMedication[]
}

type DeliveryNoteMedication = MedicationBase & {
  deliveredQuantity: number
  discountRate: number
  totalPurchasePrice: number
  purchasePriceUnit: number
  totalFreeUnits: number
}

type DeliveryNote = {
  id: number
  deliveryNumber: number
  totalQuantities: number
  totalFreePpv: number
  totalPpv: number
  totalBrutPph: number
  totalNetPph: number
  discountedAmount: number
  deliveryDate: string
  orderDeliveryInventories: DeliveryNoteMedication[]
}

type FilterOptions = {
  supplier: string | null
  from: Date
  to: Date
}

type TransformedData = {
  docNumber: number
  totalQuantities: number
  totalFreePpv: number
  totalPpv: number
  totalBrutPph: number
  totalNetPph: number
  discountedAmount: number
  medications: {
    medicationType: string
    ppv: number
    pph: number
    quantity: number
    tva: number
    marge: number
    totalPurchasePrice: number
    purchasePriceUnit: number
    totalFreeUnits: number
    discountRate: number
  }[]
}

export const Route = createFileRoute('/_portal/bills/new')({
  component: NewBillPage
})

const transformData = (item: DeliveryNote | CreditNote): TransformedData => {
  const isCreditNote = 'creditNoteNumber' in item
  const medications = isCreditNote
    ? item.creditNoteMedications.map((medication) => ({
        medicationType: 'XML',
        ppv: medication.inventory.ppv,
        pph: medication.inventory.pph,
        quantity: medication.acceptedQuantity,
        tva: medication.inventory.medication.tva,
        marge: medication.inventory.medication.marge,
        totalPurchasePrice: 0,
        purchasePriceUnit: 0,
        totalFreeUnits: 0,
        discountRate: 0
      }))
    : item.orderDeliveryInventories.map((inventory) => ({
        medicationType: 'XML',
        ppv: inventory.inventory.ppv,
        pph: inventory.inventory.pph,
        quantity: inventory.deliveredQuantity,
        tva: inventory.inventory.medication.tva,
        marge: inventory.inventory.medication.marge,
        totalPurchasePrice: inventory.totalPurchasePrice,
        purchasePriceUnit: inventory.purchasePriceUnit,
        totalFreeUnits: inventory.totalFreeUnits,
        discountRate: inventory.discountRate
      }))

  return {
    docNumber: isCreditNote ? item.creditNoteNumber : item.deliveryNumber,
    totalQuantities: item.totalQuantities,
    totalFreePpv: item.totalFreePpv,
    totalPpv: item.totalPpv,
    totalBrutPph: item.totalBrutPph,
    totalNetPph: item.totalNetPph,
    discountedAmount: item.discountedAmount,
    medications
  }
}

type Medication = {
  medicationType: string
  ppv: number
  pph: number
  quantity: number
  tva: number
  marge: number
  totalPurchasePrice: number
  purchasePriceUnit: number
  totalFreeUnits: number
  discountRate: number
}

// Helper function to process data
const processData = (data: CreditNote[]) => {
  return data.map((creditNote) => {
    const totals = creditNote.creditNoteMedications.reduce(
      (acc, medication) => {
        console.log({ medication })
        const acceptedQuantity = medication.acceptedQuantity || 0
        const totalFreeUnits = 0
        const discountRate = 0

        acc.totalQuantities += acceptedQuantity
        acc.totalFreePpv += totalFreeUnits * medication.inventory.ppv * -1
        acc.totalPpv += medication.inventory.ppv * acceptedQuantity * -1
        acc.totalBrutPph += medication.inventory.pph * acceptedQuantity * -1
        acc.totalNetPph +=
          medication.inventory.pph *
          (1 - discountRate / 100) *
          acceptedQuantity *
          -1
        acc.discountedAmount = (acc.totalBrutPph - acc.totalNetPph) * -1
        return acc
      },
      {
        totalQuantities: 0,
        totalFreePpv: 0,
        totalPpv: 0,
        totalBrutPph: 0,
        totalNetPph: 0,
        discountedAmount: 0
      }
    )
    return {
      ...creditNote,
      ...totals
    }
  })
}

function NewBillPage() {
  const [selectedRows, setSelectedRows] = useState<TransformedData[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    supplier: null,
    from: dayjs().subtract(1, 'month').toDate(),
    to: dayjs().toDate()
  })

  const { data: suppliers = [], isLoading: fetchingSuppliers } = userSuppliers()

  const suppliersMemo = useMemo(
    () =>
      suppliers.map((s: Supplier) => ({
        value: s.id.toString(),
        label: s.name
      })),
    [suppliers]
  )

  const [
    { data: deliveries = [], isLoading: fetchingDeliveries },
    { data: creditNotes = [], isLoading: fetchingCreditNotes }
  ] = useQueries({
    queries: [
      {
        queryKey: ['deliveryNotes', filterOptions],
        queryFn: async () => {
          const response = await http.get('/api/deliveries', {
            params: {
              supplier: filterOptions.supplier,
              from: filterOptions.from,
              to: filterOptions.to
            }
          })
          return response.data.data
        },
        enabled: Boolean(filterOptions.from && filterOptions.to)
      },
      {
        queryKey: ['credit-notes', filterOptions],
        queryFn: async () => {
          const response = await http.get('/api/credit-notes', {
            params: {
              supplier: filterOptions.supplier,
              from: filterOptions.from,
              to: filterOptions.to
            }
          })
          return processData(response.data.data)
        },
        enabled: Boolean(filterOptions.from && filterOptions.to)
      }
    ]
  })

  const mergedData = useMemo(() => {
    return [...deliveries, ...creditNotes].sort((a, b) => {
      const dateA = a.deliveryDate || a.createdAt
      const dateB = b.deliveryDate || b.createdAt
      return dayjs(dateA).isAfter(dayjs(dateB)) ? -1 : 1
    })
  }, [deliveries, creditNotes])

  const handleRowSelect = useCallback(
    (item) => (event) => {
      const transformedItem = transformData(item)
      setSelectedRows(
        event.currentTarget.checked
          ? [...selectedRows, transformedItem]
          : selectedRows.filter(
              (selected) => selected.docNumber !== transformedItem.docNumber
            )
      )
    },
    [selectedRows]
  )

  const rows = useMemo(
    () =>
      mergedData.map((item) => (
        <Table.Tr
          key={item.id}
          c={item.creditNoteNumber ? 'red' : 'black'}
          fw="600"
        >
          <Table.Td>
            <Group>
              <Checkbox
                aria-label="Select row"
                checked={selectedRows.some(
                  (selected) =>
                    selected.docNumber ===
                    (item.deliveryNumber || item.creditNoteNumber)
                )}
                onChange={handleRowSelect(item)}
              />
              <span>{item.deliveryNumber || item.creditNoteNumber}</span>
            </Group>
          </Table.Td>
          <Table.Td>
            {dayjs(item.deliveryDate || item.createdAt).format('DD/MM/YYYY')}
          </Table.Td>
          <Table.Td>{item.totalPpv}</Table.Td>
          <Table.Td>{item.totalFreePpv}</Table.Td>
          <Table.Td>{item.totalBrutPph}</Table.Td>
          <Table.Td>{item.totalNetPph}</Table.Td>
          <Table.Td>{item.discountedAmount}</Table.Td>
        </Table.Tr>
      )),
    [mergedData, selectedRows, handleRowSelect]
  )

  const totalsByMedicationType = useMemo(() => {
    const totals: { [key: string]: any } = {}

    selectedRows.forEach((item) => {
      item.medications.forEach((med) => {
        const key = `${med.medicationType}-${med.tva}-${med.marge}`
        if (!totals[key]) {
          totals[key] = {
            medicationType: med.medicationType,
            ppv: 0,
            pph: 0,
            quantity: 0,
            totalPurchasePrice: 0,
            purchasePriceUnit: 0,
            totalFreeUnits: 0,
            discountRate: 0,
            tva: med.tva,
            marge: med.marge
          }
        }

        totals[key].ppv += med.ppv
        totals[key].pph += med.pph
        totals[key].quantity += med.quantity
        totals[key].totalPurchasePrice += med.totalPurchasePrice
        totals[key].purchasePriceUnit += med.purchasePriceUnit
        totals[key].totalFreeUnits += med.totalFreeUnits
        totals[key].discountRate += med.discountRate
      })
    })

    return Object.values(totals)
  }, [selectedRows])

  return (
    <Box>
      {JSON.stringify(totalsByMedicationType)}
      <Group>
        <Select
          required
          label="Fournisseur"
          data={suppliersMemo}
          disabled={fetchingSuppliers}
          value={filterOptions.supplier}
          onChange={(value) =>
            setFilterOptions((prev) => ({ ...prev, supplier: value }))
          }
        />
        <DatePickerInput
          allowSingleDateInRange
          valueFormat="DD/MM/YYYY"
          type="range"
          label="Sélectionner Période Date"
          value={[filterOptions.from, filterOptions.to]}
          onChange={(value) => {
            setFilterOptions((prev: FilterOptions) => ({
              ...prev,
              from: value[0] as Date,
              to: value[1] as Date
            }))
          }}
        />
        {fetchingDeliveries && fetchingCreditNotes && <Loader />}
      </Group>
      <Grid my="md">
        <Grid.Col span={8}>
          <Title order={4} td="underline" mb="sm">
            Les Bon Livraisons et Les Avoirs
          </Title>
          <ScrollArea h="38vh" type="never" mb="md">
            <Table style={{ whiteSpace: 'nowrap' }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>N° BL</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>PPV</Table.Th>
                  <Table.Th>Gratuit PPV</Table.Th>
                  <Table.Th>PPH BRUT</Table.Th>
                  <Table.Th>PPH NET</Table.Th>
                  <Table.Th>Dont Remise</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
          <ScrollArea h="38vh" type="never" mb="md">
            <Table style={{ whiteSpace: 'nowrap' }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Type de produit</Table.Th>
                  <Table.Th>Marge</Table.Th>
                  <Table.Th>TVA</Table.Th>
                  <Table.Th>PPV</Table.Th>
                  <Table.Th>Gratuit PPV</Table.Th>
                  <Table.Th>PPH BRUT</Table.Th>
                  <Table.Th>PPH NET</Table.Th>
                  <Table.Th>Dont Remise</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {totalsByMedicationType.map((medType) => (
                  <Table.Tr
                    key={`${medType.medicationType}-${medType.tva}-${medType.marge}`}
                  >
                    <Table.Td>{medType.medicationType}</Table.Td>
                    <Table.Td>{medType.marge}</Table.Td>
                    <Table.Td>{medType.tva}</Table.Td>
                    <Table.Td>{medType.ppv}</Table.Td>
                    <Table.Td>{medType.totalFreeUnits}</Table.Td>
                    <Table.Td>{medType.pph}</Table.Td>
                    <Table.Td>{medType.totalPurchasePrice}</Table.Td>
                    <Table.Td>{medType.discountRate}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack h="100%">
            <Box flex="1">
              <Group grow mb="md">
                <TextInput type="number" label="N° Facture" />
                <DatePickerInput label="Date Facture" />
              </Group>
              <Radio.Group name="paymentType" label="Type de paiement">
                <Group mt="xs" grow>
                  <Radio value="effet" label="Effet" />
                  <Radio value="chèque" label="Chèque" />
                  <Radio value="espèce" label="Espèce" />
                  <Radio value="non-réglée" label="Non Réglée" />
                </Group>
              </Radio.Group>
            </Box>
            <TextInput size="xl" label="TOTAL TCC" />
            <Button mt="sm" size="xl">
              {' '}
              Validation Facture
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  )
}

export default NewBillPage
