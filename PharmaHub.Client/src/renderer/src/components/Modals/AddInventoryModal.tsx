import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  InputBase,
  Modal,
  Paper,
  Table,
  Text,
  Tooltip
} from '@mantine/core'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'
import SearchMedicament from '../Medicaments/SearchMedicament'
import { useMedicamentInventories } from '@renderer/services/medicaments.service'
import { IconEdit, IconTrash, IconX } from '@tabler/icons-react'
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableOptions,
  MantineReactTable,
  useMantineReactTable
} from 'mantine-react-table'
import { modals } from '@mantine/modals'

function Row({ item, editingRow }) {
  return (
    <Table.Tr key={item.id} mah={50}>
      <Table.Td>{item.ppv}</Table.Td>
      <Table.Td> {item.pph}</Table.Td>
      <Table.Td> {item.quantity}</Table.Td>
      <Table.Td>{dayjs(item.expirationDate).format('DD-MM-YYYY')}</Table.Td>
      <Table.Td>
        <ActionIcon color="green" variant="subtle" mr="md">
          <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.2} />
        </ActionIcon>
        <ActionIcon color="red" variant="subtle">
          <IconX style={{ width: '70%', height: '70%' }} stroke={1.2} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  )
}

type Inventory = {
  id: number
  ppv: number
  pph: number
  quantity: number
  expirationDate: Date
  createdAt: Date
}

export function AddInventoryModal({ setOpened }) {
  const [medicamentId, setMedicamentId] = useState()
  const { data } = useMedicamentInventories(medicamentId)

  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})

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
          required: true,
          error: validationErrors?.ppv,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              ppv: undefined
            })
          //optionally add validation checking for onBlur or onChange
        }
      },
      {
        accessorKey: 'pph',
        header: 'PPH',
        mantineEditTextInputProps: {
          readOnly: true,
          type: 'number',
          required: true,
          error: validationErrors?.pph,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              pph: undefined
            })
        }
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        mantineEditTextInputProps: {
          type: 'number',
          required: true,
          error: validationErrors?.quantity,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              quantity: undefined
            })
        }
      }
    ],
    [validationErrors]
  )

  //CREATE action
  const handleCreateUser: MRT_TableOptions<Inventory>['onCreatingRowSave'] = async ({
    values,
    exitCreatingMode
  }) => {
    // const newValidationErrors = validateUser(values);
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    setValidationErrors({})
    // await createUser(values);
    exitCreatingMode()
  }

  //UPDATE action
  const handleSaveUser: MRT_TableOptions<Inventory>['onEditingRowSave'] = async ({
    values,
    table
  }) => {
    // const newValidationErrors = validateUser(values);
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    setValidationErrors({})
    // await updateUser(values);
    table.setEditingRow(null) //exit editing mode
  }

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Inventory>) =>
    modals.openConfirmModal({
      title: 'Delete Confirmation',
      children: <Text>Are you sure you want to delete this inventory? </Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => console.log(row.original.id)
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
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <ActionIcon onClick={() => table.setEditingRow(row)} size="md" variant="light">
          <IconEdit style={{ height: '80%', width: '80%' }} stroke={1.2} />
        </ActionIcon>
        <ActionIcon
          color="red"
          onClick={() => openDeleteConfirmModal(row)}
          size="md"
          variant="light"
        >
          <IconTrash style={{ height: '80%', width: '80%' }} stroke={1.2} />
        </ActionIcon>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Group justify="space-between" flex="1">
        <Text>Total Quantity: {data?.totalQuantity || 0}</Text>
        <Button
          onClick={() => {
            table.setCreatingRow(true) //simplest way to open the create row modal with no default values
            //or you can pass in a row object to set default values with the `createRow` helper function
            // table.setCreatingRow(
            //   createRow(table, {
            //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
            //   }),
            // );
          }}
        >
          Create New Inventory
        </Button>
      </Group>
    ),
    state: {
      showColumnFilters: false,
      showGlobalFilter: false
      // isLoading: isLoadingUsers,
      // isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      // showAlertBanner: isLoadingUsersError,
      // showProgressBars: isFetchingUsers,
    }
  })
  return (
    <>
      <Group mb="lg">
        <SearchMedicament label="Medicament Name" setValue={setMedicamentId} />
      </Group>
      <Group grow mb="lg">
        <InputBase label="From" value={data?.section} readOnly />
        <InputBase label="Section" value={data?.form} readOnly />
      </Group>

      <MantineReactTable table={table} />
    </>
  )
}

export const useAddInventoryModal = () => {
  const [opened, setOpened] = useState(false)
  const AddInventoryModalCallback = useCallback(() => {
    return (
      <Modal size="xl" onClose={() => setOpened(false)} opened={opened} title="Add New Inventory">
        <AddInventoryModal setOpened={setOpened} />
      </Modal>
    )
  }, [opened, setOpened])

  const AddInventoryButtonCallback = useCallback(() => {
    return (
      <Button
        onClick={() => {
          setOpened(true)
        }}
        variant="light"
      >
        Add New Inventory
      </Button>
    )
  }, [setOpened])

  return useMemo(
    () => ({
      opened,
      setOpened,
      AddInventoryModal: AddInventoryModalCallback,
      AddMedicamentButton: AddInventoryButtonCallback
    }),
    [opened, setOpened, AddInventoryModalCallback, AddInventoryButtonCallback]
  )
}
