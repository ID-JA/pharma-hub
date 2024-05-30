import { Outlet } from '@tanstack/react-router'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Group,
  Select,
  TextInput,
  ScrollArea,
  SimpleGrid,
  Text,
  ActionIcon,
  Button,
  Paper,
  Box
} from '@mantine/core'
import { IconEye, IconSearch } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { http } from '@renderer/utils/http'
import { useElementSize } from '@mantine/hooks'

export const Route = createFileRoute('/_portal/sales')({
  component: SaleData
})

function SaleData() {
  const { ref, height } = useElementSize()

  const { error, data } = useQuery({
    queryKey: ['sales'],
    queryFn: () => http.get('/api/sales').then((res) => res.data)
  })

  if (error) return 'An error has occurred'

  return (
    <div ref={ref} style={{ height: 'inherit' }}>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        <ScrollArea h={height}>
          <Button component={Link} to="/sales/new">
            Add new sale
          </Button>

          <Group p="md" mb="xl">
            <TextInput leftSection={<IconSearch stroke={1.5} />} flex="1" />
            <Group>
              <Select w="100px" data={['React', 'Angular', 'Vue', 'Svelte']} />
              <Select w="100px" data={['React', 'Angular', 'Vue', 'Svelte']} />
            </Group>
          </Group>
          <Box p="md">
            <Group grow mb="md">
              <div>
                <Text ta="center">Id</Text>
              </div>
              <div>
                <Text ta="center">Total Quantity</Text>
              </div>
              <div>
                <Text ta="center">Total Price</Text>
              </div>
              <div></div>
            </Group>

            {data?.map(function (item) {
              return (
                <Paper
                  withBorder
                  component={Group}
                  p="md"
                  mb="md"
                  grow
                  key={item.id}
                >
                  <Text ta="center">{item.id}</Text>
                  <Text ta="center">{item.totalQuantity}</Text>
                  <Text ta="center">{item.totalPrice}</Text>
                  <Group justify="flex-end">
                    <ActionIcon
                      component={Link}
                      to="/sales/$saleId"
                      params={{
                        saleId: item.id
                      }}
                    >
                      <IconEye
                        stroke={1.2}
                        style={{ width: '70%', height: '70%' }}
                      />
                    </ActionIcon>
                  </Group>
                </Paper>
              )
            })}
          </Box>
        </ScrollArea>
        <ScrollArea>
          <Outlet />
        </ScrollArea>
      </SimpleGrid>
    </div>
  )
}
