import {
  Box,
  Button,
  Checkbox,
  Divider,
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
import { useForm } from '@mantine/form'
import { userSuppliers } from '@renderer/services/suppliers.service'
import { http } from '@renderer/utils/http'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useMemo, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

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
  id: number
  docNumber: number
  docType: string
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

const BillCreateDtoSchema = z.object({
  billNumber: z
    .string()
    .refine((data) => data.length > 0, { message: 'Required' }),
  billDate: z.date(),
  paymentType: z
    .string()
    .refine((data) => data.length > 0, { message: 'Required' }),
  checkNumber: z.string().optional().nullable(),
  effectNumber: z.string().optional().nullable(),
  dueDate: z.date().optional().nullable(),
  disbursementDate: z.date().optional().nullable(),
  bankName: z.string().optional().nullable(),
  totalPayment: z.number(),
  deliveriesIds: z.array(z.number()).default([]),
  creditNotesIds: z.array(z.number()).default([])
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
    id: item.id,
    docNumber: isCreditNote ? item.creditNoteNumber : item.deliveryNumber,
    docType: isCreditNote ? 'credit-note' : 'delivery-note',
    totalQuantities: item.totalQuantities,
    totalFreePpv: item.totalFreePpv,
    totalPpv: item.totalPpv,
    totalBrutPph: item.totalBrutPph,
    totalNetPph: item.totalNetPph,
    discountedAmount: item.discountedAmount,
    medications
  }
}

const processData = (data: CreditNote[]) => {
  return data.map((creditNote) => {
    const totals = creditNote.creditNoteMedications.reduce(
      (acc, medication) => {
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
      type: 'credit-note',
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

  const form = useForm({
    initialValues: {
      billNumber: '',
      billDate: new Date(),
      paymentType: '',
      checkNumber: '',
      effectNumber: '',
      dueDate: undefined,
      disbursementDate: undefined,
      bankName: '',
      totalPayment: 0,
      deliveriesIds: [],
      creditNotesIds: []
    },
    validate: zodResolver(BillCreateDtoSchema)
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
  const queryClient = useQueryClient()

  const [
    { data: deliveries = [], isLoading: fetchingDeliveries },
    { data: creditNotes = [], isLoading: fetchingCreditNotes }
  ] = useQueries({
    queries: [
      {
        queryKey: ['delivery-notes', filterOptions],
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
        enabled: !!filterOptions.supplier
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
        enabled: !!filterOptions.supplier
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
      const isSelected = event.currentTarget.checked
      const type = transformedItem.docType as 'delivery-note' | 'credit-note'
      setSelectedRows((prevSelectedRows) =>
        isSelected
          ? [...prevSelectedRows, transformedItem]
          : prevSelectedRows.filter(
              (selected) => selected.docNumber !== transformedItem.docNumber
            )
      )

      if (type === 'delivery-note') {
        if (isSelected) {
          form.insertListItem('deliveriesIds', transformedItem.id)
        } else {
          const index = form.values.deliveriesIds.indexOf(
            transformedItem.id as never
          )
          if (index > -1) {
            form.removeListItem('deliveriesIds', index)
          }
        }
      } else if (type === 'credit-note') {
        if (isSelected) {
          form.insertListItem('creditNotesIds', transformedItem.id)
        } else {
          const index = form.values.creditNotesIds.indexOf(
            transformedItem.id as never
          )
          if (index > -1) {
            form.removeListItem('creditNotesIds', index)
          }
        }
      }
    },
    [form, setSelectedRows]
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
    const totals: { [key: string]: any } = {
      deliveryNote: {},
      creditNote: {}
    }
    let deliveryNoteTotalPurchasePrice = 0
    let creditNoteTotalPurchasePrice = 0

    selectedRows.forEach((item) => {
      const docType =
        item.docType === 'delivery-note' ? 'deliveryNote' : 'creditNote'

      item.medications.forEach((med) => {
        const key = `${med.medicationType}-${med.tva}-${med.marge}`
        if (!totals[docType][key]) {
          totals[docType][key] = {
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

        totals[docType][key].ppv +=
          med.ppv * med.quantity * (docType === 'creditNote' ? -1 : 1)
        totals[docType][key].pph += med.pph * med.quantity
        totals[docType][key].quantity += med.quantity
        totals[docType][key].totalPurchasePrice +=
          docType === 'creditNote'
            ? med.pph * med.quantity * -1
            : med.totalPurchasePrice
        totals[docType][key].purchasePriceUnit += med.purchasePriceUnit
        totals[docType][key].totalFreeUnits += med.totalFreeUnits
        totals[docType][key].discountRate += med.discountRate

        if (docType === 'deliveryNote') {
          deliveryNoteTotalPurchasePrice +=
            totals[docType][key].totalPurchasePrice
        } else {
          creditNoteTotalPurchasePrice +=
            totals[docType][key].totalPurchasePrice
        }
      })
    })
    form.setFieldValue(
      'totalPayment',
      deliveryNoteTotalPurchasePrice - Math.abs(creditNoteTotalPurchasePrice)
    )
    return {
      deliveryNote: Object.values(totals.deliveryNote),
      creditNote: Object.values(totals.creditNote)
    }
  }, [selectedRows])

  const renderTableRows = (medTypeArray) => {
    return medTypeArray.map((medType) => (
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
    ))
  }

  const { mutateAsync: createBill } = useMutation({
    mutationFn: async (data: any) => {
      return (await http.post('/api/bills', data)).data
    }
  })

  return (
    <Box>
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
                  <Table.Th>PPH NET TTC</Table.Th>
                  <Table.Th>Dont Remise</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {renderTableRows(totalsByMedicationType.deliveryNote)}
                {renderTableRows(totalsByMedicationType.creditNote)}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Grid.Col>
        <Grid.Col span={4}>
          <form
            onSubmit={form.onSubmit(async (values) => {
              await createBill(values, {
                onSuccess: () => {
                  toast.success('Facture enregistre avec succès')
                  form.reset()
                  setSelectedRows([])
                  queryClient.invalidateQueries({
                    queryKey: ['credit-notes']
                  })
                  queryClient.invalidateQueries({
                    queryKey: ['delivery-notes']
                  })
                },
                onError: () => {
                  toast.error("Erreur lors de l'enregistrement de la facture")
                }
              })
            })}
          >
            <Stack h="100%">
              <Box flex="1">
                <Group grow mb="md">
                  <TextInput
                    type="number"
                    label="N° Facture"
                    {...form.getInputProps('billNumber')}
                  />
                  <DatePickerInput
                    label="Date Facture"
                    {...form.getInputProps('billDate')}
                  />
                </Group>
                <Radio.Group
                  name="paymentType"
                  label="Type de paiement"
                  {...form.getInputProps('paymentType')}
                >
                  <Group mt="xs" grow>
                    <Radio value="effet" label="Effet" />
                    <Radio value="chèque" label="Chèque" />
                    <Radio value="espèce" label="Espèce" />
                    <Radio value="non-réglée" label="Non Réglée" />
                  </Group>
                </Radio.Group>
                <Stack mt="md">
                  <TextInput
                    disabled={form.getValues().paymentType !== 'effet'}
                    type="number"
                    label="N° EFFET"
                    {...form.getInputProps('effectNumber')}
                  />
                  <DatePickerInput
                    disabled={form.getValues().paymentType !== 'effet'}
                    label="Échéance Du"
                    {...form.getInputProps('dueDate')}
                  />
                  <Divider />
                  <TextInput
                    disabled={form.getValues().paymentType !== 'chèque'}
                    type="number"
                    label="N° Chèque"
                    {...form.getInputProps('checkNumber')}
                  />
                  <TextInput
                    disabled={form.getValues().paymentType !== 'chèque'}
                    type="number"
                    label="BANQUE pour gestion relevé bancaire"
                    {...form.getInputProps('bankName')}
                  />
                </Stack>
              </Box>
              <TextInput
                label="TOTAL TCC"
                description="Valeur TTC = (PPH BL - PPH Avoirs)"
                size="lg"
                readOnly
                {...form.getInputProps('totalPayment')}
              />
              <Button mt="sm" size="lg" type="submit">
                Validation Facture
              </Button>
            </Stack>
          </form>
        </Grid.Col>
      </Grid>
    </Box>
  )
}

export default NewBillPage
