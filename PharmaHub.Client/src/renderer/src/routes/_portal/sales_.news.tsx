import {
  useDebouncedCallback,
  useDebouncedState,
  useResizeObserver,
  useToggle
} from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useRef, useState } from 'react'
import { useMedications } from './credit-notes.new'
import {
  TextInput,
  NativeSelect,
  rem,
  ScrollArea,
  ActionIcon,
  Table,
  Button,
  InputBase,
  Group,
  Paper,
  Text,
  NumberInput,
  Checkbox,
  Select
} from '@mantine/core'
import {
  IconCalendar,
  IconClock,
  IconPlus,
  IconTrash
} from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { http } from '@renderer/utils/http'
import { useForm } from '@mantine/form'
import { z } from 'zod'
import { zodResolver } from 'mantine-form-zod-resolver'
import { toast } from 'sonner'
import { modals } from '@mantine/modals'

export const Route = createFileRoute('/_portal/sales/news')({
  component: SaleNewsPage
})

const imgSrc =
  'data:image/png;base64,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'

const calculateNetPrice = (ppv, discount, tva, quantity) => {
  const priceBeforeDiscount = ppv * (1 + tva / 100) * quantity
  return priceBeforeDiscount * (1 - discount / 100)
}

const SaleSchema = z.object({
  totalQuantities: z.number().nonnegative(),
  totalPpvNet: z.number().nonnegative(),
  totalPpvBrut: z.number().nonnegative(),
  discountedAmount: z.number().nonnegative(),
  saleMedications: z
    .array(
      z.object({
        inventoryId: z.number(),
        netPrice: z.number(),
        quantity: z.number(),
        discount: z.number(),
        saleType: z.string().default('box'),
        medicationName: z.string().default(''),
        ppv: z.number().default(0),
        unitPrice: z.number().default(0),
        pph: z.number().default(0),
        tva: z.number().default(0),
        marge: z.number().default(0)
      })
    )
    .default([])
    .refine((data) => data.length > 0, { message: 'Required' })
})

type Sale = z.infer<typeof SaleSchema>

