import { useState } from 'react'
import dayjs from 'dayjs'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Group,
  ScrollArea,
  Text,
  Paper,
  Table,
  Badge,
  InputBase,
  Flex,
  Loader,
  rem
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconShoppingCartPlus } from '@tabler/icons-react'
import { useDebouncedState, useElementSize } from '@mantine/hooks'
import { http } from '@renderer/utils/http'

export const Route = createFileRoute('/_portal/sales')({
  component: SaleData
})

function SaleData() {
  const { ref, height } = useElementSize()
  const [value, setValue] = useState<[Date | null, Date | null]>([
    dayjs().subtract(1, 'week').toDate(),
    dayjs().toDate()
  ])
  const [saleNumber, setSaleNumber] = useDebouncedState('', 500)

  const {
    error,
    data: sales = [],
    isLoading,
    isFetching
  } = useQuery({
    queryKey: [
      'sales',
      {
        form: value[0],
        to: value[1],
        saleNumber
      }
    ],
    queryFn: () =>
      http
        .get('/api/sales', {
          params: {
            form: value[0],
            to: value[1],
            saleNumber
          }
        })
        .then((res) => res.data),
    enabled: Boolean((value[0] && value[1]) || saleNumber)
  })

  if (error) return 'An error has occurred'

  return (
    <Paper
      withBorder
      px="md"
      py="xs"
      radius="md"
      h="calc(100vh - 1.5rem)"
      ref={ref}
    >
      <Group mb="md" align="center">
        <DatePickerInput
          w="190px"
          allowSingleDateInRange
          valueFormat="DD/MM/YYYY"
          type="range"
          label="Sélectionner Période"
          value={value}
          onChange={setValue}
        />
        <InputBase
          defaultValue={saleNumber}
          onChange={(e) => setSaleNumber(e.currentTarget.value)}
          label="N° Vente"
        />
        {isLoading && <Loader size="sm" mt="lg" />}
      </Group>
      <ScrollArea h={height - 60}>
        <Table
          stickyHeader
          verticalSpacing="sm"
          horizontalSpacing="sm"
          style={{ whiteSpace: 'nowrap' }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date et Heur</Table.Th>
              <Table.Th>N° Vente</Table.Th>
              <Table.Th>Réglementation</Table.Th>
              <Table.Th>Nom Produit</Table.Th>
              <Table.Th>Qté Stock</Table.Th>
              <Table.Th>Qté Vente</Table.Th>
              <Table.Th>Qté Avant</Table.Th>
              <Table.Th>P.P.V</Table.Th>
              <Table.Th>Client</Table.Th>
              <Table.Th>Utilisateur</Table.Th>
              <Table.Th>P.P.M ORIGINE</Table.Th>
              <Table.Th>Type</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {!isFetching ? (
              sales.length > 0 ? (
                sales.map((sale) =>
                  sale.saleMedications.map((saleMedication, index) => {
                    const inventoryHistory =
                      sale.inventoryHistories[index] || {}
                    const dateTime = new Date(saleMedication.createdAt)
                    const date = dateTime.toLocaleDateString()
                    const time = dateTime.toLocaleTimeString()
                    return (
                      <Table.Tr key={`${sale.id}-${saleMedication.id}`}>
                        <Table.Td>
                          {date} à {time}
                        </Table.Td>
                        <Table.Td>{sale.saleNumber}</Table.Td>
                        <Table.Td>
                          {(sale.paymentType === 'Cash' && 'Espèce') || (
                            <Badge color="red">N/A</Badge>
                          )}
                        </Table.Td>
                        <Table.Td>
                          {saleMedication.inventory.medication.name}
                        </Table.Td>
                        <Table.Td>
                          {saleMedication.inventory.boxQuantity}
                        </Table.Td>
                        <Table.Td>{saleMedication.quantity}</Table.Td>
                        <Table.Td>
                          {saleMedication.saleType === 'Box'
                            ? inventoryHistory.previousBoxQuantity
                            : inventoryHistory.previousUnitQuantity}
                        </Table.Td>
                        <Table.Td>{saleMedication.inventory.ppv}</Table.Td>
                        <Table.Td>{sale.user.fullName}</Table.Td>
                        <Table.Td>{sale.user.fullName}</Table.Td>
                        <Table.Td>{saleMedication.inventory.pph}</Table.Td>
                        <Table.Td>
                          {saleMedication.saleType === 'Box' ? (
                            'Box'
                          ) : (
                            <Badge>N/A</Badge>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    )
                  })
                )
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={12}>
                    <Flex
                      h="100%"
                      justify="center"
                      align="center"
                      mih="50vh"
                      direction="column"
                    >
                      <IconShoppingCartPlus
                        style={{
                          width: rem(80),
                          height: rem(80),
                          textAlign: 'center'
                        }}
                        stroke={1.5}
                        color="var(--mantine-color-gray-9)"
                      />
                      <Text fw="bold">Aucune donnée</Text>
                    </Flex>
                  </Table.Td>
                </Table.Tr>
              )
            ) : (
              <Table.Tr>
                <Table.Td colSpan={12}>
                  <Flex h="100%" justify="center" align="center" mih="50vh">
                    <Loader type="bars" />
                  </Flex>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  )
}
