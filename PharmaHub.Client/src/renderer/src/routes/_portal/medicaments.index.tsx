import { Group, Text, Title } from '@mantine/core'
import { IconPill } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/medicaments/')({
  component: () => (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ width: '100%' }}>
        <Title ta="center">Medicaments</Title>
        <Text ta="center">Please select a medicament from the list to view more detail</Text>
        <Group justify="center" align="center" mt="lg">
          <IconPill size="50px" stroke={1.5} />
        </Group>
      </div>
    </div>
  )
})
