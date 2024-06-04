import { Box, Checkbox, Divider, Grid, ScrollArea, Table } from '@mantine/core'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_portal/bills/new')({
  component: NewBillPage
})

function NewBillPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const [filterOptions, setFilterOptions] = useState({
    supplier: null
  })
  const { data } = useQuery({
    queryKey: ['deliveryNotes', filterOptions],
    queryFn: async () => {
      const response = await http.get('/api/deliveries')
      return response.data.data
    }
  })

  // const rows = data?.map((element) => (
  //   <Table.Tr
  //     key={element.id}
  //     bg={selectedRows.includes(element.position) ? 'var(--mantine-color-blue-light)' : undefined}
  //   >
  //     <Table.Td>
  //       <Checkbox
  //         aria-label="Select row"
  //         checked={selectedRows.includes(element.position)}
  //         onChange={(event) =>
  //           setSelectedRows(
  //             event.currentTarget.checked
  //               ? [...selectedRows, element.position]
  //               : selectedRows.filter((position) => position !== element.position)
  //           )
  //         }
  //       />
  //     </Table.Td>
  //     <Table.Td>{element.position}</Table.Td>
  //     <Table.Td>{element.name}</Table.Td>
  //     <Table.Td>{element.symbol}</Table.Td>
  //     <Table.Td>{element.mass}</Table.Td>
  //   </Table.Tr>
  // ));
  return (
    <Box p="md">
      <Grid>
        <Grid.Col span={8}>
          <ScrollArea h={550} type="never" mb="md">
            <Table style={{ whiteSpace: 'nowrap' }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w="100px"></Table.Th>
                  <Table.Th w="100px">N° DN</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>PPV</Table.Th>
                  <Table.Th>Free PPV</Table.Th>
                  <Table.Th>PPH</Table.Th>
                  <Table.Th>Discount Rate</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody></Table.Tbody>
            </Table>
          </ScrollArea>
        </Grid.Col>
        <Grid.Col span={4}>1</Grid.Col>
      </Grid>
    </Box>
  )
}
