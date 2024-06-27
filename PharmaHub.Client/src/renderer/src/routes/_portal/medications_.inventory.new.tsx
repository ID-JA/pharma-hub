import { createFileRoute } from '@tanstack/react-router'
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  InputBase,
  NativeSelect,
  Text,
  TextInput,
  rem
} from '@mantine/core'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import {
  useCreateInventory,
  useDeleteInventory,
  useMedicamentInventories,
  useUpdateInventory
} from '@renderer/services/medicaments.service'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableOptions,
  MantineReactTable,
  useMantineReactTable
} from 'mantine-react-table'
import { modals } from '@mantine/modals'
import { calculatePPH } from '@renderer/utils/functions'
import SearchMedicament from '@renderer/components/Medicaments/SearchMedicament'
import { useDebouncedState } from '@mantine/hooks'

type Inventory = {
  id: number
  ppv: number
  pph: number
  quantity: number
  expirationDate: Date
  createdAt: Date
}

export const Route = createFileRoute('/_portal/medications/inventory/new')({
  component: NewInventoryPage
})

function NewInventoryPage() {
  const [medicamentId, setMedicamentId] = useState<string | number | null>(null)
  const [search, setSearch] = useState('')
  const { data } = useMedicamentInventories(medicamentId)

  const { mutate: createInventory } = useCreateInventory(medicamentId)
  const { mutate: updateInventory } = useUpdateInventory(medicamentId)
  const { mutate: deleteInventory } = useDeleteInventory(medicamentId)

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({})
  const [pph, setPph] = useState(0)

  const columns = useMemo<MRT_ColumnDef<Inventory>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80
      },
      {
        accessorKey: 'ppv',
        header: 'PPV',
        mantineEditTextInputProps: {
          type: 'number',
          min: 0,
          required: true,
          error: validationErrors?.ppv,
          onChange: (e) => {
            setPph(calculatePPH(e.target.value, 12))
          },
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              ppv: undefined
            })
        }
      },
      {
        accessorKey: 'pph',
        header: 'PPH',
        mantineEditTextInputProps: {
          value: pph,
          readOnly: true,
          type: 'number'
        }
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        mantineEditTextInputProps: {
          type: 'number',
          required: true,
          error: validationErrors?.quantity,
          min: 0,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              quantity: undefined
            })
        }
      },
      {
        accessorKey: 'expirationDate',
        header: 'Expiration Date',
        Cell: ({ cell }) => dayjs(cell.getValue<Date>()).format('DD/MM/YYYY'),
        mantineEditTextInputProps: {
          type: 'date',
          required: true,
          error: validationErrors?.expirationDate,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              expirationDate: undefined
            })
        }
      }
    ],
    [validationErrors, pph]
  )

  const handleCreateInventory: MRT_TableOptions<Inventory>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      setValidationErrors({})
      await createInventory({
        ...values,
        pph
      })
      exitCreatingMode()
    }

  const handleSaveInventory: MRT_TableOptions<Inventory>['onEditingRowSave'] =
    async ({ values, table }) => {
      setValidationErrors({})
      updateInventory(values)
      table.setEditingRow(null)
    }

  const openDeleteConfirmModal = (row: MRT_Row<Inventory>) =>
    modals.openConfirmModal({
      title: 'Delete Confirmation',
      children: <Text>Are you sure you want to delete this inventory? </Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteInventory(row.original.id)
      }
    })

  const table = useMantineReactTable({
    columns,
    data: data?.inventories ? data?.inventories : [],
    enableGlobalFilter: false,
    enableHiding: false,
    enableSorting: false,
    enableFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    getRowId: (row) => row.id.toString(),
    mantineToolbarAlertBannerProps: false
      ? {
          color: 'red',
          children: 'Error loading data'
        }
      : undefined,
    mantineTableContainerProps: {
      style: {
        minHeight: '360px'
      }
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateInventory,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveInventory,
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <ActionIcon
          onClick={() => table.setEditingRow(row)}
          size="sm"
          variant="light"
        >
          <IconEdit style={{ height: '50%', width: '50%' }} stroke={1.2} />
        </ActionIcon>
        <ActionIcon
          color="red"
          onClick={() => openDeleteConfirmModal(row)}
          size="sm"
          variant="light"
        >
          <IconTrash style={{ height: '50%', width: '50%' }} stroke={1.2} />
        </ActionIcon>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Group justify="space-between" flex="1">
        <Text>Total Quantity: {data?.totalQuantity || 0}</Text>
        <Button
          disabled={!medicamentId}
          onClick={() => {
            table.setCreatingRow(true)
          }}
        >
          Create New Inventory
        </Button>
      </Group>
    ),
    state: {}
  })

  return (
    <>
      <Group mb="lg">
        <SearchMedicament
          readOnly={false}
          medicationName={medicamentId}
          label="Nom de produit"
          setValue={(v) => setMedicamentId(v)}
          search={search}
          setSearch={setSearch}
        />
      </Group>
      <Group grow mb="lg">
        <InputBase label="Section" value={data?.section} readOnly />
        <InputBase label="Form" value={data?.form} readOnly />
      </Group>
      <MantineReactTable table={table} />
    </>
  )
}
