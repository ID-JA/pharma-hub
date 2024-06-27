import {
  Box,
  Checkbox,
  Grid,
  Group,
  ScrollArea,
  Select,
  Table,
  Title
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { userSuppliers } from '@renderer/services/suppliers.service'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/_portal/bills/new')({
  component: NewBillPage
})

const processData = (data) => {
  return data.map((creditNote) => {
    const totals = {
      totalQuantities: 0,
      totalFreePpv: 0,
      totalPpv: 0,
      totalBrutPph: 0,
      totalNetPph: 0,
      discountedAmount: 0
    }

    const processedMedications = creditNote.creditNoteMedications.map(
      (medication) => {
        const acceptedQuantity = medication.acceptedQuantity || 0
        const totalFreeUnits = 0
        const discountRate = 0

        totals.totalQuantities += acceptedQuantity
        totals.totalFreePpv += totalFreeUnits * medication.inventory.ppv
        totals.totalPpv += medication.inventory.ppv * acceptedQuantity
        totals.totalBrutPph += medication.inventory.pph * acceptedQuantity
        totals.totalNetPph +=
          medication.inventory.pph * (1 - discountRate / 100) * acceptedQuantity
        totals.discountedAmount = totals.totalBrutPph - totals.totalNetPph
        return {
          ...medication,
          acceptedQuantity,
          totalFreeUnits,
          discountRate
        }
      }
    )

    return {
      ...creditNote,
      creditNoteMedications: processedMedications,
      ...totals
    }
  })
}

function NewBillPage() {
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const { data: suppliers = [], isLoading: fetchingSuppliers } = userSuppliers()
  const suppliersMemo = useMemo(
    () => suppliers.map((s) => ({ value: s.id.toString(), label: s.name })),
    [suppliers]
  )
  const [filterOptions, setFilterOptions] = useState<any>({
    supplier: null,
    from: dayjs().subtract(7, 'days').toDate(),
    to: dayjs().toDate()
  })

  const { data: deliveries = [] } = useQuery({
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
    enabled: Boolean(
      (filterOptions.from && filterOptions.to) || filterOptions.supplier
    )
  })
  const { data: creditNotes = [] } = useQuery({
    queryKey: ['credit-notes', filterOptions],
    queryFn: async () => {
      const response = await http.get('/api/credit-notes', {
        params: {
          supplier: filterOptions.supplier,
          from: filterOptions.from,
          to: filterOptions.to
        }
      })
      const processedData = processData(response.data.data)
      return processedData
    },
    enabled: Boolean(
      (filterOptions.from && filterOptions.to) || filterOptions.supplier
    )
  })

  const mergedData = useMemo(
    () =>
      [...deliveries, ...creditNotes].sort((a, b) => {
        const dateA = a.deliveryDate || a.createdAt
        const dateB = b.deliveryDate || b.createdAt
        return dayjs(dateA).isAfter(dayjs(dateB)) ? -1 : 1
      }),
    [deliveries, creditNotes]
  )

  const rows = useMemo(
    () =>
      mergedData.map((item) => {
        return (
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
                    (selected) => selected.id === item.id
                  )}
                  onChange={(event) =>
                    setSelectedRows(
                      event.currentTarget.checked
                        ? [...selectedRows, item]
                        : selectedRows.filter(
                            (selected) => selected.id !== item.id
                          )
                    )
                  }
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
        )
      }),
    [mergedData, selectedRows]
  )

  return (
    <Box>
      <Group>
        <Select
          required
          label="Fournisseur"
          data={suppliersMemo}
          disabled={fetchingSuppliers}
        />
        <DatePickerInput
          allowSingleDateInRange
          valueFormat="DD/MM/YYYY"
          type="range"
          label="Sélectionner Période Date"
          value={[filterOptions.from, filterOptions.to]}
          onChange={(value) => {
            setFilterOptions((prev) => ({
              ...prev,
              from: value[0],
              to: value[1]
            }))
          }}
          clearable
        />
      </Group>

      <Grid my="md">
        <Grid.Col span={8}>
          <Title order={4} td="underline" mb="sm">
            Les Bon Livraisons et Les Avoirs
          </Title>
          <ScrollArea h={550} type="never" mb="md">
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
        </Grid.Col>
        <Grid.Col span={4}>BILL UI</Grid.Col>
      </Grid>
    </Box>
  )
}
