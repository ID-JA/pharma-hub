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
  const { ref, height } = useElementSize()

  return (
    <div ref={ref} style={{ height: 'inherit' }}>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing={{ base: 10, sm: 'md' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        <ScrollArea h={height}>
          <Box p="md">
            <MedicamentList />
          </Box>
        </ScrollArea>
        <ScrollArea h={height}>
          <Outlet />
        </ScrollArea>
      </SimpleGrid>
    </div>
  )
}
