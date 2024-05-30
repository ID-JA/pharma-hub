import { useCallback, useMemo, useRef, useState } from 'react'
import { useMedicaments } from '@renderer/services/medicaments.service'
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import dayjs from 'dayjs'

function MedicamentList({
  search,
  handleAddItem
}: {
  search: { name?: string | undefined }
  handleAddItem?: (medicament: any) => void
}) {
  // const search = useSearch({ from: '/_portal/medicaments' })
  const observer = useRef<IntersectionObserver>()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading
  } = useMedicaments({
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

  const [addedItems, setAddedItems] = useState<number[]>([])

  /**
   * `handleAdd` responsible for adding a medicament's inventory to the list
   */
  const handleAdd = (item) => {
    if (!addedItems.includes(item.id)) {
      modals.open({
        title: <Text size="lg">Select the inventory</Text>,
        size: 'lg',
        centered: true,
        children: (
          <>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product Name</Table.Th>
                  <Table.Th>PPV</Table.Th>
                  <Table.Th>PPH</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                  <Table.Th>Expiration Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {item?.inventories.map((element) => (
                  <Table.Tr key={element.id}>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{element.ppv}</Table.Td>
                    <Table.Td>{element.pph}</Table.Td>
                    <Table.Td>{element.quantity}</Table.Td>
                    <Table.Td>
                      {dayjs(element.expirationDate).format('DD/MM/YYYY')}
                    </Table.Td>
                    {handleAddItem && (
                      <Table.Td>
                        <ActionIcon
                          variant="default"
                          size="sm"
                          onClick={() => {
                            modals.closeAll()
                            handleAddItem!({
                              ...item,
                              inventory: element
                            })
                            setAddedItems([...addedItems, item.id])
                          }}
                          disabled={addedItems.includes(element.id)}
                        >
                          <IconPlus
                            style={{ width: '80%', height: '80%' }}
                            stroke={1.2}
                          />
                        </ActionIcon>
                      </Table.Td>
                    )}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </>
        )
      })
    }
  }

  const rows = medicaments?.map((element) => (
    <Table.Tr key={element.id} ref={lastElementRef}>
      <Table.Td>{element.form}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.form}</Table.Td>
      <Table.Td>{element.family}</Table.Td>
      <Table.Td>{element.totalQuantity}</Table.Td>
      {handleAddItem && (
        <Table.Td>
          <ActionIcon
            variant="default"
            size="sm"
            onClick={() => handleAdd(element)}
            disabled={addedItems.includes(element.id)}
          >
            <IconPlus style={{ width: '80%', height: '80%' }} stroke={1.2} />
          </ActionIcon>
        </Table.Td>
      )}
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
            <Table.Th>PPH</Table.Th>
            <Table.Th>Quantity</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      {isFetchingNextPage && (
        <div style={{ textAlign: 'center' }}>Fetching more data...</div>
      )}
      <div style={{ textAlign: 'center' }}>
        {isFetching && !isFetchingNextPage ? 'Fetching...' : null}
      </div>
    </Box>
  )
}

export default MedicamentList
