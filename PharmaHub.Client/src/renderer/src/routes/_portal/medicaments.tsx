import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useElementSize } from '@mantine/hooks'
import { Box, ScrollArea, SimpleGrid } from '@mantine/core'
import { z } from 'zod'

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
  const { ref, height } = useElementSize()
  const search = Route.useSearch()
  return (
    <div ref={ref} style={{ height: 'inherit' }}>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing={{ base: 10, sm: 'md' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        <ScrollArea h={height}>
          <MedicamentList search={search} />
        </ScrollArea>
        <ScrollArea h={height}>
          <Outlet />
        </ScrollArea>
      </SimpleGrid>
    </div>
  )
}
