import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ActionIcon,
  Container,
  Group,
  NativeSelect,
  Table,
  Tabs,
  TextInput,
  Title,
  rem
} from '@mantine/core'
import { IconEye, IconPencil, IconTrashX } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useDebouncedState } from '@mantine/hooks'
import { useState } from 'react'
import { useMedications } from '@renderer/services/medicaments.service'
import { useQuery } from '@tanstack/react-query'
import { http } from '@renderer/utils/http'
import { DatePickerInput } from '@mantine/dates'
import { z } from 'zod'

const medicationsSearchParams = z.object({
  active: z.string().optional()
})
export const Route = createFileRoute('/_portal/medications')({
  validateSearch: medicationsSearchParams,
  component: MedicationsListPage
})

function MedicationsListPage() {
  const { active } = Route.useSearch()
  return (
    <Container
      size="1500px"
      bg="white"
      py="md"
      style={{ borderRadius: '10px' }}
    >
      <Tabs defaultValue={active || 'all-medications'}>
        <Tabs.List>
          <Tabs.Tab value="all-medications">Medicaments</Tabs.Tab>
          <Tabs.Tab value="medications-not-sold">Medicaments Dormant</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="all-medications">
          <ListOfMedications />
        </Tabs.Panel>
        <Tabs.Panel value="medications-not-sold">
          <MedicationsNotSold />
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

export default MedicationsListPage

function ListOfMedications() {
  const [searchFieldName, setSearchFieldName] = useState('name')
  const [searchValue, setSearchValue] = useDebouncedState('', 1000)
  const { data: medications = [] } = useMedications({
    searchValue,
    searchFieldName
  })

  const navigate = useNavigate()
  return (
    <>
      <Title my="md" order={2}>
        Les Produits
      </Title>
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
                <Table.Td>{inventory.boxQuantity}</Table.Td>
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
    </>
  )
}

function MedicationsNotSold() {
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(7, 'days').toDate(),
    endDate: dayjs().toDate()
  })

  const { data = [] } = useQuery({
    queryKey: ['medications-not-sold', dateRange],
    queryFn: async () => {
      return (
        await http.get('/api/medicaments/not-sold', {
          params: dateRange
        })
      ).data
    }
  })

  return (
    <div>
      <Title my="md" order={2}>
        Produits Dormants
      </Title>
      <DatePickerInput
        w={200}
        type="range"
        valueFormat="DD/MM/YYYY"
        label="Depuis:"
        value={[dateRange.startDate, dateRange.endDate]}
        onChange={(value) =>
          setDateRange({
            startDate: value[0] as Date,
            endDate: value[1] as Date
          })
        }
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
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((inventory) => {
            return (
              <Table.Tr key={inventory.id}>
                <Table.Td>{inventory.medication.name}</Table.Td>
                <Table.Td>{inventory.ppv}</Table.Td>
                <Table.Td>{inventory.boxQuantity}</Table.Td>
                <Table.Td>
                  {dayjs(inventory.expirationDate).format('DD/MM/YYYY')}
                </Table.Td>
                <Table.Td>{inventory.medication.section}</Table.Td>
                <Table.Td>{inventory.medication.barcode}</Table.Td>
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    </div>
  )
}
