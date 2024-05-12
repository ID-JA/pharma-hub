import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

import { Paper, ScrollArea, SimpleGrid } from '@mantine/core'
import { medicamentsQueryOptions } from '@renderer/services/medicaments.service'
import { useElementSize } from '@mantine/hooks'

export const Route = createFileRoute('/_portal/medicaments')({
  loader: (opts) => opts.context.queryClient.ensureQueryData(medicamentsQueryOptions(opts.deps)),
  component: () => {
    const { ref, height } = useElementSize()

    // Retrieve data
    const medicamentsQuery = useSuspenseQuery(medicamentsQueryOptions(Route.useLoaderDeps()))

    return (
      <div
        ref={ref}
        style={{ height: 'inherit', background: 'green', position: 'relative', overflow: 'hidden' }}
      >
        {/* TODO: add search bar */}
        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          <ScrollArea h={height}>
            {medicamentsQuery.data.map((item) => (
              <Paper
                py="xl"
                component={Link}
                key={item.id}
                to="/medicaments/$medicamentId"
                params={{
                  medicamentId: item.id
                }}
                preload="intent"
                className="block py-2 px-3 text-blue-700"
                activeProps={{ className: `font-bold` }}
              >
                {item.name}
              </Paper>
            ))}
          </ScrollArea>
          <ScrollArea h={height}>
            <Outlet />
          </ScrollArea>
        </SimpleGrid>
      </div>
    )
  }
})
