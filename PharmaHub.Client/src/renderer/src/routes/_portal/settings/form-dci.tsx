import { dcisQueryOptions } from '@renderer/services/medicaments.service'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/settings/form-dci')({
  loader: (opts) => opts.context.queryClient.ensureQueryData(dcisQueryOptions(opts.deps)),

  component: () => {
    const dcisQuery = useSuspenseQuery(dcisQueryOptions(Route.useLoaderDeps()))

    return <div>{JSON.stringify(dcisQuery.data, null, 2)}</div>
  }
})
