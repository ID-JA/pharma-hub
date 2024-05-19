import { useEffect, useState } from 'react'

import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useDebouncedState, useElementSize } from '@mantine/hooks'
import { ActionIcon, Box, Group, ScrollArea, Select, SimpleGrid, TextInput } from '@mantine/core'
import { z } from 'zod'

import { IconX } from '@tabler/icons-react'
import MedicamentList from '@renderer/components/Medicaments/MedicamentList'

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
  component: MedicamentsPage
})
function MedicamentsPage() {
  const navigate = useNavigate()
  const { ref, height } = useElementSize()
  const { name } = Route.useSearch()

  const [filterQuery, setFilterQuery] = useDebouncedState(name ?? '', 300)

  useEffect(() => {
    navigate({
      search: (old) => {
        return {
          ...old,
          name: filterQuery || undefined
        }
      },
      replace: true
    })
  }, [filterQuery])

  return (
    <div ref={ref} style={{ height: 'inherit' }}>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing={{ base: 10, sm: 'md' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        <div>
          <Group p="md">
            <TextInput
              flex="1"
              label="Search for medicaments"
              placeholder="Name, Code bar, DCI..."
              defaultValue={filterQuery}
              onChange={(e) => setFilterQuery(e.currentTarget.value)}
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
          <ScrollArea h={height - 120}>
            <Box p="md">
              <MedicamentList />
            </Box>
          </ScrollArea>
        </div>
        <ScrollArea h={height}>
          <Outlet />
        </ScrollArea>
      </SimpleGrid>
    </div>
  )
}
