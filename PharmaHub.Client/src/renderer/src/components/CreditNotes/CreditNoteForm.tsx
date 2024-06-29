import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Input,
  InputBase,
  NativeSelect,
  NumberInput,
  ScrollArea,
  Select,
  Table,
  Text,
  TextInput,
  rem
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDebouncedState } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { useMedications } from '@renderer/services/medicaments.service'
import { userSuppliers } from '@renderer/services/suppliers.service'
import { http } from '@renderer/utils/http'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { memo, useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

const InventoryTable = memo(
  ({ data, handleAddInventory }: { data: any[]; handleAddInventory: any }) => (
    <ScrollArea h={200}>
      <Table>
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
          {data.map((medication) =>
            medication.inventories.map((inventory) => (
              <Table.Tr key={inventory.id}>
                <Table.Td>{medication.name}</Table.Td>
                <Table.Td>{medication.barcode}</Table.Td>
                <Table.Td>{inventory.ppv}</Table.Td>
                <Table.Td>{inventory.boxQuantity}</Table.Td>
                <Table.Td>
                  {new Date(inventory.expirationDate).toLocaleDateString()}
                </Table.Td>
                <Table.Td ta="center">
                  <ActionIcon
                    disabled={inventory.boxQuantity <= 0}
                    size="sm"
                    onClick={() =>
                      handleAddInventory({ medication, inventory })
                    }
                  >
                    <IconPlus />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  )
)

const SelectedInventoriesTable = memo(
  ({
    inventories,
    form,
    handleRemoveInventory
  }: {
    inventories: any[]
    form: any
    handleRemoveInventory: any
  }) => (
    <ScrollArea h={200}>
      <Table style={{ whiteSpace: 'nowrap' }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nom</Table.Th>
            <Table.Th>Barcode</Table.Th>
            <Table.Th>PPV</Table.Th>
            <Table.Th>Quantité Emission</Table.Th>
            <Table.Th>Total PPV</Table.Th>
            <Table.Th>Total PPH</Table.Th>
            <Table.Th>Péremption</Table.Th>
            <Table.Th>Motif</Table.Th>
            <Table.Th ta="center">Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {inventories.map((inventory, index) => (
            <Table.Tr key={inventory.id}>
              <Table.Td>{inventory.name}</Table.Td>
              <Table.Td>{inventory.barcode}</Table.Td>
              <Table.Td>{inventory.ppv}</Table.Td>
              <Table.Td>
                <NumberInput
                  max={inventory.boxQuantity}
                  min={1}
                  {...form.getInputProps(
                    `creditNoteMedications.${index}.IssuedQuantity`
                  )}
                />
              </Table.Td>
              <Table.Td>
                {(
                  form.getInputProps(
                    `creditNoteMedications.${index}.IssuedQuantity`
                  ).value * inventory.ppv
                ).toFixed(2)}
              </Table.Td>
              <Table.Td>
                {(
                  form.getInputProps(
                    `creditNoteMedications.${index}.IssuedQuantity`
                  ).value * inventory.pph
                ).toFixed(2)}
              </Table.Td>
              <Table.Td>
                {new Date(inventory.expirationDate).toLocaleDateString()}
              </Table.Td>
              <Table.Td>
                <Input
                  w="250px"
                  {...form.getInputProps(
                    `creditNoteMedications.${index}.motif`
                  )}
                />
              </Table.Td>
              <Table.Td ta="center">
                <ActionIcon
                  variant="light"
                  color="red"
                  size="sm"
                  onClick={() => handleRemoveInventory(inventory.id)}
                >
                  <IconTrash />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  )
)

function CreditNoteForm() {
  const queryClient = useQueryClient()
  const [isCreditNoteValidated, setIsCreditNoteValidated] = useState(false)
  const [searchFieldName, setSearchFieldName] = useState('name')
  const [searchValue, setSearchValue] = useDebouncedState('', 1000)
  const [selectedInventories, setSelectedInventories] = useState<any[]>([])

  const form = useForm({
    initialValues: {
      creditNoteId: 0,
      supplierId: '',
      creditNoteDate: new Date(),
      creditNoteNumber: '',
      creditNoteMedications: []
    }
  })

  const { data = [] } = useMedications({ searchValue, searchFieldName })
  const { data: suppliers = [] } = userSuppliers()
  const suppliersMemo = useMemo(
    () => suppliers.map((s) => ({ value: s.id.toString(), label: s.name })),
    [suppliers]
  )

  const handleAddInventory = useCallback(
    ({ medication, inventory }) => {
      if (selectedInventories.some((i) => i.inventoryId === inventory.id))
        return

      setSelectedInventories((prev) => [
        ...prev,
        {
          ...inventory,
          name: medication.name,
          barcode: medication.barcode,
          IssuedQuantity: 1
        }
      ])

      form.insertListItem('creditNoteMedications', {
        inventoryId: inventory.id,
        IssuedQuantity: 1,
        motif: ''
      })
    },
    [selectedInventories, form]
  )

  const handleRemoveInventory = useCallback((inventoryId) => {
    setSelectedInventories((prev) =>
      prev.filter((i) => i.inventoryId !== inventoryId)
    )
  }, [])

  const { refetch } = useQuery({
    queryKey: ['existed-credit-notes', form.getValues().creditNoteNumber],
    queryFn: async () => {
      const response = await http.get('/api/credit-notes/search', {
        params: { creditNoteNumber: form.getValues().creditNoteNumber }
      })

      if (response.status === 200) {
        const { data } = response
        setIsCreditNoteValidated(true)
        modals.openConfirmModal({
          title: 'Message de Confirmation',
          children: (
            <Text>
              Un avoir avec ce numéro {form.getValues().creditNoteNumber} est
              déjà validée. Souhaitez-vous la modifier ?
            </Text>
          ),
          labels: { confirm: 'Oui', cancel: 'Non' },
          onCancel: () => form.setFieldValue('creditNoteNumber', ''),
          onConfirm: () => {
            setSelectedInventories(
              data.creditNoteMedications.map((item) => ({
                key: `${data.id}-${item.inventory.id}`,
                creditNoteId: data.id,
                inventoryId: item.inventory.id,
                IssuedQuantity: item.IssuedQuantity,
                name: item.inventory.medication.name,
                barcode: item.inventory.medication.barcode,
                id: item.inventory.id,
                ppv: item.inventory.ppv,
                pph: item.inventory.pph,
                boxQuantity: item.inventory.boxQuantity,
                expirationDate: item.inventory.expirationDate
              }))
            )
            form.setValues({
              creditNoteId: data.id.toString(),
              supplierId: data.supplier.id.toString(),
              creditNoteNumber: data.creditNoteNumber.toString(),
              creditNoteDate: new Date(data.createdAt),
              creditNoteMedications: data.creditNoteMedications.map((item) => ({
                inventoryId: item.inventory.id,
                IssuedQuantity: item.issuedQuantity,
                motif: item.motif || ''
              }))
            })
          }
        })
        return data
      }

      setIsCreditNoteValidated(false)
      setSelectedInventories([])
      form.setValues({
        supplierId: undefined,
        creditNoteDate: new Date(),
        creditNoteMedications: []
      })
    },
    retry: false,
    enabled: false
  })

  const { mutateAsync: createCreditNote, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await http.post('/api/credit-notes', data)
      return res.data
    }
  })

  const { mutate: updateCreditNote } = useMutation({
    mutationFn: async (values: any) => {
      const res = await http.put(`/api/credit-notes/${values.creditNoteId}`, {
        ...values,
        id: values.creditNoteId
      })
      return res.data
    }
  })

  const handleSubmit = async (values) => {
    if (!isCreditNoteValidated) {
      await createCreditNote(values, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['medications'] })
          form.reset()
          setSelectedInventories([])
          toast.success('Avoir à était enregistre avec succès')
        },
        onError: () => toast.error("Quelque chose de grave s'est produit.")
      })
    } else {
      modals.openConfirmModal({
        title: 'Message de Confirmation',
        children: <Text>Voulez-vous mettre à jour cette Avoir ?</Text>,
        labels: { confirm: 'Oui', cancel: 'Non' },
        onConfirm: () =>
          updateCreditNote(values, {
            onSuccess: () => {
              toast.success("L'Avoir a été mise à jour avec succès.")
              form.reset()
              setSelectedInventories([])
            },
            onError: () => toast.error("Quelque chose de grave s'est produit.")
          })
      })
    }
  }

  return (
    <>
      <Box my="lg">
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
      </Box>
      <InventoryTable data={data} handleAddInventory={handleAddInventory} />
      <Divider my="xl" />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group mb="lg" justify="space-between" align="center">
          <Group>
            <InputBase
              required
              label="Numero d'Avoir"
              type="number"
              {...form.getInputProps('creditNoteNumber')}
              onBlur={() => refetch()}
            />
            <Select
              required
              label="Fournisseur"
              data={suppliersMemo}
              disabled={!form.getValues().creditNoteNumber}
              {...form.getInputProps('supplierId')}
            />
            <DateInput
              defaultValue={new Date()}
              label="Date émission"
              readOnly
            />
          </Group>
          <Button
            type="submit"
            loading={isPending}
            disabled={
              !form.getValues().creditNoteMedications.length ||
              !form.getValues().creditNoteNumber ||
              !form.getValues().supplierId
            }
          >
            {isCreditNoteValidated
              ? 'Enregistrer Modifications'
              : 'Valider Avoir'}
          </Button>
        </Group>
        <SelectedInventoriesTable
          inventories={selectedInventories}
          form={form}
          handleRemoveInventory={handleRemoveInventory}
        />
      </form>
    </>
  )
}

export default memo(CreditNoteForm)
