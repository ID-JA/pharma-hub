import { Box, Group, Select, Tabs } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/deliveries/consultation')({
  component: DeliveriesOrdersConsultation
})

function DeliveriesOrdersConsultation() {
  return (
    <Box p="md">
      <Group mb="lg">
        <Select
          label="Supplier"
          data={[{ label: 'Supplier One', value: '1' }]}
        />
        <DatePickerInput type="range" label="Pick dates range" miw={220} />
      </Group>
      <Tabs defaultValue="pending-delivery-notes">
        <Tabs.List>
          <Tabs.Tab value="pending-delivery-notes">
            Pending Delivery Notes
          </Tabs.Tab>
          <Tabs.Tab value="pending-orders">Pending Orders</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending-delivery-notes">
          <PendingDeliveries />
        </Tabs.Panel>

        <Tabs.Panel value="pending-orders">
          <PendingOrders />
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
}

function PendingDeliveries() {
  return <div>HI</div>
}

function PendingOrders() {
  return <div>HI</div>
}
