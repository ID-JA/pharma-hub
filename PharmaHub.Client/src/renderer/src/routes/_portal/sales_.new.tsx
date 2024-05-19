import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  NumberInput,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title
} from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import MedicamentList from '@renderer/components/Medicaments/MedicamentList'
import { IconTrash } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/_portal/sales/new')({
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
  component: NewSalePage
})

function NewSalePage() {
  const { ref, height } = useElementSize()
  const search = Route.useSearch()
  const [cart, setCart] = useState([
    // Example initial cart items
    { id: 1, name: 'Item 1', ppv: 10, quantity: 2, tva: 5, discount: 0, totalPrice: 21 },
    { id: 2, name: 'Item 2', ppv: 15, quantity: 1, tva: 10, discount: 5, totalPrice: 16.5 }
  ])

  const calculateTotalPrice = (ppv, quantity, tva, discount) => {
    const basePrice = ppv * quantity
    const priceWithTVA = basePrice + (basePrice * tva) / 100
    const finalPrice = priceWithTVA - discount
    return finalPrice < 0 ? 0 : finalPrice
  }

  const handleUpdateItem = (id, field, value) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          const { ppv, quantity, tva, discount } = updatedItem
          updatedItem.totalPrice = calculateTotalPrice(ppv, quantity, tva, discount)
          return updatedItem
        }
        return item
      })
    )
  }

  const handleUpdateTotalPrice = (id, value) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, totalPrice: value } : item))
    )
  }
  const handleAddItem = (item) => {
    setCart([
      ...cart,
      {
        ...item,
        totalPrice: calculateTotalPrice(item.ppv, item.quantity, item.tva, item.discount)
      }
    ])
  }
  const handleRemoveItem = (item) => {
    setCart(cart.filter((element) => element.id !== item.id))
  }

  const cancelConfirmation = () => {
    modals.openConfirmModal({
      title: 'Are you sure you want to cancel ?',
      centered: true,
      labels: { confirm: 'Yes', cancel: 'No' },
      onCancel: () => {},
      onConfirm: () => {
        setCart([])
      }
    })
  }

  return (
    <div ref={ref} style={{ height: 'inherit' }}>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        <ScrollArea h={height}>
          <MedicamentList handleAddItem={handleAddItem} search={search} />
        </ScrollArea>
        <ScrollArea h={height}>
          <Box p="md">
            <Title my="md" ta="center" order={3}>
              Create New Sale
            </Title>
            <ScrollArea h={height - 300}>
              {cart.map((element) => (
                <Paper withBorder mb="md" key={element.id} p="md">
                  <Group grow justify="space-between" align="center">
                    <Text
                      title={element.name}
                      style={{
                        textTransform: 'capitalize',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Text fw="500" fz="xs">
                        Name
                      </Text>
                      {element.name}
                    </Text>
                    <Text>
                      <Text fw="500" fz="xs">
                        PPV($)
                      </Text>
                      {element.ppv}
                    </Text>

                    <NumberInput
                      min={0}
                      label="Quantity"
                      size="xs"
                      radius="xs"
                      value={element.quantity}
                      onChange={(value) => handleUpdateItem(element.id, 'quantity', value)}
                    />
                    <NumberInput
                      min={0}
                      max={100}
                      label="TVA(%)"
                      size="xs"
                      radius="xs"
                      value={element.tva}
                      onChange={(value) => handleUpdateItem(element.id, 'tva', value)}
                    />
                    <NumberInput
                      min={0}
                      max={100}
                      label="Discount(%)"
                      size="xs"
                      radius="xs"
                      value={element.discount}
                      onChange={(value) => handleUpdateItem(element.id, 'discount', value)}
                    />
                    <NumberInput
                      min={0}
                      label="Total Price($)"
                      size="xs"
                      decimalScale={2}
                      radius="xs"
                      value={element.totalPrice}
                      onChange={(value) => handleUpdateTotalPrice(element.id, value)}
                    />
                    <Stack align="flex-end">
                      <ActionIcon onClick={() => handleRemoveItem(element)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Stack>
                  </Group>
                </Paper>
              ))}
            </ScrollArea>
            <Divider />
            <SimpleGrid
              cols={{ base: 1, sm: 2 }}
              spacing={{ base: 10, sm: 'xl' }}
              verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
              <div />
              <div>
                <Title my="md" ta="left" order={3}>
                  Total: ${cart.reduce((acc, curr) => acc + curr.totalPrice, 0).toFixed(2)}
                </Title>
              </div>
            </SimpleGrid>
            <Group justify="space-between">
              <Group>
                <Button>Proceed</Button>
                <Button variant="outline">Suspend</Button>
              </Group>
              <Group>
                <Button
                  disabled={cart.length === 0}
                  variant="outline"
                  color="red"
                  onClick={cancelConfirmation}
                >
                  Cancel
                </Button>
              </Group>
            </Group>
          </Box>
        </ScrollArea>
      </SimpleGrid>
    </div>
  )
}
