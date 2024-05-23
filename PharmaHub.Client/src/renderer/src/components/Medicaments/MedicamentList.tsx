import { useCallback, useMemo, useRef } from 'react'
import { useSearch } from '@tanstack/react-router'
import { useMedicaments } from '@renderer/services/medicaments.service'
import MedicamentCard from './MedicamentCard'
import MedicamentsFilter from './MedicamentsFilter'
import { Box, Group, Table, Text } from '@mantine/core'

function MedicamentList({
  search,
  handleAddItem
}: {
  search: { name?: string | undefined }
  handleAddItem?: (medicament: any) => void
}) {
  // const search = useSearch({ from: '/_portal/medicaments' })
  const observer = useRef<IntersectionObserver>()

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading } =
    useMedicaments({
      name: search.name
    })

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

  const rows = medicaments?.map((element) => (
    <Table.Tr
      key={element.id}
      ref={lastElementRef}
      onClick={() => {
        if (handleAddItem) handleAddItem(element)
      }}
    >
      <Table.Td>{element.form}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.ppv}</Table.Td>
      <Table.Td>{element.quantity}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
    </Table.Tr>
  ))

  return (
    <Box p="md">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w="5%">Form</Table.Th>
            <Table.Th>Product Name</Table.Th>
            <Table.Th>PPV</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      {isFetchingNextPage && <div style={{ textAlign: 'center' }}>Fetching more data...</div>}
      <div style={{ textAlign: 'center' }}>
        {isFetching && !isFetchingNextPage ? 'Fetching...' : null}
      </div>
    </Box>
  )
}

export default MedicamentList
