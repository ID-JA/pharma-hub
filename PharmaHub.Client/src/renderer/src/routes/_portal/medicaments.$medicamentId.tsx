import { z } from 'zod'

import { ActionIcon, Title } from '@mantine/core'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate, createFileRoute, Outlet } from '@tanstack/react-router'

import { medicamentQueryOptions } from '@renderer/services/medicaments.service'
import { IconX } from '@tabler/icons-react'

export const Route = createFileRoute('/_portal/medicaments/$medicamentId')({
  parseParams: (params) => ({
    medicamentId: z.number().int().parse(Number(params.medicamentId))
  }),

  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(medicamentQueryOptions(opts.params.medicamentId)),
  component: () => {
    const params = Route.useParams()
    const navigate = useNavigate({ from: Route.fullPath })
    const medicamentQuery = useSuspenseQuery(medicamentQueryOptions(params.medicamentId))

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
        Hello /_portal/medicaments/medicament!
        <Title>
          You are viewing medicament <u>{params.medicamentId}</u> details
        </Title>
        {JSON.stringify(medicamentQuery.data, null, 2)}
      </div>
    )
  }
})
