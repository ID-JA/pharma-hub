import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useElementSize } from '@mantine/hooks'
import {
  ActionIcon,
  Badge,
  Group,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Text,
  TextInput
} from '@mantine/core'
import { z } from 'zod'

import { medicamentsInfiniteQueryOptions } from '@renderer/services/medicaments.service'
import { IconEye, IconPencil, IconX } from '@tabler/icons-react'

export const Route = createFileRoute('/_portal/medicaments')({
  validateSearch: z.object({
    name: z.string().optional()
  }).parse,
  preSearchFilters: [
    (search) => ({
      ...search,
      name: search.name || undefined
    })
  ],
  loaderDeps: ({ search: { name } }) => ({ name }),

  loader: (opts) =>
    opts.context.queryClient.fetchInfiniteQuery(
      medicamentsInfiniteQueryOptions(opts.deps as { name?: string })
    ),
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
    (element: HTMLDivElement | null) => {
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
        <div>
          <Group style={{ padding: 'var(--mantine-spacing-md)' }}>
            <TextInput
              flex="1"
              label="Search for medicaments"
              placeholder="Name, Code bar, DCI..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              rightSection={
                <ActionIcon variant="default" onClick={() => setFilterQuery('')}>
                  <IconX size={14} />
                </ActionIcon>
              }
            />
            <Select
              defaultChecked
              defaultValue="All"
              label="Status"
              data={['All', 'In Stock', 'Out of Stock']}
            />
          </Group>

          <ScrollArea h={height - 120} mx="md">
            {medicaments &&
              medicaments.map((medicament) => (
                <Paper key={medicament.id} ref={lastElementRef} px="md" py="xl" withBorder mb="md">
                  <Group justify="space-between" align="center">
                    <Group grow flex={1} align="center">
                      <Text fw="bold">{medicament.name}</Text>
                      <Text fw="bold">$ {medicament.ppv}</Text>
                      <div>
                        <Badge
                          variant="outline"
                          color={
                            medicament.status.toUpperCase() === 'OUT OF STOCK' ? 'red' : 'green'
                          }
                        >
                          {medicament.status}
                        </Badge>
                      </div>
                    </Group>

                    <Group>
                      <ActionIcon
                        variant="outline"
                        onClick={() => {
                          navigate({
                            search: (old) => {
                              return {
                                ...old,
                                medicamentId: medicament.id
                              }
                            },
                            replace: true
                          })
                        }}
                        size="sm"
                      >
                        <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
                      </ActionIcon>{' '}
                      <ActionIcon
                        variant="outline"
                        size="sm"
                        component={Link}
                        to="/medicaments/$medicamentId"
                        params={{
                          medicamentId: medicament.id
                        }}
                        preload="intent"
                      >
                        <IconEye style={{ width: '70%', height: '70%' }} stroke={1.5} />
                      </ActionIcon>
                    </Group>
                  </Group>
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
