import { Container, Fieldset, Text, Group, TextInput } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { IconBarcode, IconCategory } from '@tabler/icons-react'
import SearchMedicament from '@renderer/components/Medicaments/SearchMedicament'
// todo:
// create Medicament Search input component
// Create UI with Sections (Basic information,Pricing, DCI)
export const Route = createFileRoute('/_portal/medicaments/consultation')({
  component: StockDetail
})

function StockDetail() {
  const [medicamentId, setMedicamentId] = useState<string | null>(null)
  const query = useQuery({
    queryKey: ['medicamentDetail', medicamentId],
    queryFn: async () => {
      return (await http.get(`/api/medicaments/?Query=${medicamentId}`)).data.data
    },
    enabled: medicamentId ? true : false
  })

  return (
    <Container>
      {JSON.stringify(query.data)}
      <Group grow mb="xl">
        <SearchMedicament value={medicamentId} setValue={setMedicamentId} />
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
