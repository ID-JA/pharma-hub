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

export const Route = createFileRoute('/_portal/settings/forms')({
  component: MedicationForms
})

function MedicationForms() {
  const {
    data: fetchedForms = [],
    isLoading: isLoadingForms,
    isFetching: isFetchingForms,
    refetch
  } = useQuery({
    queryKey: ['medication-forms'],
    queryFn: async () => {
      const res = await http.get('/api/forms')
      return res.data.data
    }
  })

  const { mutate: deleteForm, isPending: isDeleting } = useMutation({
    mutationFn: async (formId) => {
      const res = await http.delete(`/api/forms/${formId}`)
      return res.data
    },
    onSuccess: () => {
      refetch()
    }
  })

  const { mutateAsync: createForm, isPending: isCreating } = useMutation({
    mutationFn: async (values: any) => {
      const res = await http.post('/api/forms/', {
        ...values,
        id: 0
      })
      return res.data
    },
    onSuccess: () => {
      refetch()
    }
  })
  const { mutateAsync: updateForm, isPending: isUpdating } = useMutation({
    mutationFn: async (values: any) => {
      const res = await http.put(`/api/forms/${values.id}`, {
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
        header: 'Norm Forme',
        size: 300,
        mantineEditTextInputProps: {
          form: 'text',
          required: true
        }
      },
      {
        accessorKey: 'code',
        header: 'Code',
        mantineEditTextInputProps: {
          form: 'text',
          required: true
        }
      },
      {
        accessorKey: 'description',
        header: 'Description',
        mantineEditTextInputProps: {
          form: 'text',
          required: true
        }
      }
    ],
    []
  )

  //CREATE action
  const handleCreateForm = async ({ values, exitCreatingMode }) => {
    await createForm(values)
    exitCreatingMode()
  }

  //UPDATE action
  const handleSaveForm = async ({ values, table }) => {
    await updateForm(values)
    table.setEditingRow(null)
  }

  //DELETE action
  const openDeleteConfirmModal = (row) =>
    modals.openConfirmModal({
      title: 'Message de confirmation',
      children: (
        <Text>
          Êtes-vous sûr de vouloir supprimer cette forme "{row.original.name}"?
        </Text>
      ),
      labels: { confirm: 'Supprimer', cancel: 'Annule' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteForm(row.original.id)
    })

  const table = useMantineReactTable({
    columns,
    data: fetchedForms,
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
    onCreatingRowSave: handleCreateForm,
    // onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveForm,
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
        Ajouter Forme
      </Button>
    ),
    mantinePaperProps: {
      withBorder: false
    },
    state: {
      isLoading: isLoadingForms,
      showProgressBars: isFetchingForms,
      isSaving: isCreating || isUpdating || isDeleting
    }
  })
  return (
    <Box mt="md">
      <Title order={2} mb="md">
        Formes
      </Title>
      <MantineReactTable table={table} />
    </Box>
  )
}
export default MedicationForms
