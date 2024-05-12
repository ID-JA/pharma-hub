import { medicamentQueryOptions } from '@renderer/services/medicaments.service'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_portal/medicaments/$medicamentId')({
  // validateSearch: z.object({
  //   medicamentId: z.number()
  // }),
  parseParams: (params) => ({
    medicamentId: z.number().int().parse(Number(params.medicamentId))
  }),

  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(medicamentQueryOptions(opts.params.medicamentId)),
  component: () => {
    const search = Route.useSearch()
    const params = Route.useParams()
    const navigate = useNavigate({ from: Route.fullPath })
    const medicamentQuery = useSuspenseQuery(medicamentQueryOptions(params.medicamentId))

    return (
      <div>
        Hello /_portal/medicaments/medicament!
        {JSON.stringify(medicamentQuery.data, null, 2)}
      </div>
    )
  }
})
