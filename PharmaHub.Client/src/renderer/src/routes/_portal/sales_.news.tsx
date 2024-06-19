import { useDebouncedState, useResizeObserver } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { useMedications } from './credit-notes.new'
import {
  Box,
  TextInput,
  NativeSelect,
  rem,
  ScrollArea,
  ActionIcon,
  Table,
  SimpleGrid,
  Grid,
  Divider,
  Button,
  Flex,
  InputBase,
  Group,
  Paper,
  Text,
  NumberInput
} from '@mantine/core'
import {
  IconCalendar,
  IconClock,
  IconPlus,
  IconTrash
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'

export const Route = createFileRoute('/_portal/sales/news')({
  component: SaleNewsPage
})

function SaleNewsPage() {
  const [ref, { height }] = useResizeObserver()
  const [searchFieldName, setSearchFieldName] = useState('name')
  const [searchValue, setSearchValue] = useDebouncedState('', 1000)
  const [selectedMedicationRow, setSelectedMedicationRow] = useState(null)

  const [selectedSaleItems, setSelectedSaleItems] = useState<any>([])

  const { data = [] } = useMedications({
    searchValue,
    searchFieldName
  })

  const handleRowClick = (inventoryId) => {
    if (selectedMedicationRow === inventoryId) setSelectedMedicationRow(null)
    else setSelectedMedicationRow(inventoryId)
  }

  const isAdded = (key) => {
    return selectedSaleItems.some((item) => item.inventory.id === key)
  }

  const removeItem = (key) => {
    setSelectedSaleItems((prev) =>
      prev.filter((item) => item.inventory.id !== key)
    )
  }
  return (
    <Box h="100%" ref={ref}>
      <Grid>
        <Grid.Col span={7}>
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
          <Divider my="md" />
          <ScrollArea h={height - 212}>
            <Table verticalSpacing="lg">
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
                    <Table.Tr
                      key={inventory.id}
                      // onClick={(e) => handleRowClick(inventory.id)}
                      style={{
                        backgroundColor:
                          selectedMedicationRow === inventory.id
                            ? 'rgba(0, 123, 255, 0.1)'
                            : 'transparent'
                      }}
                    >
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
                          onClick={(e) => {
                            // e.stopPropagation()
                            // if (!isAdded(inventory.id)) {
                            setSelectedSaleItems((prev) => [
                              ...prev,
                              { medication, inventory }
                            ])
                            // }
                          }}
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
          <SimpleGrid
            cols={{ base: 1, sm: 4 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
          >
            <Button fullWidth>Equivalents</Button>
            <Button fullWidth>Fiche Produit</Button>
            <Button fullWidth>D.C.I Famille Thérap.</Button>
            <Button fullWidth>Reprendre Vente</Button>
            <Button fullWidth>Suspendre Vente</Button>
            <Button fullWidth>Retour Client</Button>
            <Button fullWidth color="red">
              Annuler Vente
            </Button>
          </SimpleGrid>
        </Grid.Col>
        <Grid.Col span={5}>
          {/* <Text>
            Liste des produits sélectionnés: {selectedSaleItems.length}
          </Text> */}
          <Group mb="md" grow>
            <InputBase label="TOTAL VENTE" readOnly />
            <InputBase label="DONT REMISE" readOnly />
          </Group>

          <Group
            wrap="nowrap"
            gap={10}
            mt={5}
            align="center"
            justify="space-between"
          >
            <Text fw="bold">
              Produit: {selectedSaleItems.length} | N° Vente: 55
            </Text>
            <Group wrap="nowrap" gap={10} mt={5}>
              <IconCalendar stroke={1.5} size="1.5rem" />
              <Text fz="sm">{dayjs().format('DD-MM-YYYY')}</Text>
              <IconClock stroke={1.5} size="1.5rem" />
              <Text fz="sm"> {dayjs().format('HH:mm')}</Text>
            </Group>
          </Group>
          <Group my="md" grow>
            <Button fullWidth>Valider Vente Espèce</Button>
            <Button fullWidth>Valider CNSS/CNOPS</Button>
            <Button fullWidth color="yellow">
              Suspendre Vente
            </Button>
          </Group>
          <ScrollArea my="md" h={height - 212}>
            {selectedSaleItems.map((saleItem) => (
              <Paper
                withBorder
                px="sm"
                py="xs"
                mb="md"
                key={saleItem.inventory.id}
              >
                <Group justify="space-between" mb="sm">
                  <div>{saleItem.medication.name}</div>
                  <ActionIcon
                    color="red"
                    variant="light"
                    size="sm"
                    onClick={() => removeItem(saleItem.inventory.id)}
                  >
                    <IconTrash stroke={1.5} size="1.5rem" />
                  </ActionIcon>
                </Group>
                <Group justify="space-between">
                  <Group>
                    <InputBase
                      w="50px"
                      readOnly
                      defaultValue={saleItem.inventory.ppv}
                      label="Ppv"
                    />
                    <InputBase
                      w="60px"
                      readOnly
                      defaultValue={saleItem.inventory.ppv}
                      label="Brut Ppv"
                    />
                    <InputBase
                      w="60px"
                      readOnly
                      defaultValue={saleItem.inventory.ppv}
                      label="Net Ppv"
                    />
                  </Group>
                  <Group>
                    <NumberInput
                      w="60px"
                      min={0}
                      defaultValue={1}
                      label="Quantité"
                    />
                    <NumberInput
                      w="60px"
                      min={0}
                      max={100}
                      defaultValue={0}
                      label="Remise"
                    />
                  </Group>
                </Group>
              </Paper>
            ))}
          </ScrollArea>
        </Grid.Col>
      </Grid>
    </Box>
  )
}

SaleNewsPage.displayName = 'SaleNewsPage'
