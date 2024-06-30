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

export const Route = createFileRoute('/_portal/settings/sections')({
  component: MedicationSections
})

function MedicationSections() {
  const {
    data: fetchedSections = [],
    isLoading: isLoadingSections,
    isFetching: isFetchingSections,
    refetch
  } = useQuery({
    queryKey: ['medication-sections'],
    queryFn: async () => {
      const res = await http.get('/api/sections')
      return res.data.data
    }
  })

  const { mutate: deleteSection, isPending: isDeleting } = useMutation({
    mutationFn: async (sectionId) => {
      const res = await http.delete(`/api/sections/${sectionId}`)
      return res.data
    },
    onSuccess: () => {
      refetch()
    }
  })

  const { mutateAsync: createSection, isPending: isCreating } = useMutation({
    mutationFn: async (values: any) => {
      const res = await http.post('/api/sections/', {
        ...values,
        id: 0
      })
      return res.data
    },
    onSuccess: () => {
      refetch()
    }
  })
  const { mutateAsync: updateSection, isPending: isUpdating } = useMutation({
    mutationFn: async (values: any) => {
      const res = await http.put(`/api/sections/${values.id}`, {
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
        header: 'Norm Rayon',
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
  const handleCreateSection = async ({ values, exitCreatingMode }) => {
    await createSection(values)
    exitCreatingMode()
  }

  //UPDATE action
  const handleSaveSection = async ({ values, table }) => {
    await updateSection(values)
    table.setEditingRow(null)
  }

  //DELETE action
  const openDeleteConfirmModal = (row) =>
    modals.openConfirmModal({
      title: 'Êtes-vous sûr de vouloir supprimer ce Rayon?',
      children: (
        <Text>
          Are you sure you want to delete {row.original.firstName}{' '}
          {row.original.lastName}? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annule' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteSection(row.original.id)
    })

  const table = useMantineReactTable({
    columns,
    data: fetchedSections,
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
    onCreatingRowSave: handleCreateSection,
    // onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveSection,
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
        Ajouter Rayon
      </Button>
    ),
    mantinePaperProps: {
      withBorder: false
    },
    state: {
      isLoading: isLoadingSections,
      showProgressBars: isFetchingSections,
      isSaving: isCreating || isUpdating || isDeleting
    }
  })
  return (
    <Box mt="md">
      <Title order={2} mb="md">
        Rayons
      </Title>
      <MantineReactTable table={table} />
    </Box>
  )
}
export default MedicationSections
