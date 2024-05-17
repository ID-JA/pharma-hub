import { useCallback, useMemo, useRef } from 'react'

import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { useElementSize } from '@mantine/hooks'
import { Paper, ScrollArea, SimpleGrid } from '@mantine/core'

import { medicamentsInfiniteQueryOptions } from '@renderer/services/medicaments.service'

export const Route = createFileRoute('/_portal/medicaments')({
  loader: (opts) =>
    opts.context.queryClient.fetchInfiniteQuery(
      medicamentsInfiniteQueryOptions(opts.deps as { query?: string })
    ),
  component: () => {
    const { ref, height } = useElementSize()
    const observer = useRef<IntersectionObserver>()

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading } =
      useSuspenseInfiniteQuery(medicamentsInfiniteQueryOptions(Route.useLoaderDeps()))

    const medicaments = useMemo(() => {
      return data?.pages.reduce((acc, page) => {
        return [...acc, ...page.data]
      }, [])
    }, [data])

    const lastElementRef = useCallback(
      (element: HTMLAnchorElement | null) => {
        if (isLoading) return

        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetching) {
            fetchNextPage()
          }
        })

        if (element) observer.current.observe(element)
      },
      [fetchNextPage, hasNextPage, isFetching, isLoading]
    )

    return (
      <div ref={ref} style={{ height: 'inherit' }}>
        {/* TODO: add search bar */}
        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          <ScrollArea h={height}>
            {/* Todo: abstract the component paper to a reusable component (MedicamentCard) */}
            {medicaments &&
              medicaments.map((medicament) => (
                <Paper
                  key={medicament.id}
                  ref={lastElementRef}
                  px="md"
                  py="xl"
                  component={Link}
                  to="/medicaments/$medicamentId"
                  params={{
                    medicamentId: medicament.id
                  }}
                  preload="intent"
                  activeProps={{ className: `font-bold` }}
                >
                  {medicament.name}
                </Paper>
              ))}
            {isFetchingNextPage && <div>Fetching more data...</div>}
            <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
          </ScrollArea>
          <ScrollArea h={height}>
            <Outlet />
          </ScrollArea>
        </SimpleGrid>
      </div>
    )
  }
})
