import { SimpleGrid } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/orders/consultation')({
  component: NewDeliveryPage
})

export function NewDeliveryPage() {
  return (
    <div>
      <SimpleGrid cols={2}>
        <div>
          <h1>Consultation</h1>
        </div>
        <div>
          <h1>Consultation</h1>
        </div>
      </SimpleGrid>
    </div>
  )
}
