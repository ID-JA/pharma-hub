import { z } from 'zod'

import { ActionIcon, Title, Text, Group, Paper, Fieldset, Badge, Button } from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate, createFileRoute, Outlet } from '@tanstack/react-router'

import { medicamentQueryOptions, useDeleteMedicament } from '@renderer/services/medicaments.service'
import { IconCurrencyEuro, IconX } from '@tabler/icons-react'
import { modals } from '@mantine/modals'

export const Route = createFileRoute('/_portal/medicaments/$medicamentId')({
  parseParams: (params) => ({
    medicamentId: z.number().int().parse(Number(params.medicamentId))
  }),

  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(medicamentQueryOptions(opts.params.medicamentId)),
  component: MedicamentDetailPage
})

function MedicamentDetailPage() {
  const params = Route.useParams()
  const navigate = useNavigate({ from: Route.fullPath })
  const { data: medicamentDetail } = useSuspenseQuery(medicamentQueryOptions(params.medicamentId))
  const { mutate: deleteMedicament } = useDeleteMedicament()

  const openDeleteConfirmModal = () =>
    modals.openConfirmModal({
      title: 'Are you sure you want to delete this user?',
      children: (
        <Text>
          Are you sure you want to delete <b>{medicamentDetail.name}</b>? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMedicament(medicamentDetail.id)
    })
  return (
    <div>
      <ActionIcon
        variant="outline"
        color="red"
        title="close"
        aria-label="close view detail"
        size="sm"
        style={{
          position: 'absolute',
          top: 10,
          right: 10
        }}
        onClick={() =>
          navigate({
            to: '/medicaments',
            replace: true
          })
        }
      >
        <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>

      <Title mt={30}>
        <u>{medicamentDetail.name}</u>
      </Title>
      <Badge
        mt="md"
        color={medicamentDetail.status.toUpperCase() === 'OUT OF STOCK' ? 'red' : 'green'}
      >
        {medicamentDetail.status}
      </Badge>
      <Fieldset legend="Pricing" mt="lg">
        <Group grow>
          <Text>PPV: ${medicamentDetail.ppv}</Text>
          <Text>PPH: ${medicamentDetail.pph}</Text>
          <Text>PBR: ${medicamentDetail.pbr}</Text>
        </Group>
        <Group grow mt="md">
          <Text>Marge: ${medicamentDetail.marge}</Text>
          <Text>TVA: {medicamentDetail.tva}%</Text>
          <Text>Discount: {medicamentDetail.discount}%</Text>
        </Group>
      </Fieldset>
      <Fieldset legend="Categorization" mt="lg">
        <Group grow>
          <Text>Form: {medicamentDetail.form}</Text>
          <Text>Type: {medicamentDetail.type}</Text>
          <Text>DCI: {medicamentDetail.dci}</Text>
        </Group>
        <Group grow mt="md">
          <Text>Family: {medicamentDetail.family}</Text>
          <Text>Used by: {medicamentDetail.usedBy}</Text>
          <Text>With Prescription: {medicamentDetail.withPrescription ? 'Yes' : 'No'}</Text>
        </Group>
      </Fieldset>

      <Group wrap="nowrap" grow mt={30}>
        <Paper p="lg" withBorder>
          <Title ta="center" size="20px" mt={30}>
            Total Quantity in stock
          </Title>
          <Text size="xl" ta="center">
            {medicamentDetail.quantity}
          </Text>
        </Paper>
        <Paper p="lg" withBorder>
          <Title ta="center" size="20px" mt={30}>
            Total Quantity sold
          </Title>
          <Text size="xl" ta="center">
            8
          </Text>
        </Paper>
      </Group>
      <Group mt={30}>
        <Button onClick={openDeleteConfirmModal} color="red">
          Delete
        </Button>
      </Group>
    </div>
  )
}
