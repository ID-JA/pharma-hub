import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMedications } from './credit-notes.new'
import {
  ActionIcon,
  Container,
  Group,
  NativeSelect,
  Table,
  TextInput,
  rem
} from '@mantine/core'
import { IconEye, IconPencil, IconTrashX } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useDebouncedState } from '@mantine/hooks'
import { useState } from 'react'

export const Route = createFileRoute('/_portal/medications')({
  component: MedicationsListPage
})

function MedicationsListPage() {
  const [searchFieldName, setSearchFieldName] = useState('name')
  const [searchValue, setSearchValue] = useDebouncedState('', 1000)
  const { data: medications = [] } = useMedications({
    searchValue,
    searchFieldName
  })

  const navigate = useNavigate()
  return (
    <Container
      size="1500px"
      bg="white"
      py="md"
      style={{ borderRadius: '10px' }}
    >
      <TextInput
        w="400px"
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
      <Table mt="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nom</Table.Th>
            <Table.Th>PPV</Table.Th>
            <Table.Th>Quantité Stock</Table.Th>
            <Table.Th>Péremption</Table.Th>
            <Table.Th>Rayon</Table.Th>
            <Table.Th>Code Barre</Table.Th>
            <Table.Th ta="center">Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {medications.map((medication) => {
            return medication.inventories.map((inventory) => (
              <Table.Tr key={inventory.id}>
                <Table.Td>{medication.name}</Table.Td>
                <Table.Td>{inventory.ppv}</Table.Td>
                <Table.Td>{inventory.quantity}</Table.Td>
                <Table.Td>
                  {dayjs(inventory.expirationDate).format('DD/MM/YYYY')}
                </Table.Td>
                <Table.Td>{medication.section}</Table.Td>
                <Table.Td>{medication.barcode}</Table.Td>

                <Table.Td ta="center">
                  <Group justify="center">
                    <ActionIcon
                      size="sm"
                      onClick={() => {
                        navigate({
                          to: `/medications/edit/$medicationId`,
                          params: { medicationId: medication.id }
                        })
                      }}
                    >
                      <IconPencil stroke={1.5} size="1.2rem" />
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      onClick={() => {
                        navigate({
                          to: '/medicaments/consultation',
                          search: {
                            medicationId: medication.id
                          }
                        })
                      }}
                    >
                      <IconEye stroke={1.5} size="1.2rem" />
                    </ActionIcon>
                    <ActionIcon color="red" size="sm">
                      <IconTrashX stroke={1.5} size="1.2rem" />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          })}
        </Table.Tbody>
      </Table>
    </Container>
  )
}

export default MedicationsListPage
