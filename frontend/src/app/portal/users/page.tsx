"use client";

import { useMemo, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_EditActionButtons,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
} from "mantine-react-table";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import {
  useCreateUser,
  useDeleteUser,
  useGetUsers,
  useUpdateUser,
  validateUser,
} from "@/services/users.service";
import { User } from "@/types";

function UsersPage() {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.FirstName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              FirstName: undefined,
            }),
        },
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.LastName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              LastName: undefined,
            }),
        },
      },
      {
        accessorKey: "cni",
        header: "CNI",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.CNI,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              CNI: undefined,
            }),
        },
      },
      {
        accessorKey: "phone",
        header: "Phone",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.Phone,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              Phone: undefined,
            }),
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        mantineEditTextInputProps: {
          type: "email",
          required: true,
          error: validationErrors?.Email,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              Email: undefined,
            }),
        },
      },
      {
        accessorKey: "gender",
        header: "Gender",

        mantineEditSelectProps: {
          data: ["M", "F"],
          type: "submit",
          required: true,
          error: validationErrors?.Gender,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              Gender: undefined,
            }),
        },
      },

      {
        accessorKey: "address",
        header: "Address",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.Address,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              Address: undefined,
            }),
        },
      },
    ],
    [validationErrors]
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  //CREATE action
  const handleCreateUser: MRT_TableOptions<User>["onCreatingRowSave"] = async ({
    values,
    exitCreatingMode,
  }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser(values);
    exitCreatingMode();
  };

  //UPDATE action
  const handleSaveUser: MRT_TableOptions<User>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };
  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<User>) =>
    modals.openConfirmModal({
      title: "Are you sure you want to delete this user?",
      children: (
        <Text>
          Are you sure you want to delete {row.original.firstName}{" "}
          {row.original.lastName}? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteUser(row.original.id),
    });
  const table = useMantineReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: "modal", //default ('row', and 'custom' are also available)
    editDisplayMode: "modal", //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: "red",
          children: "Error loading data",
        }
      : undefined,
    mantineTableContainerProps: {
      style: {
        minHeight: "500px",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Create New User </Title>
        {internalEditComponents}

        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit User</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit" onClick={() => table.setEditingRow(row)}>
          <ActionIcon variant="filled" aria-label="Delete" size="sm">
            <IconEdit style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon
            size="sm"
            variant="filled"
            aria-label="Delete"
            color="red"
            onClick={() => openDeleteConfirmModal(row)}
          >
            <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Create New User
      </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
    mantinePaperProps: {
      withBorder: false,
    },
    mantineCreateRowModalProps: {
      size: "lg",
    },
  });
  return <MantineReactTable table={table} />;
}

export default UsersPage;
