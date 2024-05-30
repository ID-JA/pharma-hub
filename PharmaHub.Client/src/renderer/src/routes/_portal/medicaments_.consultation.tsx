import {
  Container,
  Fieldset,
  Group,
  TextInput,
  Textarea,
  Radio,
  InputBase,
  Stack,
  Checkbox
} from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { IconBarcode, IconCategory } from '@tabler/icons-react'
import SearchMedicament from '@renderer/components/Medicaments/SearchMedicament'

export const Route = createFileRoute('/_portal/medicaments/consultation')({
  component: StockDetail
})

const DEFAULT_VALUE = {
  id: 0,
  name: '',
  dosage: '',
  barcode: '',
  dci: '',
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
  usedBy: 0,
  withPrescription: false,
  section: ''
}
type TMedicament = typeof DEFAULT_VALUE
function StockDetail() {
  const [medicamentId, setMedicamentId] = useState(null)
  const { data } = useQuery<TMedicament>({
    queryKey: ['medicamentDetail', medicamentId],
    queryFn: async () => {
      return (await http.get(`/api/medicaments/${medicamentId}`)).data
    },
    initialData: DEFAULT_VALUE,
    enabled: medicamentId ? true : false
  })

  return (
    <Container size="xl">
      <Group grow mb="xl">
        <SearchMedicament setValue={setMedicamentId} />
        <TextInput
          label="Code Bar"
          leftSection={<IconBarcode />}
          readOnly
          defaultValue={data.barcode}
        />
        <TextInput
          label="Form"
          leftSection={<IconCategory />}
          readOnly
          defaultValue={data.form}
        />
      </Group>
      <Group grow align="start">
        <Stack>
          <Fieldset legend="Basic information">
            <Group grow mb="lg">
              <InputBase
                label="Medicament Name"
                readOnly
                defaultValue={data.name}
              />
              <InputBase label="Section" readOnly defaultValue={data.section} />
            </Group>
            <Group>
              <InputBase
                flex="1"
                label="Tax Nature"
                readOnly
                defaultValue={data.type}
              />
              <InputBase
                w="100px"
                label="TVA"
                readOnly
                defaultValue={data.tva}
              />
              <InputBase
                w="100px"
                label="Marge"
                readOnly
                defaultValue={data.marge}
              />
            </Group>
          </Fieldset>
          <Fieldset legend="Supplier Purchases and Labor Cost plus Third-Party Payments">
            <Group mb="lg">
              <InputBase
                w="150px"
                label="Laboratory"
                readOnly
                defaultValue={data.laboratory}
              />
              <InputBase
                w="150px"
                label="Supplier"
                readOnly
                defaultValue={data.laboratory}
              />
              <InputBase
                flex="1"
                label="Order System:"
                readOnly
                defaultValue={data.orderSystem}
              />
            </Group>
            <Group grow>
              <InputBase
                label="Reimbursement Rate (%)"
                readOnly
                defaultValue={data.reimbursementRate}
              />
              <InputBase
                label="PFHT Active:"
                readOnly
                defaultValue={data.pfhtActive}
              />
              <InputBase
                label="PFHT Not Active:"
                readOnly
                defaultValue={data.pfhtNotActive}
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
                value={data.withPrescription.toString()}
              >
                <Group mt="xs">
                  <Radio value="true" label="Yes" />
                  <Radio value="false" label="No" />
                </Group>
              </Radio.Group>
            </Group>
            <Group grow mb="lg">
              <InputBase label="DCI" readOnly defaultValue={data.dci} />
              <InputBase label="Family" readOnly defaultValue={data.family} />
            </Group>
          </Fieldset>
        </Stack>
        <Stack>
          <h4>Render Total Quantity & Total Quantity Last month</h4>
          <h4>Render Medicament Inventories</h4>
          <Textarea label="Dosage" readOnly defaultValue={data.dosage} />
        </Stack>
      </Group>
    </Container>
  )
}
