import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Input,
  InputBase,
  NativeSelect,
  NumberInput,
  ScrollArea,
  Select,
  Table,
  Tabs,
  TextInput,
  rem
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useDebouncedState } from '@mantine/hooks'
// import SearchField from '@renderer/components/SearchField'
import { useMedicaments } from '@renderer/services/medicaments.service'
import { userSuppliers } from '@renderer/services/suppliers.service'
import { http } from '@renderer/utils/http'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/_portal/credit-notes/new')({
  component: CreateCreditNotePage
})
const dummy = [
  {
    id: 1,
    name: 1,
    items: [
      {
        itemId: '1-1',
        name: '1-1'
      },
      {
        itemId: '1-2',
        name: '1-2'
      }
    ]
  },
  {
    id: 2,
    name: 2,
    items: [
      {
        itemId: '2-1',
        name: '2-1'
      },
      {
        itemId: '2-2',
        name: '2-2'
      }
    ]
  }
]

function CreateCreditNotePage() {
  const [searchFieldName, setSearchFieldName] = useState('name')
  const [searchValue, setSearchValue] = useDebouncedState('', 1000)
  const [selectedInventories, setSelectedInventories] = useState<any[]>([])

  const { data = [] } = useQuery({
    queryKey: [
      'medications',
      {
        searchValue,
        searchField: searchFieldName
      }
    ],
    queryFn: async () => {
      const res = await http.get('/api/medicaments/search', {
        params: {
          field: searchFieldName,
          query: searchValue
        }
      })
      return res.data.data
    }
  })

  const { data: suppliers = [] } = userSuppliers()

  const suppliersMemo = useMemo(() => {
    return suppliers.map((s) => ({ value: s.id.toString(), label: s.name }))
  }, [suppliers])

  const handleAddInventory = ({ medication, inventory }) => {
    if (selectedInventories.find((i) => i.inventoryId === inventory.id)) return
    setSelectedInventories((prev) => [
      ...prev,
      {
        inventoryId: inventory.id,
        quantityIssued: 0,
        name: medication.name,
        barcode: medication.barcode,
        id: inventory.id,
        ppv: inventory.ppv,
        pph: inventory.pph,
        quantity: inventory.quantity,
        expirationDate: inventory.expirationDate
      }
    ])
  }

  const handleRemoveInventory = (inventoryId) => {
    setSelectedInventories((prev) =>
      prev.filter((i) => i.inventoryId !== inventoryId)
    )
  }
  return (
    <div>
      <Tabs defaultValue="create">
        <Tabs.List>
          <Tabs.Tab value="create">Emission Avoir</Tabs.Tab>
          <Tabs.Tab value="view">Consultation Avoirs</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="create">
          <Box my="lg">
            <TextInput
              w="300px"
              label="Recherche Produits"
              defaultValue={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              rightSection={
                <NativeSelect
                  value={searchFieldName}
                  onChange={(e) => setSearchFieldName(e.currentTarget.value)}
                  data={[
                    { value: 'name', label: 'Nom' },
                    { value: 'barcode', label: 'Barcode' },
                    { value: 'type', label: 'Type' },
                    { value: 'ppv', label: 'PPV' }
                  ]}
                  rightSectionWidth={28}
                  styles={{
                    input: {
                      fontWeight: 500,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      width: rem(95),
                      marginRight: rem(-2)
                    }
                  }}
                />
              }
              rightSectionWidth={95}
            />
          </Box>
          <div>
            <ScrollArea h={200}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nom</Table.Th>
                    <Table.Th>Barcode</Table.Th>
                    <Table.Th>PPV</Table.Th>
                    <Table.Th>Quantité</Table.Th>
                    <Table.Th>Péremption</Table.Th>
                    <Table.Th ta="center">Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.map((medication) => {
                    return medication.inventories.map((inventory) => (
                      <Table.Tr key={inventory.id}>
                        <Table.Td>{medication.name}</Table.Td>
                        <Table.Td>{medication.barcode}</Table.Td>
                        <Table.Td>{inventory.ppv}</Table.Td>
                        <Table.Td>{inventory.quantity}</Table.Td>
                        <Table.Td>
                          {new Date(
                            inventory.expirationDate
                          ).toLocaleDateString()}
                        </Table.Td>
                        <Table.Td ta="center">
                          <ActionIcon
                            size="sm"
                            onClick={() =>
                              handleAddInventory({ medication, inventory })
                            }
                          >
                            <IconPlus />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  })}
                </Table.Tbody>
              </Table>
            </ScrollArea>
            <Divider my="xl" />
            <Group mb="lg">
              <Select label="Fournisseur" data={suppliersMemo} />
              <DateInput
                defaultValue={new Date()}
                label="Date émission"
                readOnly
              />
            </Group>
            <div>
              <ScrollArea h={200}>
                <Table
                  style={{
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Nom</Table.Th>
                      <Table.Th>Barcode</Table.Th>
                      <Table.Th>PPV</Table.Th>
                      <Table.Th>Quantité</Table.Th>
                      <Table.Th>Total PPV</Table.Th>
                      <Table.Th>Total PPH</Table.Th>
                      <Table.Th>Péremption</Table.Th>
                      <Table.Th>Motif</Table.Th>
                      <Table.Th ta="center">Action</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {selectedInventories.map((inventory: any) => {
                      return (
                        <Table.Tr key={inventory.id}>
                          <Table.Td>{inventory.name}</Table.Td>
                          <Table.Td>{inventory.barcode}</Table.Td>
                          <Table.Td>{inventory.ppv}</Table.Td>
                          <Table.Td>
                            <NumberInput />
                          </Table.Td>
                          <Table.Td>
                            <NumberInput />
                          </Table.Td>
                          <Table.Td>
                            <NumberInput />
                          </Table.Td>
                          <Table.Td>
                            {new Date(
                              inventory.expirationDate
                            ).toLocaleDateString()}
                          </Table.Td>
                          <Table.Td>
                            <Input w="250px" />
                          </Table.Td>

                          <Table.Td
                            ta="center"
                            onClick={() => {
                              handleRemoveInventory(inventory.id)
                            }}
                          >
                            <ActionIcon variant="light" color="red" size="sm">
                              <IconTrash />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      )
                    })}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </div>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="view">Consultation Avoirs</Tabs.Panel>
      </Tabs>
    </div>
  )
}
