import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Table,
  Tabs,
  Text,
  Tooltip
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { http } from '@renderer/utils/http'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  MRT_ColumnDef,
  MantineReactTable,
  useMantineReactTable
} from 'mantine-react-table'
import { useMemo } from 'react'

export const Route = createFileRoute('/_portal/settings/types')({
  component: MedicationTypesPage
})

function MedicationTypesPage() {
  return (
    <Tabs defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab value="gallery">Définition des Types</Tabs.Tab>
        <Tabs.Tab value="messages">Liste des produits par type</Tabs.Tab>
        <Tabs.Tab value="settings">
          Tableaux des taux de marges sur PPM
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery">
        <MedicationTypes />
      </Tabs.Panel>

      <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>

      <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
    </Tabs>
  )
}

function MedicationTypes() {
  const {
    data: fetchedTypes = [],
    isLoading: isLoadingTypes,
    isFetching: isFetchingTypes,
    refetch
  } = useQuery({
    queryKey: ['medication-types'],
    queryFn: async () => {
      const res = await http.get('/api/types')
      return res.data
    }
  })

  const { mutate: deleteType, isPending: isDeleting } = useMutation({
    mutationFn: async (typeId) => {
      const res = await http.delete(`/api/types/${typeId}`)
      return res.data
    },
    onSuccess: () => {
      refetch()
    }
  })

  const { mutateAsync: createType, isPending: isCreating } = useMutation({
    mutationFn: async (values: any) => {
      const res = await http.post('/api/types/', {
        ...values,
        id: 0
      })
      return res.data
    },
    onSuccess: () => {
      refetch()
    }
  })
  const { mutateAsync: updateType, isPending: isUpdating } = useMutation({
    mutationFn: async (values: any) => {
      const res = await http.put(`/api/types/${values.id}`, {
        ...values,
        id: 0
      })
      return res.data
    },
    onSuccess: () => {
      refetch()
    }
  })

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80
      },
      {
        accessorKey: 'name',
        header: 'Nom Type',
        size: 300,
        mantineEditTextInputProps: {
          type: 'text',
          required: true
        }
      },
      {
        accessorKey: 'code',
        header: 'Code',
        mantineEditTextInputProps: {
          type: 'text',
          required: true
        }
      },
      {
        accessorKey: 'marge',
        header: 'Marge',
        mantineEditTextInputProps: {
          type: 'text',
          required: true
        }
      },

      {
        accessorKey: 'tva',
        header: 'TVA',
        mantineEditTextInputProps: {
          type: 'text',
          required: true
        }
      },

      {
        accessorKey: 'taxNature',
        header: 'Nature Fiscale',
        size: 330,
        mantineEditTextInputProps: {
          type: 'text',
          required: true
        }
      },

      {
        accessorKey: 'salesDiscountRate',
        header: 'Taux Remise VENTE',
        mantineEditTextInputProps: {
          type: 'text',
          required: true
        }
      }
    ],
    []
  )

  //CREATE action
  const handleCreateType = async ({ values, exitCreatingMode }) => {
    await createType(values)
    exitCreatingMode()
  }

  //UPDATE action
  const handleSaveType = async ({ values, table }) => {
    await updateType(values)
    table.setEditingRow(null)
  }

  //DELETE action
  const openDeleteConfirmModal = (row) =>
    modals.openConfirmModal({
      title: 'Are you sure you want to delete this user?',
      children: (
        <Text>
          Are you sure you want to delete {row.original.firstName}{' '}
          {row.original.lastName}? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annule' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteType(row.original.id)
    })

  const table = useMantineReactTable({
    columns,
    data: fetchedTypes,
    enableGlobalFilter: false,
    enableHiding: false,
    enableSorting: false,
    enableFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'row', // ('modal', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row.id,
    // mantineToolbarAlertBannerProps: isLoadingUsersError
    //   ? {
    //       color: 'red',
    //       children: 'Error loading data',
    //     }
    //   : undefined,
    mantineTableContainerProps: {
      style: {
        minHeight: '500px'
      }
    },
    // onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateType,
    // onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveType,
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <ActionIcon
            variant="light"
            onClick={() => table.setEditingRow(row)}
            size="sm"
          >
            <IconEdit style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon
            variant="light"
            color="red"
            size="sm"
            onClick={() => openDeleteConfirmModal(row)}
          >
            <IconTrash style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true)
        }}
      >
        Ajouter Type
      </Button>
    ),
    mantinePaperProps: {
      withBorder: false
    },
    state: {
      isLoading: isLoadingTypes,
      showProgressBars: isFetchingTypes,
      isSaving: isCreating || isUpdating || isDeleting
    }
  })
  return (
    <Box mt="md">
      <MantineReactTable table={table} />
    </Box>
  )
}
