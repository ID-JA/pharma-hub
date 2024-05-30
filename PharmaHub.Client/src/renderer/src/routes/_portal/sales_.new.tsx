import { useCallback, useMemo, useState } from 'react'
import { z } from 'zod'
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  NumberInput,
  Paper,
  ScrollArea,
  Stack,
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
import { useCreateSale } from '@renderer/services/sales.service'
import MedicamentsFilter from '@renderer/components/Medicaments/MedicamentsFilter'
import { useAddMedicamentModal } from '@renderer/components/Modals/AddMedicamentModal'

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
  const [showWarning, setShowWarning] = useState(false)
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

  const calculateTotalPrice = (
    ppv: number,
    quantity: number,
    tva: number,
    discount: number
  ) => {
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
      const { name, ppv, quantity, tva, id, discountRate } = item
      if (quantity <= 0) {
        setShowWarning(true)
      }
      // before inserting new item I need to check if is exist already in the cart (saleMedicament)
      // if yes increment by one the quantity of the existing item otherwise add it to the cart
      if (
        form
          .getValues()
          .saleMedicaments.some(
            (m) => m.medicamentId.toString() === item.id.toString()
          )
      ) {
        const existingItemIndex = form
          .getValues()
          .saleMedicaments.findIndex(
            (m) => m.medicamentId.toString() === item.id.toString()
          )
        const existingItem = form.getValues().saleMedicaments[existingItemIndex]
        const updatedQuantity = existingItem.quantity + 1
        form.setFieldValue(
          `saleMedicaments.${existingItemIndex}.quantity`,
          updatedQuantity
        )
        onChangeSaleItem(existingItemIndex, 'quantity', updatedQuantity)
      } else {
        // Add the new item to the cart
        form.insertListItem('saleMedicaments', {
          medicamentId: id,
          discount: discountRate,
          name,
          ppv,
          quantity: 1,
          tva
        })
        onChangeSaleItem(
          form.getValues().saleMedicaments.length - 1,
          'quantity',
          1
        )
      }
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
    showWarning,
    onChangeSaleItem,
    handleAddItem,
    handleRemoveItem,
    updateTotals
  }
}

function NewSalePage() {
  const { ref, height } = useElementSize()
  const search = Route.useSearch()
  const { form, onChangeSaleItem, handleAddItem, handleRemoveItem } =
    useSaleForm()
  const { AddMedicamentModal, AddMedicamentButton } = useAddMedicamentModal()

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
      form.getValues().saleMedicaments.map((element, index) => (
        <Paper withBorder mb="sm" key={index} py="xs" px="md">
          <Group justify="space-between">
            <Group>
              <Text>AC</Text>
              <Text>{element.name}</Text>
            </Group>
            <Group justify="end" align="end" flex="1">
              <NumberInput
                w="8%"
                size="xs"
                radius="xs"
                label="PPV"
                readOnly
                {...form.getInputProps(`saleMedicaments.${index}.ppv`)}
              />
              <NumberInput
                w="8%"
                size="xs"
                radius="xs"
                label="PPH"
                readOnly
                {...form.getInputProps(`saleMedicaments.${index}.pph`)}
              />
              <NumberInput
                min={0}
                w="8%"
                size="xs"
                label="Quantity"
                radius="xs"
                {...form.getInputProps(`saleMedicaments.${index}.quantity`)}
                onChange={(value) => onChangeSaleItem(index, 'quantity', value)}
              />
              <NumberInput
                w="8%"
                size="xs"
                radius="xs"
                label="TVA"
                readOnly
                {...form.getInputProps(`saleMedicaments.${index}.tva`)}
              />
              <NumberInput
                min={0}
                max={100}
                label="Discount"
                w="8%"
                size="xs"
                radius="xs"
                {...form.getInputProps(`saleMedicaments.${index}.discount`)}
                onChange={(value) => onChangeSaleItem(index, 'discount', value)}
              />
              <NumberInput
                readOnly
                label="Price NET"
                w="8%"
                size="xs"
                radius="xs"
                {...form.getInputProps(`saleMedicaments.${index}.totalPrice`)}
              />
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => handleRemoveItem(index)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </Paper>
      )),
    [form, onChangeSaleItem, handleRemoveItem]
  )

  const { mutate: createSale } = useCreateSale()

  return (
    <div
      ref={ref}
      style={{ height: 'inherit', padding: '0 var(--mantine-spacing-xl)' }}
    >
      <AddMedicamentModal />
      <ScrollArea h={(height - 100) / 2}>
        <Group justify="space-between">
          <MedicamentsFilter search={search} />
          <Group>
            <Title my="md" ta="left" order={3}>
              Total Price: ${form.getValues().totalPrice.toFixed(2)}
            </Title>
            <Title my="md" ta="left" order={3}>
              Total Product: {form.getValues().saleMedicaments.length}
            </Title>
          </Group>
        </Group>
        <MedicamentList search={search} handleAddItem={handleAddItem} />
      </ScrollArea>
      <Divider my="md" />
      <Group gap="xl">
        <ScrollArea h={(height - 260) / 2} flex="1">
          {saleItems.length === 0 && (
            <Text ta="center" fz="lg" td="underline">
              Select Medicaments to create a new sale
            </Text>
          )}
          {saleItems}
        </ScrollArea>
        <Stack mt="lg">
          <AddMedicamentButton />
          <Button variant="light">Validate SALE </Button>
          <Button variant="light">Validate For Client </Button>
          <Button variant="light">Suspend SALE</Button>
          <Button variant="light">Resume Sale</Button>
          <Button variant="light" title="delete" onClick={handleConfirmCancel}>
            Return SALE
          </Button>
        </Stack>
      </Group>
      <Group pb="xl" justify="space-between">
        <NumberInput
          label="Manual Discount"
          defaultValue={0}
          min={0}
          max={100}
        />
        <Button
          variant="light"
          color="red"
          title="delete"
          onClick={handleConfirmCancel}
        >
          Cancel SALE
        </Button>
      </Group>
    </div>
  )
}
