import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useElementSize } from '@mantine/hooks'
import { Paper, ScrollArea, SimpleGrid, TextInput } from '@mantine/core'
import { z } from 'zod'

import { medicamentsInfiniteQueryOptions } from '@renderer/services/medicaments.service'

export const Route = createFileRoute('/_portal/medicaments')({
  validateSearch: z.object({
    name: z.string().optional()
  }).parse,
  preSearchFilters: [
    // Persist (or set as default) the medicamentsView search param
    // while navigating within or to this route (or it's children!)
    (search) => ({
      ...search,
      name: search.name || undefined
    })
  ],
  loaderDeps: ({ search: { name } }) => ({ name }),

  loader: (opts) => {
    console.log(opts)
    return opts.context.queryClient.fetchInfiniteQuery(
      medicamentsInfiniteQueryOptions(opts.deps as { name?: string })
    )
  },
  component: MedicamentsPage
})
function MedicamentsPage() {
  const { ref, height } = useElementSize()
  const navigate = useNavigate()
  const { name } = Route.useSearch()
  const observer = useRef<IntersectionObserver>()

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading } =
    useSuspenseInfiniteQuery(medicamentsInfiniteQueryOptions(Route.useLoaderDeps()))

  const [filterQuery, setFilterQuery] = useState(name || '')
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

  useEffect(() => {
    navigate({
      search: (old) => {
        return {
          ...old,
          name: filterQuery
        }
      },
      replace: true
    })
  }, [filterQuery])

  return (
    <div ref={ref} style={{ height: 'inherit' }}>
      {/* TODO: add search bar */}
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        <div style={{ padding: 'var(--mantine-spacing-md)' }}>
          <div>
            <TextInput
              label="Search for medicaments"
              mb="md"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>

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
        </div>
        <ScrollArea h={height}>
          <Outlet />
        </ScrollArea>
      </SimpleGrid>
    </div>
  )
}