function SaleNewsPage() {
  const [searchFieldName, setSearchFieldName] = useState('name')
  const [searchValue, setSearchValue] = useDebouncedState('', 500)
  const [isUsingBarcodeScanner, toggle] = useToggle<boolean>([false, true])
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  const [ref, { height }] = useResizeObserver()

  const { data: medications = [] } = useMedications({
    searchValue,
    searchFieldName
  })

  const form = useForm<Sale>({
    initialValues: {
      totalQuantities: 0,
      discountedAmount: 0,
      totalPpvNet: 0,
      totalPpvBrut: 0,
      saleMedications: []
    },
    validate: zodResolver(SaleSchema)
  })

  const handleSearchWithBarcode = useDebouncedCallback(
    async (query: string) => {
      const { data: response } = await http.get('/api/medicaments/search', {
        params: {
          field: 'barcode',
          query
        }
      })

      const { data } = response
      if (data.length === 1) {
        if (data[0].inventories.length === 1) {
          const inventory = data[0].inventories[0]
          const medication = data[0]
          const saleMedications = form.getValues().saleMedications
          const existingItemIndex = saleMedications.findIndex(
            (item) => item.inventoryId === inventory.id
          )

          if (existingItemIndex !== -1) {
            const currentQuantity = saleMedications[existingItemIndex].quantity
            form.setFieldValue(
              `saleMedications.${existingItemIndex}.quantity`,
              currentQuantity + 1
            )
          } else {
            handleInventoryAdd({
              medication,
              inventory
            })
          }
        } else {
          modals.open({
            modalId: 'many-inventories',
            title: <Text size="lg">Alert</Text>,
            centered: true,
            children: (
              <>
                <Text size="sm">
                  Il y a plus d'un inventaire avec ce code-barres, essayez d'en
                  sélectionner un manuellement.
                </Text>
                <Button
                  fullWidth
                  mt="md"
                  onClick={() => modals.close('many-inventories')}
                >
                  Fermmer
                </Button>
              </>
            )
          })
          setSearchFieldName('barcode')
          setSearchValue(query)
        }
      }

      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus()
        barcodeInputRef.current.select()
      }
    },
    500
  )

  const handleRemoveProduct = (saleItemIndex) => {
    form.removeListItem('saleMedications', saleItemIndex)
  }

  const handleInventoryAdd = ({ medication, inventory }) => {
    // if (!isAdded(inventory.id)) {

    form.insertListItem('saleMedications', {
      inventoryId: inventory.id,
      quantity: 1,
      netPrice: calculateNetPrice(inventory.ppv, 0, medication.tva, 1),
      discount: 0,
      saleType: 'box',
      medicationName: medication.name,
      ppv: inventory.ppv,
      pph: inventory.pph,
      tva: medication.tva,
      pbr: medication.pbr,
      marge: medication.marge,
      isPartialSaleAllowed: medication.isPartialSaleAllowed,
      unitPrice: medication.unitPrice
    })
    // }
  }

  const saleItemsFields = form
    .getValues()
    .saleMedications.map((item, index) => (
      <SaleItem
        key={item.inventoryId}
        saleItem={item}
        form={form}
        index={index}
        onRemove={handleRemoveProduct}
      />
    ))

  const totals = useMemo(() => {
    const saleItems = form.getValues().saleMedications

    const totals = saleItems.reduce(
      (acc, item) => {
        const { ppv, tva, quantity, discount, saleType, unitPrice } = item

        const priceBeforeDiscount = ppv * (1 + tva / 100) * quantity
        const priceAfterDiscount = calculateNetPrice(
          ppv,
          discount,
          tva,
          quantity
        )
        const discountedAmount = priceBeforeDiscount - priceAfterDiscount

        acc.totalQuantities += quantity

        if (saleType === 'box') {
          acc.totalPpvBrut += priceBeforeDiscount
          acc.totalPpvNet += priceAfterDiscount
        } else {
          acc.totalPpvBrut += unitPrice * quantity
          acc.totalPpvNet += unitPrice * quantity
        }

        acc.discountedAmount += discountedAmount

        return acc
      },
      {
        totalQuantities: 0,
        discountedAmount: 0,
        totalPpvBrut: 0,
        totalPpvNet: 0
      }
    )

    return totals
  }, [form.getValues().saleMedications])

  return (
    <Paper
      withBorder
      px="md"
      py="xs"
      radius="md"
      h="calc(100vh - 1.5rem)"
      ref={ref}
    >
      <Group h={height / 2}>
        <div style={{ minHeight: `${height / 2}px`, flex: 1 }}>
          <Group justify="space-between">
            <TextInput
              label="Recherche Produits"
              defaultValue={searchValue}
              onChange={(e) => {
                setSearchValue(e.currentTarget.value)
              }}
              rightSection={
                <NativeSelect
                  value={searchFieldName}
                  onChange={(e) => setSearchFieldName(e.currentTarget.value)}
                  data={[
                    { value: 'name', label: 'Nom' },
                    { value: 'barcode', label: 'Barcode' },
                    { value: 'type', label: 'Type' },
                    { value: 'ppv', label: 'PPV' }
                  ]}
                  rightSectionWidth={28}
                  styles={{
                    input: {
                      fontWeight: 500,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      width: rem(95),
                      marginRight: rem(-2)
                    }
                  }}
                />
              }
              rightSectionWidth={95}
            />
            <InputBase
              ref={barcodeInputRef}
              readOnly={!isUsingBarcodeScanner}
              label="Scanner Code Barre"
              onChange={(e) => handleSearchWithBarcode(e.currentTarget.value)}
              leftSection={
                <img src={imgSrc} alt="barcode" height={24} width={24} />
              }
              rightSection={
                <Checkbox
                  onChange={(event) => {
                    toggle()
                    if (barcodeInputRef.current) {
                      if (event.currentTarget.checked) {
                        barcodeInputRef.current.focus()
                        barcodeInputRef.current.select()
                      } else {
                        barcodeInputRef.current.value = ''
                      }
                    }
                  }}
                />
              }
            />
          </Group>
          <ScrollArea h={height / 2}>
            <InventoriesList
              medications={medications}
              onInventoryAdded={handleInventoryAdd}
            />
          </ScrollArea>
        </div>
        <div>
          <Button fullWidth mb="md">
            Equivalents
          </Button>
          <Button fullWidth mb="md">
            Fiche Produit
          </Button>
          <Button fullWidth mb="md">
            D.C.I Famille Thérap.
          </Button>
          <Button fullWidth mb="md">
            Reprendre Vente
          </Button>
          <Button fullWidth>Retour Client</Button>
        </div>
      </Group>
      <Group h={height / 2} align="stretch">
        <ScrollArea h={height / 2} flex="1">
          {saleItemsFields}
        </ScrollArea>
        <div>
          <Group justify="space-between">
            <Text fw="bold">
              Produit: {saleItemsFields.length} | N° Vente: {'saleNumber'}
            </Text>
            <Group wrap="nowrap" gap={10} mt={5}>
              <IconCalendar stroke={1.5} size="1.5rem" />
              <Text fz="sm">{dayjs().format('DD-MM-YYYY')}</Text>
              <IconClock stroke={1.5} size="1.5rem" />
              <Text fz="sm"> {dayjs().format('HH:mm')}</Text>
            </Group>
          </Group>
          <Group my="md" grow>
            <NumberInput
              label="TOTAL VENTE"
              readOnly
              hideControls
              decimalScale={2}
              value={totals.totalPpvNet}
            />
            <NumberInput
              label="DONT REMISE"
              readOnly
              hideControls
              decimalScale={2}
              value={totals.discountedAmount}
            />
          </Group>
          <Group>
            <Button fullWidth type="submit">
              Valider Vente Espèce
            </Button>
            <Button fullWidth>Valider CNSS/CNOPS</Button>
            <Button fullWidth color="yellow">
              Suspendre Vente
            </Button>
          </Group>
        </div>
      </Group>
    </Paper>
  )
}

