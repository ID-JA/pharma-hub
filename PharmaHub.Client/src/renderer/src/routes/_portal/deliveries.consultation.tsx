import {
  ActionIcon,
  Badge,
  Box,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Select,
  Table,
  Tabs,
  Text,
  rem
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { modals } from '@mantine/modals'
import { userSuppliers } from '@renderer/services/suppliers.service'
import { http } from '@renderer/utils/http'
import {
  IconChevronDown,
  IconChevronRight,
  IconShoppingCartPlus,
  IconTrash
} from '@tabler/icons-react'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/_portal/deliveries/consultation')({
  component: DeliveriesOrdersConsultation
})

function DeliveriesOrdersConsultation() {
  const [filterOptions, setFilterOptions] = useState<any>({
    supplier: null,
    from: dayjs().subtract(1, 'month').toDate(),
    to: dayjs().toDate()
  })
  const { data: suppliers = [], isLoading: fetchingSuppliers } = userSuppliers()

  const suppliersMemo = useMemo(
    () =>
      suppliers.map((s: any) => ({
        value: s.id.toString(),
        label: s.name
      })),
    [suppliers]
  )

  const [
    { data: deliveries = [], isLoading: fetchingDeliveries },
    { data: orders = [], isLoading: fetchingOrders },
    { data: creditNotes = [], isLoading: fetchingCreditNotes }
  ] = useQueries({
    queries: [
      {
        queryKey: ['delivery-notes', filterOptions],
        queryFn: async () => {
          const response = await http.get('/api/deliveries', {
            params: {
              supplierId: filterOptions.supplier,
              from: filterOptions.from,
              to: filterOptions.to,
              status: 'pending'
            }
          })
          return response.data.data
        }
        // enabled: !!filterOptions.supplier
      },
      {
        queryKey: ['orders', filterOptions],
        queryFn: async () => {
          const response = await http.get('/api/deliveries/orders/search', {
            params: {
              supplierId: filterOptions.supplier,
              from: filterOptions.from,
              to: filterOptions.to,
              status: 'pending'
            }
          })
          return response.data.data
        }
        // enabled: !!filterOptions.supplier
      },
      {
        queryKey: ['credit-notes', filterOptions],
        queryFn: async () => {
          const response = await http.get('/api/credit-notes', {
            params: {
              supplierId: filterOptions.supplier,
              from: filterOptions.from,
              to: filterOptions.to
            }
          })
          return response.data.data
        }
        // enabled: !!filterOptions.supplier
      }
    ]
  })
  return (
    <Box p="md">
      <Group mb="lg">
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
            setFilterOptions((prev: any) => ({
              ...prev,
              from: value[0] as Date,
              to: value[1] as Date
            }))
          }}
        />{' '}
      </Group>
      <Tabs defaultValue="pending-delivery-notes">
        <Tabs.List>
          <Tabs.Tab value="pending-delivery-notes">Livraisons</Tabs.Tab>
          <Tabs.Tab value="pending-orders">Commandes</Tabs.Tab>
          <Tabs.Tab value="avoirs">Avoirs</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending-delivery-notes">
          <PendingDeliveries
            deliveries={deliveries}
            isFetching={fetchingDeliveries}
          />
        </Tabs.Panel>

        <Tabs.Panel value="pending-orders">
          <PendingOrders orders={orders} isFetching={fetchingOrders} />
        </Tabs.Panel>
        <Tabs.Panel value="avoirs">
          <CreditNotes
            creditNotes={creditNotes}
            isFetching={fetchingCreditNotes}
          />
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
}

