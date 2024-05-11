"use client";

import { useMemo } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "mantine-react-table";
import { ActionIcon, Flex, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useDeleteUser, useGetUsers } from "@/services/users.service";
import { User } from "@/types";
import { useAddEditUserModal } from "@/components/modals/add-edit-user-modal";

function UsersPage() {
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
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
      {
        accessorKey: "cni",
        header: "CNI",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "gender",
        header: "Gender",
      },

      {
        accessorKey: "address",
        header: "Address",
      },
    ],
    []
  );

  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();

  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  // Show delete confirm modal handler
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
    enableEditing: true,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: "red",
          children: "Error loading Users. Please refresh and try again.",
        }
      : undefined,
    mantineTableContainerProps: {
      style: {
        minHeight: "500px",
      },
    },

    renderRowActions: ({ row }) => {
      const { setShowAddEditUserModal, AddEditUserModal } = useAddEditUserModal(
        {
          props: row.original,
        }
      );
      return (
        <>
          <AddEditUserModal />
          <Flex gap="md">
            <Tooltip
              label="Edit"
              onClick={() => {
                setShowAddEditUserModal(true);
              }}
            >
              <ActionIcon variant="filled" aria-label="Delete" size="sm">
                <IconEdit
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
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
                <IconTrash
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </>
      );
    },

    state: {
      isLoading: isLoadingUsers,
      showAlertBanner: isLoadingUsersError,
    },
    mantinePaperProps: {
      withBorder: false,
    },
    mantineCreateRowModalProps: {
      size: "lg",
    },
  });
  const { AddEditUserButton, AddEditUserModal } = useAddEditUserModal();
  return (
    <>
      <AddEditUserModal />
      <AddEditUserButton />
      <MantineReactTable table={table} />
    </>
  );
}

export default UsersPage;
