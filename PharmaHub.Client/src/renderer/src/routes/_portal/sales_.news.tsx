import {
  useDebouncedCallback,
  useDebouncedState,
  useResizeObserver,
  useToggle
} from '@mantine/hooks'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  NumberInput,
  Checkbox,
  Switch
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
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFzklEQVR4nO2ceWwVRRzHBxGjCURN1BgNJviHEukrIh5/eBDU/kEUIt3dVAgKEWw4uvPoK69zPGQFOSxCd4AitrstiiZqY0QTIxiCryBe0URRo2JIxCOAeBANh7xCx2wDRPA1BXf2ze6b+SS/v5o0+53PXLszLQAajUaj0Wg0Go1Go9FoNBrN2XA+ALsewcz/FTOfq1yIeT8GbeE4zgUl6yiI+WnZwXHcyvVgKQXskh6YxauQ639TMgGYeYdkB8ZxK9c7XjIBvfOe7MAsflUyAdj13pMdFqssADHvJdlhscoCTm5BpQfGqgpAzf4DssNilQXkVnQMlR0WqywgADP/F9mBseICOmUHxioLQK43S3ZgrLIAsrp1uOzAWGUBAcj19sgOjVUWgF1/mezQWMVvQadAKztS0oOz2NTXJRfQK8H1d8YgPJddxPUflyOAefWyw2OZ5XrfYebPBLLINvlDEPMOSm8IFm01um28vmktn/OUy2csaDpEWEcVWdV+JYgDyPWeLKMezRueWcfrlqzitc5yPg0v4ZMyDjfTOW5CerosiEeDuOC0tAxGzN8rvfHY+VW2uY2nn27hsxe5fPoTTXxK4yJupeef0dB9lWFTBOIEZr4lu0FxH0VYG8+cnj6W80fxYl6TWXBODd13kS0gbiDX2yCzoRHzTyxrYUc3rMd888u1/LM3qvnezWP4sXwl3/3mnbzRmR2y0c8YAUemTnUuBnHCcTovwszfWpIGd/0/EPN3YNdvDa7JINZ+VzAV8k9HD+rOp1Z1d6X42XXk3ZG8pXmKOAmQ3AfihuOuvwwzb4u4Xu0dRMz7ADGvLbh7g5rb7s2saL2iv+codFU0FPKpnmIi2lc/LErAUhBHaltbB2HmL0Sud/R8ezTqbej2uY3Mq6Irn782zHMU8qlsMQGFfCVfsnS6AAnkExBnEGu9Drn+fMS8j5Dr78euX8Cutw8xfztm/nNBj8bN7fdn1/jXRPUMhXzFC8UkHNh8G582b17IdYCcmJRx+h2NSsPzNw0udFX8XEzC620PhR4Flk1M2Rljz7FtI6YXE/DXllv4Iw3ZcBJssk52vtjDO62BfY2ClcunhV2Id8vOlwi6u1Jrigl4u2N8+GmoLjdMdr7Y092VGldMwK6Nd4ffjqaJnE/RSeLvfMXwYgL2b7o9vACbvCI7X+zhO24cUkzA4a0jBbwP0N9K+hcySaU7OgHcsNEo2fliT6Gr4qf/vJBtulWIABOSRtn5ErEQF86SsPO1sYIE0Hdk50skJiQNZft5OgmYNtkmaATwapuMlZ0nUVh1uWEGpMdFCTAgWSw7U6IwbLJWVOOfXIg/lJ0pURiQHhAqwCbdVi26VHauxGAK7f2n1gE6XnauxGBC2iNagGFTJjtXYjBt8pXwUWDTL2XnSgyGjUZFIKHHmj3vatnZksSAYP9u2nRjcMYrQoIFyeRIn7hq8gz+74r651V91Pn+3v4I7nuKGBGGTX0QJeUqIGDyLHy5AckXIQV8D6KknAUEGJBUhp2Oqufi60FUlLuAAAOSt8KtA7QWRIUKAkyb2LE9plRBgBUsyGEEQHog2GGBKFBBQE0mNzT0bgiSShAFKgiw6usvCf8+QOtAFKggYIzjXBhWgAnpqyAKVBAwIZsdEn4KovtAFKggYOJM5yoBI4DXzME3ANGoIMBK05tFCDBtOgOIRg0BeIIIAQakG4BoVBBgQLpQyAiAZA8QjQoCTEi3ixkB5E8gmnIXUJPJDRV1NmDYRPy/sSl3ASakjpjpp3cRfhGIRgEBn4sSYNTRcUA05S+AHBY0/39sWdZAIJpyF2DY9JCA3c9hY+78ESAKyl4AJFvD7nyq07l7QFSUvYA0vuP/X9ol70+EpAJESbkLCDAgftCwye/n2PA9wTX3k9dRojmEUU3AqS+iwTf94HzYsOkPwdRi2HS/YZNvTUh3GJA+a9j0sUgP4DUajUaj0Wg0Go1Go9FoNKAc+QdlRPP7gLYvZwAAAABJRU5ErkJggg=='

