import {
  useDebouncedCallback,
  useDebouncedState,
  useToggle
} from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  Select,
  Badge,
  Loader,
  Flex
} from '@mantine/core'
import {
  IconCalendar,
  IconClock,
  IconPill,
  IconPlus,
  IconShoppingCartPlus,
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
  totalNetPrices: z.number().nonnegative(),
  totalBrutPrices: z.number().nonnegative(),
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
  const queryClient = useQueryClient()
  const [searchFieldName, setSearchFieldName] = useState('name')
  const [searchValue, setSearchValue] = useDebouncedState('', 500)
  const [isUsingBarcodeScanner, toggle] = useToggle<boolean>([false, true])
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  const { data: medications = [], isLoading } = useMedications({
    searchValue,
    searchFieldName
  })

  const { data: saleNumber = 0 } = useQuery({
    queryKey: ['saleNumber'],
    queryFn: async () => {
      return (await http.get('/api/sales/next')).data
    }
  })

  const form = useForm<Sale>({
    initialValues: {
      totalQuantities: 0,
      discountedAmount: 0,
      totalNetPrices: 0,
      totalBrutPrices: 0,
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
    form.insertListItem('saleMedications', {
      inventoryId: inventory.id,
      quantity: 1,
      netPrice: calculateNetPrice(inventory.ppv, 0, medication.tva, 1),
      brutPrice: inventory.ppv,
      discount: 0,
      saleType: 'Box',
      medicationName: medication.name,
      ppv: inventory.ppv,
      pph: inventory.pph,
      tva: medication.tva,
      pbr: medication.pbr,
      marge: medication.marge,
      isPartialSaleAllowed: medication.isPartialSaleAllowed,
      unitPrice: medication.unitPrice
    })
  }

  const { mutateAsync: createSale, isPending: isCreateSalePending } =
    useMutation({
      mutationFn: async (data: any) => {
        await http.post('/api/sales', data)
      }
    })

  const handleSubmit = async (status) => {
    const validationResult = form.validate()
    if (!validationResult.hasErrors) {
      const data = form.getValues()
      await createSale(
        { status, ...(status === 'Paid' && { paymentType: 'Cash' }), ...data },
        {
          onSuccess: () => {
            form.reset()
            toast.success('La vente a été enregistrée avec succès.')
            queryClient.invalidateQueries({
              queryKey: ['medications']
            })
          },
          onError: () => {
            toast.error("Quelque chose de grave s'est produit.")
          }
        }
      )
    }
  }

  const totals = useMemo(() => {
    const saleItems = form.getValues().saleMedications

    return saleItems.reduce(
      (acc, item) => {
        const { ppv, tva, quantity, discount, saleType, unitPrice } = item
        console.log({ item })
        const priceBeforeDiscount = ppv * (1 + tva / 100) * quantity
        const priceAfterDiscount = calculateNetPrice(
          ppv,
          discount,
          tva,
          quantity
        )
        const discountedAmount = priceBeforeDiscount - priceAfterDiscount

        acc.totalQuantities += quantity

        if (saleType === 'Box') {
          acc.totalBrutPrices += priceBeforeDiscount
          acc.totalNetPrices += priceAfterDiscount
        } else {
          acc.totalBrutPrices += unitPrice * quantity
          acc.totalNetPrices += unitPrice * quantity
        }

        acc.discountedAmount += discountedAmount
        return acc
      },
      {
        totalQuantities: 0,
        discountedAmount: 0,
        totalBrutPrices: 0,
        totalNetPrices: 0
      }
    )
  }, [form.getValues().saleMedications])

  useEffect(() => {
    form.setValues({
      totalQuantities: totals.totalQuantities,
      discountedAmount: totals.discountedAmount,
      totalBrutPrices: totals.totalBrutPrices,
      totalNetPrices: totals.totalNetPrices
    })
  }, [totals])

  const saleItemsFields = form
    .getInputProps('saleMedications')
    .value.map((item, index) => (
      <SaleItem
        key={item.inventoryId}
        saleItem={item}
        form={form}
        index={index}
        onRemove={handleRemoveProduct}
      />
    ))

  return (
    <>
      <Group
        h="calc((100vh - 1rem - var(--app-portal-padding)) / 2)"
        align="stretch"
      >
        <div style={{ height: '100%', flex: 1 }}>
          <Group mb="md" align="center">
            <TextInput
              mb="xs"
              w="500px"
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
            {isLoading && <Loader size="sm" mt="lg" />}
          </Group>

          <ScrollArea h="100%">
            <InventoriesList
              medications={medications}
              onInventoryAdded={handleInventoryAdd}
            />
          </ScrollArea>
        </div>
        <div>
          <InputBase
            mb="md"
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
      <Group
        h="calc((100vh - 1rem - var(--app-portal-padding)) / 2)"
        align="stretch"
      >
        <ScrollArea h="100%" flex="1">
          {saleItemsFields.length > 0 ? (
            saleItemsFields
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              <IconShoppingCartPlus
                style={{ width: rem(80), height: rem(80), textAlign: 'center' }}
                stroke={1.5}
                color={
                  form.errors?.saleMedications
                    ? 'var(--mantine-color-red-9)'
                    : 'var(--mantine-color-gray-9)'
                }
              />
              <Text
                size="xl"
                ta="center"
                c={form.errors?.saleMedications ? 'red.9' : 'gray.9'}
              >
                Aucun produit n'est sélectionné
              </Text>
            </div>
          )}
        </ScrollArea>
        <div>
          <Group justify="space-between">
            <Text fw="bold">
              Produit: {saleItemsFields.length} | N° Vente: {saleNumber}
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
              value={totals.totalNetPrices}
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
            <Button
              loading={isCreateSalePending}
              fullWidth
              type="submit"
              onClick={() => handleSubmit('Paid')}
            >
              Valider Vente Espèce
            </Button>
            <Button fullWidth loading={isCreateSalePending}>
              Valider CNSS/CNOPS
            </Button>
            <Button
              loading={isCreateSalePending}
              fullWidth
              color="yellow"
              onClick={() => handleSubmit('Pending')}
            >
              Suspendre Vente
            </Button>
          </Group>
        </div>
      </Group>
    </>
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
          <Table.Th>Quantité</Table.Th>
          <Table.Th>Prix Unit</Table.Th>
          <Table.Th>Unités Par Boîte</Table.Th>
          <Table.Th>PPH</Table.Th>
          <Table.Th>Péremption</Table.Th>
          <Table.Th ta="center">Action</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {medications.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={9}>
              <Flex direction="column" justify="center" align="center">
                <IconPill
                  style={{
                    width: rem(80),
                    height: rem(80),
                    textAlign: 'center'
                  }}
                  stroke={1.5}
                />
                <Text fz="xl" c="gray.9" ta="center">
                  Aucun donnée
                </Text>
              </Flex>
            </Table.Td>
          </Table.Tr>
        ) : (
          medications.map((medication) => {
            return medication.inventories.map((inventory) => (
              <Table.Tr key={inventory.id}>
                <Table.Td>{medication.name}</Table.Td>
                <Table.Td>{medication.barcode}</Table.Td>
                <Table.Td>{inventory.ppv}</Table.Td>
                <Table.Td
                  fw="bold"
                  c={inventory.boxQuantity < 0 ? 'red.9' : 'green.9'}
                >
                  {inventory.boxQuantity}
                </Table.Td>
                <Table.Td>
                  {medication.isPartialSaleAllowed ? (
                    medication.unitPrice
                  ) : (
                    <Badge color="red">N/A</Badge>
                  )}
                </Table.Td>
                <Table.Td
                  fw="bold"
                  c={inventory.unitQuantity < 0 ? 'red.9' : 'green.9'}
                >
                  {medication.isPartialSaleAllowed ? (
                    inventory.unitQuantity
                  ) : (
                    <Badge color="red">N/A</Badge>
                  )}
                </Table.Td>
                <Table.Td>{inventory.pph}</Table.Td>
                <Table.Td>
                  {new Date(inventory.expirationDate).toLocaleDateString()}
                  {new Date(inventory.expirationDate) < new Date() && (
                    <Badge color="red" ml="sm">
                      périmé
                    </Badge>
                  )}
                </Table.Td>
                <Table.Td ta="center">
                  <ActionIcon
                    disabled={new Date(inventory.expirationDate) < new Date()}
                    size="sm"
                    onClick={() => onInventoryAdded({ medication, inventory })}
                  >
                    <IconPlus />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))
          })
        )}
      </Table.Tbody>
    </Table>
  )
}

interface SaleItemProps {
  form: any
  saleItem: {
    medicationName: string
    isPartialSaleAllowed: boolean
    ppv: number
    unitPrice: number
    pbr: number
    tva: number
    marge: number
    discount: number
  }
  index: number
  onRemove: (saleItemIndex: number) => void
}

const SaleItem = memo(({ form, saleItem, index, onRemove }: SaleItemProps) => {
  const {
    medicationName,
    isPartialSaleAllowed,
    ppv,
    unitPrice,
    pbr,
    tva,
    marge,
    discount
  } = saleItem

  const { saleType, quantity } = form.getValues().saleMedications[index]

  const handleQuantityChange = useCallback((value: number) => {
    form.setFieldValue(`saleMedications.${index}.quantity`, value)
    form.setFieldValue(
      `saleMedications.${index}.netPrice`,
      saleType === 'Box'
        ? calculateNetPrice(ppv, discount, tva, value)
        : unitPrice * value
    )
  }, [])

  const handleDiscountChange = useCallback((value) => {
    form.setFieldValue(`saleMedications.${index}.discount`, value)
    form.setFieldValue(
      `saleMedications.${index}.netPrice`,
      calculateNetPrice(ppv, value, tva, quantity)
    )
  }, [])

  const price = saleType === 'Box' ? ppv : unitPrice
  const label = saleType === 'Box' ? 'PPV' : 'Prix Unité'
  const brutPpv = quantity * price

  return (
    <Paper
      w="100%"
      style={{ whiteSpace: 'nowrap' }}
      withBorder
      px="sm"
      py="xs"
      mb="xs"
    >
      <Group justify="space-between" mb="sm" wrap="nowrap">
        <div>{medicationName}</div>
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
          {isPartialSaleAllowed && (
            <Select
              allowDeselect={false}
              label="Type d'Unité"
              w="80px"
              data={[
                { value: 'Box', label: 'Box' },
                { value: 'Unit', label: 'Unit' }
              ]}
              {...form.getInputProps(`saleMedications.${index}.saleType`)}
            />
          )}
          <InputBase w="70px" readOnly value={price} label={label} />
          <InputBase w="50px" readOnly defaultValue={pbr} label="PBR" />
          <InputBase w="80px" readOnly value={brutPpv} label="Brut PPV" />
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
            onChange={handleQuantityChange}
          />
          {saleType === 'Box' && (
            <>
              <NumberInput
                label="Remise"
                w="60px"
                min={0}
                max={100}
                {...form.getInputProps(`saleMedications.${index}.discount`)}
                onChange={handleDiscountChange}
              />
              <InputBase w="50px" readOnly label="TVA %" defaultValue={tva} />
              <InputBase
                w="60px"
                readOnly
                label="Marge %"
                defaultValue={marge}
              />
            </>
          )}
        </Group>
      </Group>
    </Paper>
  )
})
