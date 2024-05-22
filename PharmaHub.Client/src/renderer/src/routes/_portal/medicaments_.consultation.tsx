import { Container, Fieldset, Text, Group, TextInput } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { IconBarcode, IconCategory } from '@tabler/icons-react'
import SearchMedicament from '@renderer/components/Medicaments/SearchMedicament'

export const Route = createFileRoute('/_portal/medicaments/consultation')({
  component: StockDetail
})

function StockDetail() {
  const [medicament, setMedicament] = useState<any>(null)
  const query = useQuery({
    queryKey: ['medicamentDetail', medicament?.id],
    queryFn: async () => {
      return (await http.get(`/api/medicaments/${medicament?.id}`)).data
    },
    enabled: medicament ? true : false
  })

  return (
    <Container>
      {JSON.stringify(query.data)}
      {JSON.stringify(medicament)}
      <Group grow mb="xl">
        <SearchMedicament setValue={setMedicament} />
        <TextInput label="Code Bar" leftSection={<IconBarcode />} readOnly />
        <TextInput label="Type" leftSection={<IconCategory />} readOnly />
      </Group>
      <Fieldset legend="Basic information">
        <div>
          <Text size="xs" c="dimmed">
            Medicament Name:
          </Text>
          <Text>HELLLOS AKD</Text>
        </div>
      </Fieldset>
      <Fieldset legend="Supplier Purchases and Labor Cost plus Third-Party Payments"></Fieldset>
      <Fieldset legend="DCI or Care Components and Miscellaneous (Retail Product)"></Fieldset>
    </Container>
  )
}