const calculateNetPrice = (ppv, discount, tva, quantity) => {
  const priceBeforeDiscount = ppv * (1 + tva / 100) * quantity
  return priceBeforeDiscount * (1 - discount / 100)
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
  const [searchFieldName, setSearchFieldName] = useState('name')
  const [searchValue, setSearchValue] = useDebouncedState('', 500)
  const [isUsingBarcodeScanner, toggle] = useToggle<boolean>([false, true])
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  const [selectedSaleItems, setSelectedSaleItems] = useState<any>([])
  const [totals, setTotals] = useState({
    totalQuantity: 0,
    discountedPrice: 0,
    totalPrice: 0
  })
  const { data: medications = [] } = useMedications({
    searchValue,
    searchFieldName
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

  const handleSearchWithBarcode = useDebouncedCallback(
    async (query: string) => {
      const { inventories, ...medication } = (
        await http.get('/api/medicaments/search', {
          params: {
            field: 'barcode',
            query
          }
        })
      ).data.data[0]
      if (inventories.length === 1) {
        const inventory = inventories[0]
        const existingItemIndex = selectedSaleItems.findIndex(
          (item) => item.inventory.id === inventory.id
        )
        if (existingItemIndex !== -1) {
          setSelectedSaleItems((prev) => {
            return prev.map((item, index) => {
              if (index === existingItemIndex) {
                form.setFieldValue(
                  `saleMedications.${index}.quantity`,
                  item.quantity + 1
                )
                return {
                  ...item,
                  quantity: item.quantity + 1
                }
              }
              return item
            })
          })
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
                D'accord
              </Button>
            </>
          )
        })
        setSearchFieldName('barcode')
        setSearchValue(query)
      }
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus()
        barcodeInputRef.current.select()
      }
    },
    500
  )

  const handleInventoryAdd = ({ medication, inventory }) => {
    // if (!isAdded(inventory.id)) {
    setSelectedSaleItems((prev) => [
      ...prev,
      { medication, inventory, quantity: 1 }
    ])
    form.insertListItem('saleMedications', {
      inventoryId: inventory.id,
      quantity: 1,
      netPrice: calculateNetPrice(inventory.ppv, 0, medication.tva, 1),
      discount: 0
    })
    // }
  }

  return (
    <Paper withBorder px="md" py="xs" radius="md">
      <Grid h="95vh">
        <Grid.Col span={6}>
          <Group justify="space-between">
            <TextInput
              w="300px"
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
            <Group>
              <InputBase
                ref={barcodeInputRef}
                label="code barre"
                onChange={(e) => handleSearchWithBarcode(e.currentTarget.value)}
              />
              <ActionIcon
                mt="md"
                color="orange"
                size="50px"
                radius="100%"
                variant={!isUsingBarcodeScanner ? 'default' : 'light'}
                onClick={() => {
                  if (barcodeInputRef.current) {
                    barcodeInputRef.current.focus()
                  }
                  toggle()
                }}
              >
                <img height={40} width={40} src={imgSrc} />
              </ActionIcon>
            </Group>
          </Group>
          <ScrollArea>
            <InventoriesList
              medications={medications}
              onInventoryAdded={handleInventoryAdd}
            />
          </ScrollArea>
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
                Produit: {selectedSaleItems.length} | N° Vente: {'saleNumber'}
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
                // onClick={async (e) => {
                //   e.preventDefault()
                //   await handleSubmit('Paid')
                // }}
              >
                Valider Vente Espèce
              </Button>
              <Button fullWidth>Valider CNSS/CNOPS</Button>
              <Button
                fullWidth
                color="yellow"
                // onClick={async (e) => {
                //   e.preventDefault()
                //   await handleSubmit('Pending')
                // }}
              >
                Suspendre Vente
              </Button>
            </Group>
            <ScrollArea my="md">
              {selectedSaleItems.length > 0 ? (
                selectedSaleItems.map((saleItem, index) => (
                  <SaleItem
                    key={saleItem.inventory.id}
                    saleItem={saleItem}
                    form={form}
                    index={index}
                    removeItem={() => {}}
                  />
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
      <pre>{JSON.stringify(selectedSaleItems, null, 2)}</pre>
      <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
    </Paper>
  )
}

SaleNewsPage.displayName = 'SaleNewsPage'

function InventoriesList({ medications, onInventoryAdded }) {
  return (
    <Table verticalSpacing="lg" style={{ width: '100%', whiteSpace: 'nowrap' }}>
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
            <Table.Tr key={inventory.id}>
              <Table.Td>{medication.name}</Table.Td>
              <Table.Td>{medication.barcode}</Table.Td>
              <Table.Td>{inventory.ppv}</Table.Td>
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

function SaleItem({ form, saleItem, index, removeItem }) {
  return (
    <Paper
      w={'100%'}
      style={{ whiteSpace: 'nowrap' }}
      withBorder
      px="sm"
      py="xs"
      mb="md"
    >
      <Group justify="space-between" mb="sm" wrap="nowrap">
        <div>{saleItem.medication.name}</div>
        <ActionIcon
          color="red"
          variant="light"
          size="sm"
          // onClick={() => removeItem(saleItem.inventory.id, index)}
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
            {...form.getInputProps(`saleMedications.${index}.netPrice`)}
            label="NET PPV"
          />
        </Group>
        <Group wrap="nowrap">
          <NumberInput
            w="60px"
            min={0}
            defaultValue={1}
            label="Quantité"
            {...form.getInputProps(`saleMedications.${index}.quantity`)}
            onBlur={(event) => {
              form.setFieldValue(
                `saleMedications.${index}.netPrice`,
                calculateNetPrice(
                  saleItem.inventory.ppv,
                  form.getValues().saleMedications[index].discount,
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
            {...form.getInputProps(`saleMedications.${index}.discount`)}
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
  )
}