SaleNewsPage.displayName = 'SaleNewsPage'

function InventoriesList({ medications, onInventoryAdded }) {
  return (
    <Table verticalSpacing="xs" style={{ width: '100%', whiteSpace: 'nowrap' }}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Nom</Table.Th>
          <Table.Th>Barcode</Table.Th>
          <Table.Th>PPV</Table.Th>
          <Table.Th>PPH</Table.Th>
          <Table.Th>Quantité</Table.Th>
          <Table.Th>Péremption</Table.Th>
          <Table.Th ta="center">Action</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {medications.map((medication) => {
          return medication.inventories.map((inventory) => (
            <Table.Tr key={inventory.id}>
              <Table.Td>{medication.name}</Table.Td>
              <Table.Td>{medication.barcode}</Table.Td>
              <Table.Td>{inventory.ppv}</Table.Td>
              <Table.Td>{inventory.pph}</Table.Td>
              <Table.Td>{inventory.quantity}</Table.Td>
              <Table.Td>
                {new Date(inventory.expirationDate).toLocaleDateString()}
              </Table.Td>
              <Table.Td ta="center">
                <ActionIcon
                  size="sm"
                  onClick={() => onInventoryAdded({ medication, inventory })}
                >
                  <IconPlus />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))
        })}
      </Table.Tbody>
    </Table>
  )
}

function SaleItem({ form, saleItem, index, onRemove }) {
  return (
    <Paper
      w={'100%'}
      style={{ whiteSpace: 'nowrap' }}
      withBorder
      px="sm"
      py="xs"
      mb="xs"
    >
      <Group justify="space-between" mb="sm" wrap="nowrap">
        <div>{saleItem.medicationName}</div>
        <ActionIcon
          color="red"
          variant="light"
          size="sm"
          onClick={() => onRemove(index)}
        >
          <IconTrash stroke={1.5} size="1.5rem" />
        </ActionIcon>
      </Group>
      <Group justify="space-between" wrap="nowrap">
        <Group wrap="nowrap">
          {saleItem.isPartialSaleAllowed && (
            <Select
              allowDeselect={false}
              label="Type d'Unité"
              w="80px"
              data={[
                { value: 'box', label: 'Box' },
                { value: 'unit', label: 'Unit' }
              ]}
              {...form.getInputProps(`saleMedications.${index}.saleType`)}
            />
          )}
          <InputBase
            w="50px"
            readOnly
            defaultValue={saleItem.ppv}
            label="PPV"
          />
          <InputBase
            w="50px"
            readOnly
            defaultValue={saleItem.pbr}
            label="PBR"
          />
          <InputBase
            w="80px"
            readOnly
            value={
              saleItem.ppv * form.getValues().saleMedications[index].quantity
            }
            label="Brut PPV"
          />
          <NumberInput
            hideControls
            decimalScale={2}
            w="80px"
            readOnly
            {...form.getInputProps(`saleMedications.${index}.netPrice`)}
            label="NET PPV"
          />
        </Group>
        <Group wrap="nowrap">
          <NumberInput
            w="60px"
            min={0}
            label="Quantité"
            {...form.getInputProps(`saleMedications.${index}.quantity`)}
            onChange={(value) => {
              form.setFieldValue(`saleMedications.${index}.quantity`, value)
              form.setFieldValue(
                `saleMedications.${index}.netPrice`,
                calculateNetPrice(
                  saleItem.ppv,
                  saleItem.discount,
                  saleItem.tva,
                  value
                )
              )
            }}
          />
          <NumberInput
            label="Remise"
            w="60px"
            min={0}
            max={100}
            {...form.getInputProps(`saleMedications.${index}.discount`)}
            onChange={(value) => {
              form.setFieldValue(`saleMedications.${index}.discount`, value)
              form.setFieldValue(
                `saleMedications.${index}.netPrice`,
                calculateNetPrice(
                  saleItem.ppv,
                  saleItem.discount,
                  saleItem.tva,
                  form.getValues().saleMedications[index].quantity
                )
              )
            }}
          />

          <InputBase
            w="50px"
            readOnly
            label="TVA %"
            defaultValue={saleItem.tva}
          />
          <InputBase
            w="60px"
            readOnly
            label="Marge %"
            defaultValue={saleItem.marge}
          />
        </Group>
      </Group>
    </Paper>
  )
}