import {
  Container,
  Fieldset,
  Group,
  TextInput,
  Textarea,
  Radio,
  InputBase,
  Stack,
  Checkbox,
  Table,
  Tabs,
  NativeSelect
} from '@mantine/core'
import { createFileRoute, useSearch } from '@tanstack/react-router'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { IconBarcode, IconCategory } from '@tabler/icons-react'
import SearchMedicament from '@renderer/components/Medicaments/SearchMedicament'
import { useMedications } from './credit-notes.new'
import { useDebouncedState } from '@mantine/hooks'

export const Route = createFileRoute('/_portal/medicaments/consultation')({
  component: MedicationConsultationPage
})

const DEFAULT_VALUE = {
  id: 0,
  name: '',
  dosage: '',
  barcode: '',
  dci: [],
  form: '',
  family: '',
  type: '',
  laboratory: '',
  pfhtNotActive: 0,
  pfhtActive: 0,
  pamp: 0,
  ppv: 0,
  pph: 0,
  pbr: 0,
  tva: 0,
  marge: 0,
  discountRate: 0,
  reimbursementRate: 0,
  status: '',
  orderSystem: '',
  quantity: 0,
  minQuantity: 0,
  maxQuantity: 0,
  usedBy: [],
  withPrescription: false,
  section: '',
  inventories: []
}
type TMedicament = typeof DEFAULT_VALUE

function MedicationConsultationPage() {
  return <StockDetail />
}

export const useMedication = (id) => {
  return useQuery<TMedicament>({
    queryKey: ['medicamentDetail', id],
    queryFn: async () => {
      return (await http.get(`/api/medicaments/${id}`)).data
    },
    initialData: DEFAULT_VALUE,
    enabled: id ? true : false
  })
}

function StockDetail() {
  const searchParams = useSearch({ strict: false }) as { medicationId: number }

  const [medicamentId, setMedicamentId] = useState(searchParams.medicationId)
  const [search, setSearch] = useState('')

  const { data: medication } = useMedication(
    searchParams.medicationId || medicamentId
  )

  const totalQuantity = useMemo(
    () =>
      medication?.inventories?.reduce(
        (acc, item: any) => acc + item.quantity,
        0
      ),
    [medication]
  )

  return (
    <>
      <Group grow mb="xl">
        <SearchMedicament
          medicationName={medicamentId ? medication?.name : ''}
          label="Nom de produit"
          setValue={setMedicamentId}
          search={search}
          readOnly={!!searchParams.medicationId}
          setSearch={setSearch}
        />
        <TextInput
          label="Code Bar"
          leftSection={<IconBarcode />}
          readOnly
          defaultValue={medication.barcode}
        />
        <TextInput
          label="Form"
          leftSection={<IconCategory />}
          readOnly
          defaultValue={medication.form}
        />
      </Group>
      <Group grow align="start">
        <Stack>
          <Fieldset legend="Basic information">
            <Group grow mb="lg">
              <InputBase
                label="Medicament Name"
                readOnly
                defaultValue={medication.name}
              />
              <InputBase
                label="Section"
                readOnly
                defaultValue={medication.section}
              />
            </Group>
            <Group>
              <InputBase
                flex="1"
                label="Tax Nature"
                readOnly
                defaultValue={medication.type}
              />
              <InputBase
                w="100px"
                label="TVA"
                readOnly
                defaultValue={medication.tva}
              />
              <InputBase
                w="100px"
                label="Marge"
                readOnly
                defaultValue={medication.marge}
              />
            </Group>
          </Fieldset>
          <Fieldset legend="Supplier Purchases and Labor Cost plus Third-Party Payments">
            <Group mb="lg">
              <InputBase
                w="150px"
                label="Laboratory"
                readOnly
                defaultValue={medication.laboratory}
              />
              <InputBase
                w="150px"
                label="Supplier"
                readOnly
                defaultValue={medication.laboratory}
              />
              <InputBase
                flex="1"
                label="Order System:"
                readOnly
                defaultValue={medication.orderSystem}
              />
            </Group>
            <Group grow>
              <InputBase
                label="Reimbursement Rate (%)"
                readOnly
                defaultValue={medication.reimbursementRate}
              />
              <InputBase
                label="PFHT Active:"
                readOnly
                defaultValue={medication.pfhtActive}
              />
              <InputBase
                label="PFHT Not Active:"
                readOnly
                defaultValue={medication.pfhtNotActive}
              />
            </Group>
          </Fieldset>
          <Fieldset legend="DCI or Care Components and Miscellaneous (Retail Product)">
            <Group grow mb="lg">
              <Checkbox.Group
                readOnly
                label="Used by"
                value={['Child', 'Adult']}
              >
                <Group mt="xs">
                  <Checkbox value="Infant" label="Infant" />
                  <Checkbox value="Child" label="Child" />
                  <Checkbox value="Adult" label="Adult" />
                </Group>
              </Checkbox.Group>
              <Radio.Group
                name="WithPrescription"
                readOnly
                label="With Prescription"
                value={medication.withPrescription.toString()}
              >
                <Group mt="xs">
                  <Radio value="true" label="Yes" />
                  <Radio value="false" label="No" />
                </Group>
              </Radio.Group>
            </Group>
            <Group grow mb="lg">
              <InputBase label="DCI" readOnly defaultValue={medication.dci} />
              <InputBase
                label="Family"
                readOnly
                defaultValue={medication.family}
              />
            </Group>
          </Fieldset>
        </Stack>
        <Stack>
          {/* <h4>Render Total Quantity & Total Quantity Last month</h4> */}
          <Group grow>
            <InputBase
              label="Quantité totale disponible"
              readOnly
              value={totalQuantity}
            />
            <InputBase
              label="Medicament Name"
              readOnly
              defaultValue={medication.name}
            />
          </Group>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Td>Quantité Stock</Table.Td>
                <Table.Td>PPV</Table.Td>
                <Table.Td>PPH</Table.Td>
                <Table.Td>Péremption</Table.Td>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {medication.inventories.map((item: any) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.quantity}</Table.Td>
                  <Table.Td>{item.ppv}</Table.Td>
                  <Table.Td>{item.pph}</Table.Td>
                  <Table.Td>
                    {new Date(item.expirationDate).toLocaleDateString()}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Textarea label="Dosage" readOnly defaultValue={medication.dosage} />
        </Stack>
      </Group>
    </>
  )
}
