import { useDebouncedState, useResizeObserver } from '@mantine/hooks'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMedications } from './credit-notes.new'
import {
  Box,
  TextInput,
  NativeSelect,
  rem,
  ScrollArea,
  ActionIcon,
  Table,
  SimpleGrid,
  Grid,
  Divider,
  Button,
  Flex,
  InputBase,
  Group,
  Paper,
  Text,
  NumberInput
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

export const Route = createFileRoute('/_portal/sales/news')({
  component: SaleNewsPage
})

function calculateNetPrice(ppv, discountRate, tva, quantity) {
  return ppv * (1 - discountRate / 100) * (1 + tva / 100) * quantity
}

// const SaleMedicamentSchema =

const SaleSchema = z.object({
  totalQuantity: z.number().nonnegative(),
  discountedPrice: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  saleMedications: z
    .array(
      z.object({
        inventoryId: z.number(),
        netPrice: z.number(),
        quantity: z.number(),
        discount: z.number()
      })
    )
    .default([])
    .refine((data) => data.length > 0, { message: 'Required' })
})

type Sale = z.infer<typeof SaleSchema>

function SaleNewsPage() {
  const queryClient = useQueryClient()
  const [ref, { height }] = useResizeObserver()
  const [searchFieldName, setSearchFieldName] = useState('name')
  const [searchValue, setSearchValue] = useDebouncedState('', 1000)
  const [selectedMedicationRow, setSelectedMedicationRow] = useState(null)
  const [totals, setTotals] = useState({
    totalQuantity: 0,
    discountedPrice: 0,
    totalPrice: 0
  })
  const [selectedSaleItems, setSelectedSaleItems] = useState<any>([])

  const { data: medications = [] } = useMedications({
    searchValue,
    searchFieldName
  })

  const handleRowClick = (inventoryId) => {
    if (selectedMedicationRow === inventoryId) setSelectedMedicationRow(null)
    else setSelectedMedicationRow(inventoryId)
  }

  const isAdded = (key) => {
    return selectedSaleItems.some((item) => item.inventory.id === key)
  }

  const removeItem = (key, index) => {
    setSelectedSaleItems((prev) =>
      prev.filter((item) => item.inventory.id !== key)
    )
    form.removeListItem('saleMedications', index)
  }

  const { data: saleNumber = 0 } = useQuery({
    queryKey: ['saleNumber'],
    queryFn: async () => {
      return (await http.get('/api/sales/next')).data
    }
  })

  const form = useForm<Sale>({
    initialValues: {
      totalQuantity: 0,
      discountedPrice: 0,
      totalPrice: 0,
      saleMedications: []
    },
    validate: zodResolver(SaleSchema)
  })

  useEffect(() => {
    const saleMedications = form.getValues().saleMedications

    const totals = selectedSaleItems.reduce(
      (acc, item, index) => {
        const saleItemQuantity = saleMedications[index]?.quantity || 0
        const discountRate = saleMedications[index]?.discount || 0
        const ppv = item.inventory.ppv
        const tva = item.medication.tva

        const priceBeforeDiscount = ppv * (1 + tva / 100) * saleItemQuantity
        const priceAfterDiscount =
          priceBeforeDiscount * (1 - discountRate / 100)
        const discountedAmount = priceBeforeDiscount - priceAfterDiscount

        acc.totalQuantities += saleItemQuantity
        acc.totalPpvBrut += priceBeforeDiscount
        acc.totalPpvNet += priceAfterDiscount
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

    setTotals({
      totalPrice: totals.totalPpvNet,
      totalQuantity: totals.totalQuantities,
      discountedPrice: totals.discountedAmount
    })
  }, [selectedSaleItems, form.getValues().saleMedications])

  const { mutateAsync: createSale } = useMutation({
    mutationFn: async (data: any) => {
      await http.post('/api/sales', data)
    }
  })

  const handleSubmit = async (status) => {
    const validationResult = form.validate()
    console.log({ validationResult })
    if (!validationResult.hasErrors) {
      const data = form.getValues()
      await createSale(
        {
          status,
          ...data
        },
        {
          onSuccess: () => {
            setSelectedSaleItems([])
            form.reset()
            toast.success('La vente a été enregistre avec succès.')
            queryClient.invalidateQueries()
          },
          onError: () => {
            toast.error("Quelque chose de grave s'est produit.")
          }
        }
      )
    }
  }
  return (
    <Paper withBorder px="md" py="xs" radius="md">
      <Grid h="95vh" ref={ref}>
        <Grid.Col span={6}>
          <TextInput
            w="300px"
            label="Recherche Produits"
            defaultValue={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
          <Divider my="md" />
          <ScrollArea h={height - 212}>
            <Table verticalSpacing="lg">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nom</Table.Th>
                  <Table.Th>Barcode</Table.Th>
                  <Table.Th>PPV</Table.Th>
                  <Table.Th>Quantité</Table.Th>
                  <Table.Th>Péremption</Table.Th>
                  <Table.Th ta="center">Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {medications.map((medication) => {
                  return medication.inventories.map((inventory) => (
                    <Table.Tr
                      key={inventory.id}
                      // onClick={(e) => handleRowClick(inventory.id)}
                      style={{
                        backgroundColor:
                          selectedMedicationRow === inventory.id
                            ? 'rgba(0, 123, 255, 0.1)'
                            : 'transparent'
                      }}
                    >
                      <Table.Td>{medication.name}</Table.Td>
                      <Table.Td>{medication.barcode}</Table.Td>
                      <Table.Td>{inventory.ppv}</Table.Td>
                      <Table.Td>{inventory.quantity}</Table.Td>
                      <Table.Td>
                        {new Date(
                          inventory.expirationDate
                        ).toLocaleDateString()}
                      </Table.Td>
                      <Table.Td ta="center">
                        <ActionIcon
                          size="sm"
                          onClick={(e) => {
                            // e.stopPropagation()
                            if (!isAdded(inventory.id)) {
                              setSelectedSaleItems((prev) => [
                                ...prev,
                                { medication, inventory }
                              ])
                              form.insertListItem('saleMedications', {
                                inventoryId: inventory.id,
                                quantity: 1,
                                netPrice: calculateNetPrice(
                                  inventory.ppv,
                                  0,
                                  medication.tva,
                                  1
                                ),
                                discount: 0
                              })
                            }
                          }}
                        >
                          <IconPlus />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))
                })}
              </Table.Tbody>
            </Table>
          </ScrollArea>
          <SimpleGrid
            cols={{ base: 1, sm: 4 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
          >
            <Button fullWidth>Equivalents</Button>
            <Button fullWidth>Fiche Produit</Button>
            <Button fullWidth>D.C.I Famille Thérap.</Button>
            <Button fullWidth>Reprendre Vente</Button>
            <Button fullWidth>Suspendre Vente</Button>
            <Button fullWidth>Retour Client</Button>
            <Button fullWidth color="red">
              Annuler Vente
            </Button>
          </SimpleGrid>
        </Grid.Col>
        <Grid.Col span={6}>
          <form
          // onSubmit={form.onSubmit(
          //   async (values) => await createSale(values, {})
          // )}
          >
            <Group mb="md" grow>
              <NumberInput
                label="TOTAL VENTE"
                readOnly
                hideControls
                decimalScale={2}
                value={totals.totalPrice}
              />
              <NumberInput
                label="DONT REMISE"
                readOnly
                hideControls
                decimalScale={2}
                value={totals.discountedPrice}
              />
            </Group>
            <Group
              wrap="nowrap"
              gap={10}
              mt={5}
              align="center"
              justify="space-between"
            >
              <Text fw="bold">
                Produit: {selectedSaleItems.length} | N° Vente: {saleNumber}
              </Text>
              <Group wrap="nowrap" gap={10} mt={5}>
                <IconCalendar stroke={1.5} size="1.5rem" />
                <Text fz="sm">{dayjs().format('DD-MM-YYYY')}</Text>
                <IconClock stroke={1.5} size="1.5rem" />
                <Text fz="sm"> {dayjs().format('HH:mm')}</Text>
              </Group>
            </Group>
            <Group my="md" grow>
              <Button
                fullWidth
                type="submit"
                onClick={async (e) => {
                  e.preventDefault()
                  await handleSubmit('Paid')
                }}
              >
                Valider Vente Espèce
              </Button>
              <Button fullWidth>Valider CNSS/CNOPS</Button>
              <Button
                fullWidth
                color="yellow"
                onClick={async (e) => {
                  e.preventDefault()
                  await handleSubmit('Pending')
                }}
              >
                Suspendre Vente
              </Button>
            </Group>
            <ScrollArea my="md" h={height - 212}>
              {selectedSaleItems.length > 0 ? (
                selectedSaleItems.map((saleItem, index) => (
                  <Paper
                    w={'100%'}
                    style={{ whiteSpace: 'nowrap' }}
                    withBorder
                    px="sm"
                    py="xs"
                    mb="md"
                    key={saleItem.inventory.id}
                  >
                    <Group justify="space-between" mb="sm" wrap="nowrap">
                      <div>{saleItem.medication.name}</div>
                      <ActionIcon
                        color="red"
                        variant="light"
                        size="sm"
                        onClick={() => removeItem(saleItem.inventory.id, index)}
                      >
                        <IconTrash stroke={1.5} size="1.5rem" />
                      </ActionIcon>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                      <Group wrap="nowrap">
                        <InputBase
                          w="50px"
                          readOnly
                          defaultValue={saleItem.inventory.ppv}
                          label="PPV"
                        />
                        <InputBase
                          w="50px"
                          readOnly
                          defaultValue={saleItem.medication.pbr}
                          label="PBR"
                        />
                        <InputBase
                          w="80px"
                          readOnly
                          value={
                            saleItem.inventory.ppv *
                            form.getValues().saleMedications[index].quantity
                          }
                          label="Brut PPV"
                        />
                        <NumberInput
                          hideControls
                          decimalScale={2}
                          w="80px"
                          readOnly
                          {...form.getInputProps(
                            `saleMedications.${index}.netPrice`
                          )}
                          label="NET PPV"
                        />
                      </Group>
                      <Group wrap="nowrap">
                        <NumberInput
                          w="60px"
                          min={0}
                          defaultValue={1}
                          label="Quantité"
                          {...form.getInputProps(
                            `saleMedications.${index}.quantity`
                          )}
                          onBlur={(event) => {
                            form.setFieldValue(
                              `saleMedications.${index}.netPrice`,
                              calculateNetPrice(
                                saleItem.inventory.ppv,
                                form.getValues().saleMedications[index]
                                  .discount,
                                saleItem.medication.tva,
                                Number(event.target.value)
                              )
                            )
                          }}
                        />
                        <NumberInput
                          w="60px"
                          min={0}
                          max={100}
                          defaultValue={0}
                          label="Remise"
                          {...form.getInputProps(
                            `saleMedications.${index}.discount`
                          )}
                          onBlur={(event) => {
                            form.setFieldValue(
                              `saleMedications.${index}.netPrice`,
                              calculateNetPrice(
                                saleItem.inventory.ppv,
                                Number(event.target.value),
                                saleItem.medication.tva,
                                form.getValues().saleMedications[index].quantity
                              )
                            )
                          }}
                        />

                        <InputBase
                          w="50px"
                          readOnly
                          label="TVA %"
                          defaultValue={saleItem.medication.tva}
                        />
                        <InputBase
                          w="60px"
                          readOnly
                          label="Marge %"
                          defaultValue={saleItem.medication.marge}
                        />
                      </Group>
                    </Group>
                  </Paper>
                ))
              ) : (
                <Text
                  size="xl"
                  ta="center"
                  c={form.errors?.saleMedications ? 'red' : 'gray'}
                >
                  Aucun produit n'est sélectionné
                </Text>
              )}
            </ScrollArea>
          </form>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

SaleNewsPage.displayName = 'SaleNewsPage'
