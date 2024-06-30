import {
  Flex,
  Tooltip,
  ActionIcon,
  Button,
  Box,
  Text,
  Title
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { http } from '@renderer/utils/http'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMantineReactTable, MantineReactTable } from 'mantine-react-table'
import { useMemo } from 'react'

export const Route = createFileRoute('/_portal/settings/families')({
  component: MedicationFamilies
})

function MedicationFamilies() {
  const {
    data: fetchedFamilies = [],
    isLoading: isLoadingFamilies,
    isFetching: isFetchingFamilies,
    refetch
  } = useQuery({
    queryKey: ['medication-families'],
    queryFn: async () => {
      const res = await http.get('/api/families')
      return res.data.data
    }
  })

  const { mutate: deleteFamily, isPending: isDeleting } = useMutation({
    mutationFn: async (familyId) => {
      const res = await http.delete(`/api/families/${familyId}`)
      return res.data
    },
    onSuccess: () => {
      refetch()
    }
  })

  const { mutateAsync: createFamily, isPending: isCreating } = useMutation({
    mutationFn: async (values: any) => {
      const res = await http.post('/api/families/', {
        ...values,
        id: 0
      })
      return res.data
    },
    onSuccess: () => {
      refetch()
    }
  })
  const { mutateAsync: updateFamily, isPending: isUpdating } = useMutation({
    mutationFn: async (values: any) => {
      const res = await http.put(`/api/families/${values.id}`, {
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
        header: 'Norm Familles Thérapeutiques',
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
      }
    ],
    []
  )

  //CREATE action
  const handleCreateFamily = async ({ values, exitCreatingMode }) => {
    await createFamily(values)
    exitCreatingMode()
  }

  //UPDATE action
  const handleSaveFamily = async ({ values, table }) => {
    await updateFamily(values)
    table.setEditingRow(null)
  }

  //DELETE action
  const openDeleteConfirmModal = (row) =>
    modals.openConfirmModal({
      title: 'Message de confirmation',
      children: (
        <Text>Êtes-vous sûr de vouloir supprimer {row.original.name}?</Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annule' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteFamily(row.original.id)
    })

  const table = useMantineReactTable({
    columns,
    data: fetchedFamilies,
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
    onCreatingRowSave: handleCreateFamily,
    // onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveFamily,
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
        Ajouter Familles Thérapeutiques
      </Button>
    ),
    mantinePaperProps: {
      withBorder: false
    },
    state: {
      isLoading: isLoadingFamilies,
      showProgressBars: isFetchingFamilies,
      isSaving: isCreating || isUpdating || isDeleting
    }
  })
  return (
    <Box mt="md">
      <Title order={2} mb="md">
        Familles Thérapeutiques
      </Title>
      <MantineReactTable table={table} />
    </Box>
  )
}
export default MedicationFamilies
