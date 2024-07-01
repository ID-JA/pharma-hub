import { useState } from 'react'
import dayjs from 'dayjs'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
  rem,
  ActionIcon,
  Select
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import {
  IconChevronDown,
  IconChevronRight,
  IconPlayerPlay,
  IconShoppingCartPlus,
  IconTrash
} from '@tabler/icons-react'
import { useDebouncedState, useElementSize } from '@mantine/hooks'
import { http } from '@renderer/utils/http'
import { modals } from '@mantine/modals'
import { z } from 'zod'

const saleSearchSchema = z.object({
  status: z.string().optional()
})

export const Route = createFileRoute('/_portal/sales')({
  validateSearch: saleSearchSchema,
  component: SaleData
})

function SaleData() {
  const searchParams = Route.useSearch()
  const { ref, height } = useElementSize()
  const [value, setValue] = useState<[Date | null, Date | null]>([
    dayjs().subtract(1, 'week').toDate(),
    dayjs().toDate()
  ])
  const [saleNumber, setSaleNumber] = useDebouncedState('', 500)
  const [status, setStatus] = useState(searchParams.status || '')

  const {
    error,
    data: sales = [],
    isLoading,
    isFetching
  } = useQuery({
    queryKey: [
      'sales',
      {
        from: value[0],
        to: value[1],
        saleNumber,
        status
      }
    ],
    queryFn: () =>
      http
        .get('/api/sales', {
          params: {
            from: value[0],
            to: value[1],
            saleNumber,
            status
          }
        })
        .then((res) => res.data),
    enabled: Boolean((value[0] && value[1]) || saleNumber)
  })

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
        <Select
          value={status}
          data={[
            {
              label: 'en attente',
              value: 'Pending'
            },
            {
              label: 'hors stock',
              value: 'OutOfStock'
            },
            {
              label: 'payé',
              value: 'Paid'
            }
          ]}
          onChange={(value) => setStatus(value || '')}
          label="Status"
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
              <Table.Th>Date et Heure</Table.Th>
              <Table.Th>N° Vente</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Réglementation</Table.Th>
              <Table.Th>Quantité Total</Table.Th>
              <Table.Th>Prix NET</Table.Th>
              <Table.Th>Prix BRUT</Table.Th>
              <Table.Th>Dont Remise</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {!isFetching ? (
              sales.length > 0 ? (
                sales.map((sale) => <Row row={sale} key={sale.id} />)
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

function Row({ row }) {
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState(false)
  const dateTime = new Date(row.createdAt)
  const date = dateTime.toLocaleDateString()
  const time = dateTime.toLocaleTimeString()

  const { mutateAsync } = useMutation({
    mutationFn: async (saleId) => {
      await http.delete(`/api/sales/cancel`, {
        params: {
          saleId
        }
      })
    }
  })

  const handleRemoveSale = () => {
    modals.openConfirmModal({
      title: 'Suppression de la vente',
      children: <Text>Êtes-vous sur de vouloir supprimer la vente?</Text>,
      labels: { confirm: 'Oui', cancel: 'Non' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await mutateAsync(row.id, {
          onSuccess: () => {
            modals.closeAll()
            queryClient.invalidateQueries({
              queryKey: ['sales']
            })
          }
        })
      }
    })
  }
  return (
    <>
      <Table.Tr bg={expanded ? 'var(--mantine-color-blue-light)' : 'white'}>
        <Table.Td>
          <Group align="center">
            <ActionIcon
              variant="default"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <IconChevronDown size={18} />
              ) : (
                <IconChevronRight size={18} />
              )}
            </ActionIcon>
            <Text>
              {date} à {time}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{row.saleNumber}</Table.Td>
        <Table.Td>
          <Badge
            color={
              row.status === 'Return'
                ? 'red'
                : row.status === 'OutOfStock'
                  ? 'yellow'
                  : row.status === 'Pending'
                    ? 'orange'
                    : 'green'
            }
          >
            {row.status || 'N/A'}
          </Badge>
        </Table.Td>
        <Table.Td>
          {(row.paymentType === 'Cash' && 'Espèce') || (
            <Badge color="red">N/A</Badge>
          )}
        </Table.Td>
        <Table.Td>{row.totalQuantities}</Table.Td>
        <Table.Td>{row.totalBrutPrices}</Table.Td>
        <Table.Td>{row.totalNetPrices}</Table.Td>
        <Table.Td>{row.discountedAmount}</Table.Td>
        <Table.Td>
          {row.status === 'Pending' && (
            <ActionIcon onClick={handleRemoveSale} mr="md">
              <IconPlayerPlay size="1.5rem" stroke={1.2} />
            </ActionIcon>
          )}
          <ActionIcon
            color="red"
            onClick={handleRemoveSale}
            disabled={Boolean(row.status === 'Return')}
          >
            <IconTrash size="1.5rem" stroke={1.2} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
      {expanded && <SaleItems saleMedications={row.saleMedications} />}
    </>
  )
}

function SaleItems({ saleMedications }) {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: async (saleItemId) => {
      await http.delete(`/api/sales/cancel`, {
        params: {
          saleItemId
        }
      })
    }
  })

  const handleRemoveSaleItem = (saleItemId) => {
    modals.openConfirmModal({
      title: 'Suppression de la vente',
      children: <Text>Êtes-vous sur de vouloir supprimer la vente?</Text>,
      labels: { confirm: 'Oui', cancel: 'Non' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await mutateAsync(saleItemId, {
          onSuccess: () => {
            modals.closeAll()
            queryClient.invalidateQueries({
              queryKey: ['sales']
            })
          }
        })
      }
    })
  }
  return (
    <Table.Tr>
      <Table.Td colSpan={9} bg="gray.1">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Produit</Table.Th>
              <Table.Th>Quantité</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Prix BRUT</Table.Th>
              <Table.Th>Prix NET</Table.Th>
              <Table.Th>Taux Remise</Table.Th>
              <Table.Th>TVA</Table.Th>
              <Table.Th>Marge</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {saleMedications.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.inventory.medication.name}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
                <Table.Td>
                  <Badge
                    color={
                      item.status === 'Return'
                        ? 'red'
                        : item.status === 'OutOfStock'
                          ? 'yellow'
                          : 'green'
                    }
                  >
                    {item.status || 'N/A'}
                  </Badge>
                </Table.Td>
                <Table.Td>{item.brutPrice}</Table.Td>
                <Table.Td>{item.netPrice}</Table.Td>
                <Table.Td>{item.discountRate}</Table.Td>
                <Table.Td>{item.inventory.medication.tva}</Table.Td>
                <Table.Td>{item.inventory.medication.marge}</Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => handleRemoveSaleItem(item.id)}
                    disabled={Boolean(item.status === 'Return')}
                  >
                    <IconTrash size="1.5rem" stroke={1.2} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.Td>
    </Table.Tr>
  )
}

export default SaleData
