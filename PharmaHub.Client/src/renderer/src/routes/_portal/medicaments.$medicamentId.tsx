import { z } from 'zod'

import { ActionIcon, Title, Text, Group, Paper } from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate, createFileRoute, Outlet } from '@tanstack/react-router'

import { medicamentQueryOptions } from '@renderer/services/medicaments.service'
import { IconCurrencyEuro, IconX } from '@tabler/icons-react'

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
      <button
        onClick={() => {
          navigate({
            to: '/medicaments/$medicamentId/history'
          })
        }}
      >
        go to my history
      </button>
      <Title mt={30}>
        <u>{medicamentDetail.name}</u>
      </Title>
      <Group wrap="nowrap" gap={50} mt={30}>
        <Text fz="xl" c="dimmed">
          PPV: {medicamentDetail.ppv}
        </Text>
        <Text fz="xl" c="dimmed">
          PPH: {medicamentDetail.pph}
        </Text>
        <Text fz="xl" c="dimmed">
          PBR: {medicamentDetail.pbr}
        </Text>
      </Group>
      <Group wrap="nowrap" gap={50} mt={30}>
        <Text fz="xl" c="dimmed">
          Type: {medicamentDetail.type}
        </Text>
        <Text fz="xl" c="dimmed">
          Form: {medicamentDetail.form}
        </Text>
        <Text fz="xl" c="dimmed">
          DCI: {medicamentDetail.dci}
        </Text>
      </Group>
      <Group wrap="nowrap" grow mt={30}>
        <Paper p="lg" withBorder>
          <Title ta="center" size="24px" mt={30}>
            Total Quantity
          </Title>
          <Text size="xl" ta="center">
            8
          </Text>
        </Paper>
        <Paper p="lg" withBorder>
          <Title ta="center" size="24px" mt={30}>
            Total Quantity
          </Title>
          <Text size="xl" ta="center">
            8
          </Text>
        </Paper>
      </Group>
    </div>
  )
}
