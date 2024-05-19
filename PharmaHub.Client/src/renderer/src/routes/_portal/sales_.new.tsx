import { ScrollArea, SimpleGrid } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/sales/new')({
  component: () => {
    const { ref, height } = useElementSize()

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
            {/* Todo: Render list of drugs */}
            Medicaments
          </ScrollArea>
          <ScrollArea h={height}>
            {/* Render Bucket UI */}
            Sale Items
          </ScrollArea>
        </SimpleGrid>
      </div>
    )
  }
})
