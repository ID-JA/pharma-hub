import { Container, Fieldset, Text, Group, TextInput, Textarea, Radio } from '@mantine/core'
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
  codebar: '',
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
    <Container>
      <Group grow mb="xl">
        <SearchMedicament setValue={setMedicamentId} />
        <TextInput
          label="Code Bar"
          leftSection={<IconBarcode />}
          readOnly
          defaultValue={data.codebar}
        />
        <TextInput label="Type" leftSection={<IconCategory />} readOnly defaultValue={data.type} />
        <TextInput
          label="Section"
          leftSection={<IconCategory />}
          readOnly
          defaultValue={data.section}
        />
      </Group>
      <Group grow align="start">
        <Fieldset legend="Basic information" mb="lg">
          <Group grow mb="lg">
            <div>
              <Text size="sm" c="dimmed">
                Medicament Name:
              </Text>
              <Text>{data.name}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Form:
              </Text>
              <Text>{data.name}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                DCI:
              </Text>
              <Text>{data.name}</Text>
            </div>
          </Group>
          <Group grow mb="lg">
            <div>
              <Text size="sm" c="dimmed">
                Type:
              </Text>
              <Text>{data.type}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                TVA:
              </Text>
              <Text>{data.tva}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Marge:
              </Text>
              <Text>{data.marge}</Text>
            </div>
          </Group>
          <Group grow mb="lg">
            <div>
              <Text size="sm" c="dimmed">
                PPV:
              </Text>
              <Text>{data.ppv}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                PBR:
              </Text>
              <Text>{data.pbr}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Discount Rate (%):
              </Text>
              <Text>{data.discountRate}</Text>
            </div>
          </Group>
        </Fieldset>
        <Textarea label="Dosage" readOnly defaultValue={data.dosage} />
      </Group>
      <Fieldset mb="lg" legend="Supplier Purchases and Labor Cost plus Third-Party Payments">
        <Group grow mb="lg">
          <div>
            <Text size="sm" c="dimmed">
              Laboratory:
            </Text>
            <Text>{data.laboratory}</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Supplier:
            </Text>
            <Text>{data.laboratory}</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Order System:
            </Text>
            <Text>{data.orderSystem}</Text>
          </div>
        </Group>
        <Group grow mb="lg">
          <div>
            <Text size="sm" c="dimmed">
              Reimbursement Rate (%):
            </Text>
            <Text>{data.reimbursementRate}</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              PFHT Active:
            </Text>
            <Text>{data.pfhtActive}</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              PFHT Not Active (%):
            </Text>
            <Text>{data.pfhtNotActive}</Text>
          </div>
        </Group>
      </Fieldset>
      <Fieldset legend="DCI or Care Components and Miscellaneous (Retail Product)">
        <Group grow mb="lg">
          <div>
            <Text size="sm" c="dimmed">
              Used by:
            </Text>
            <Radio.Group name="usedBy" readOnly>
              <Group mt="xs">
                <Radio value={1} label="Infant" />
                <Radio value={2} label="Child" />
                <Radio value={3} label="Adult" />
              </Group>
            </Radio.Group>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              With Prescription:
            </Text>
            <Radio.Group name="usedBy" readOnly>
              <Group mt="xs">
                <Radio value={2} label="Yes" />
                <Radio value={3} label="No" />
              </Group>
            </Radio.Group>
          </div>
        </Group>
        <Group grow mb="lg">
          <div>
            <Text size="sm" c="dimmed">
              DCI:
            </Text>
            <Text>{data.dci}</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Family:
            </Text>
            <Text>{data.family}</Text>
          </div>
        </Group>
      </Fieldset>
    </Container>
  )
}
