import { useCallback, useMemo } from 'react'
import { z } from 'zod'
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
  Text,
  Title
} from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { createFileRoute } from '@tanstack/react-router'
import { IconTrash } from '@tabler/icons-react'
import MedicamentList from '@renderer/components/Medicaments/MedicamentList'
import { Sale } from '@renderer/utils/types'

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

function useSaleForm() {
  const form = useForm<Sale>({
    initialValues: {
      totalQuantity: 0,
      totalPrice: 0,
      status: '',
      discount: 0,
      tva: 0,
      saleMedicaments: []
    },
    validate: {
      // Add your validation rules here if needed
    }
  })

  const calculateTotalPrice = (ppv: number, quantity: number, tva: number, discount: number) => {
    const basePrice = ppv * quantity
    const priceWithTVA = basePrice + (basePrice * tva) / 100
    const discountAmount = (priceWithTVA * discount) / 100
    const finalPrice = priceWithTVA - discountAmount
    return Math.max(finalPrice, 0)
  }

  const updateTotals = useCallback(() => {
    const values = form.getValues().saleMedicaments
    form.setFieldValue(
      'totalPrice',
      values.reduce((acc, item) => acc + item.totalPrice, 0)
    )
    form.setFieldValue(
      'totalQuantity',
      values.reduce((acc, item) => acc + item.quantity, 0)
    )
  }, [form])

  const onChangeSaleItem = useCallback(
    (index: string | number, name: any, value: any) => {
      form.setFieldValue(`saleMedicaments.${index}.${name}`, value)
      const item = form.getValues().saleMedicaments[index]
      form.setFieldValue(
        `saleMedicaments.${index}.totalPrice`,
        calculateTotalPrice(item.ppv, item.quantity, item.tva, item.discount)
      )
      updateTotals()
    },
    [form, updateTotals]
  )

  const handleAddItem = useCallback(
    (item: any) => {
      const { name, ppv, quantity, tva, id, discount } = item
      form.insertListItem('saleMedicaments', {
        medicamentId: id,
        discount,
        name,
        ppv,
        quantity,
        tva,
        totalPrice: calculateTotalPrice(ppv, quantity, tva, discount)
      })
      updateTotals()
    },
    [form, updateTotals]
  )

  const handleRemoveItem = useCallback(
    (index) => {
      form.removeListItem('saleMedicaments', index)
      updateTotals()
    },
    [form, updateTotals]
  )

  return {
    form,
    onChangeSaleItem,
    handleAddItem,
    handleRemoveItem,
    updateTotals
  }
}

function NewSalePage() {
  const { ref, height } = useElementSize()
  const search = Route.useSearch()
  const { form, onChangeSaleItem, handleAddItem, handleRemoveItem } = useSaleForm()

  const handleConfirmCancel = () => {
    modals.openConfirmModal({
      title: 'Are you sure you want to cancel?',
      centered: true,
      labels: { confirm: 'Yes', cancel: 'No' },
      onConfirm: () => form.reset()
    })
  }

  const saleItems = useMemo(
    () =>
      form.values.saleMedicaments.map((element, index) => (
        <Paper withBorder mb="md" key={index} p="md">
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
              <Text component="span" fw="500" fz="xs">
                Name
              </Text>
              <br />
              {element.name}
            </Text>
            <Text>
              <Text component="span" fw="500" fz="xs">
                PPV($)
              </Text>
              <br />
              {element.ppv}
            </Text>
            <NumberInput
              min={0}
              label="Quantity"
              size="xs"
              radius="xs"
              {...form.getInputProps(`saleMedicaments.${index}.quantity`)}
              onChange={(value) => onChangeSaleItem(index, 'quantity', value)}
            />
            <NumberInput
              min={0}
              max={100}
              label="TVA(%)"
              size="xs"
              radius="xs"
              {...form.getInputProps(`saleMedicaments.${index}.tva`)}
              onChange={(value) => onChangeSaleItem(index, 'tva', value)}
            />
            <NumberInput
              min={0}
              max={100}
              label="Discount(%)"
              size="xs"
              radius="xs"
              {...form.getInputProps(`saleMedicaments.${index}.discount`)}
              onChange={(value) => onChangeSaleItem(index, 'discount', value)}
            />
            <NumberInput
              min={0}
              label="Total Price($)"
              size="xs"
              decimalScale={2}
              radius="xs"
              {...form.getInputProps(`saleMedicaments.${index}.totalPrice`)}
            />
            <ActionIcon mt="lg" variant="light" color="red" onClick={() => handleRemoveItem(index)}>
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Paper>
      )),
    [form, onChangeSaleItem, handleRemoveItem]
  )

  return (
    <div ref={ref} style={{ height: 'inherit' }}>
      <SimpleGrid
        cols={{ base: 1, md: 2 }}
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
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
              <ScrollArea h={height - 200}>
                {saleItems.length === 0 && (
                  <Text ta="center" fz="lg" td="underline">
                    Select Medicaments to create a new sale by clicking on (+) button
                  </Text>
                )}
                {saleItems}
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
                    Total: ${form.values.totalPrice.toFixed(2)}
                  </Title>
                </div>
              </SimpleGrid>
              <Group justify="space-between">
                <Group>
                  <Button type="submit" disabled={form.values.saleMedicaments.length === 0}>
                    Proceed
                  </Button>
                  <Button disabled={form.values.saleMedicaments.length === 0} variant="outline">
                    Suspend
                  </Button>
                </Group>
                <Group>
                  <Button
                    disabled={form.values.saleMedicaments.length === 0}
                    variant="outline"
                    color="red"
                    onClick={handleConfirmCancel}
                  >
                    Cancel
                  </Button>
                </Group>
              </Group>
            </form>
          </Box>
        </ScrollArea>
      </SimpleGrid>
    </div>
  )
}