function PendingDeliveries({ deliveries, isFetching }) {
  return (
    <ScrollArea h={700 - 60} mt="xl">
      <Table
        stickyHeader
        verticalSpacing="sm"
        horizontalSpacing="sm"
        style={{ whiteSpace: 'nowrap' }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>N° BL</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Date Livraison</Table.Th>
            <Table.Th>Total Quantité</Table.Th>
            <Table.Th>Total PPV</Table.Th>
            <Table.Th>Total PPV Gratuit</Table.Th>
            <Table.Th>Total PPH Brut</Table.Th>
            <Table.Th>Total PPH NET</Table.Th>
            <Table.Th>Dont Remise</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!isFetching ? (
            deliveries.length > 0 ? (
              deliveries.map((sale) => <Row row={sale} key={sale.id} />)
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
  )
}

function PendingOrders({ orders, isFetching }) {
  return (
    <ScrollArea h={700 - 60} mt="xl">
      <Table
        stickyHeader
        verticalSpacing="sm"
        horizontalSpacing="sm"
        style={{ whiteSpace: 'nowrap' }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Date Commande</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Fournisseur</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!isFetching ? (
            orders.length > 0 ? (
              orders.map((order) => <OrderRow row={order} key={order.id} />)
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
  )
}

function OrderRow({ row }) {
  const [expanded, setExpanded] = useState(false)
  const dateTime = new Date(row.orderDate)
  const date = dateTime.toLocaleDateString()
  const time = dateTime.toLocaleTimeString()

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
              {' '}
              {date} à {time}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Badge>{row.status}</Badge>
        </Table.Td>
        <Table.Td>{row.supplier.name}</Table.Td>
      </Table.Tr>
      {expanded && (
        <DeliveryItems deliveryItems={row.orderDeliveryInventories} />
      )}
    </>
  )
}

function Row({ row }) {
  const [expanded, setExpanded] = useState(false)
  const dateTime = new Date(row.deliveryDate)
  const date = dateTime.toLocaleDateString()
  const time = dateTime.toLocaleTimeString()

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
            <Text>{row.deliveryNumber}</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          {date} à {time}
        </Table.Td>
        <Table.Td>
          <Badge>Received</Badge>
        </Table.Td>

        <Table.Td>{row.totalQuantity}</Table.Td>
        <Table.Td>{row.totalPpv}</Table.Td>
        <Table.Td>{row.totalFreePpv}</Table.Td>
        <Table.Td>{row.totalNetPph}</Table.Td>
        <Table.Td>{row.totalBrutPph}</Table.Td>
        <Table.Td>{row.discountedAmount}</Table.Td>
      </Table.Tr>
      {expanded && (
        <DeliveryItems deliveryItems={row.orderDeliveryInventories} />
      )}
    </>
  )
}

function DeliveryItems({ deliveryItems }) {
  return (
    <Table.Tr>
      <Table.Td colSpan={9} bg="gray.1">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Produit</Table.Th>
              <Table.Th>Quantité Commandé</Table.Th>
              <Table.Th>Quantité Livrée</Table.Th>
              <Table.Th>PPH Unité</Table.Th>
              <Table.Th>Total PPH</Table.Th>
              <Table.Th>Taux Remise</Table.Th>
              <Table.Th>TVA</Table.Th>
              <Table.Th>Marge</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {deliveryItems.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.inventory.medication.name}</Table.Td>
                <Table.Td>
                  {item.orderedQuantity || item.deliveredQuantity}
                </Table.Td>
                <Table.Td>{item.deliveredQuantity}</Table.Td>
                <Table.Td>{item.purchasePriceUnit}</Table.Td>
                <Table.Td>{item.totalPurchasePrice}</Table.Td>
                <Table.Td>{item.discountRate}</Table.Td>
                <Table.Td>{item.inventory.medication.tva}</Table.Td>
                <Table.Td>{item.inventory.medication.marge}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.Td>
    </Table.Tr>
  )
}

function CreditNotes({ creditNotes, isFetching }) {
  return (
    <ScrollArea h={700 - 60} mt="xl">
      <Table
        stickyHeader
        verticalSpacing="sm"
        horizontalSpacing="sm"
        style={{ whiteSpace: 'nowrap' }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>N° Avoir</Table.Th>
            <Table.Th>Fournisseur</Table.Th>
            <Table.Th>Date Avoir</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!isFetching ? (
            creditNotes.length > 0 ? (
              creditNotes.map((creditNote) => (
                <CreditNoteRow row={creditNote} key={creditNote.id} />
              ))
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
  )
}

function CreditNoteRow({ row }) {
  const [expanded, setExpanded] = useState(false)
  const dateTime = new Date(row.createdAt)
  const date = dateTime.toLocaleDateString()
  const time = dateTime.toLocaleTimeString()

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
            <Text>{row.creditNoteNumber}</Text>
          </Group>
        </Table.Td>
        <Table.Td>{row.supplier.name}</Table.Td>
        <Table.Td>
          {date} à {time}
        </Table.Td>
      </Table.Tr>
      {expanded && (
        <CreditNoteItems creditNoteMedications={row.creditNoteMedications} />
      )}
    </>
  )
}

function CreditNoteItems({ creditNoteMedications }) {
  return (
    <Table.Tr>
      <Table.Td colSpan={9} bg="gray.1">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Produit</Table.Th>
              <Table.Th>Quantité Émise</Table.Th>
              <Table.Th>Quantité Accepté</Table.Th>
              <Table.Th>PPH Refusée</Table.Th>
              <Table.Th>Motif</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {creditNoteMedications.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.inventory.medication.name}</Table.Td>
                <Table.Td>{item.issuedQuantity}</Table.Td>
                <Table.Td>{item.acceptedQuantity}</Table.Td>
                <Table.Td>{item.refusedQuantity}</Table.Td>
                <Table.Td>{item.motif}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.Td>
    </Table.Tr>
  )
}
