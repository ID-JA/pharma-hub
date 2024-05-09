"use client";
import React from "react";
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
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { ModalsProvider, modals } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
const UsersTable = () => {
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
        accessorKey: "password",
        header: "Password",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.Password,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              Password: undefined,
            }),
        },
      },
      {
        accessorKey: "gender",
        header: "Gender",
        mantineEditTextInputProps: {
          type: "text",
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
      {
        accessorKey: "role",
        header: "Role",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.Role,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              Role: undefined,
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
        <Title order={3}>Create New User</Title>
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
        <Tooltip label="Edit">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
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
  });
  return <MantineReactTable table={table} />;
};

//CREATE hook (post new user to api)
function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo: User) => {
      queryClient.setQueryData(
        ["users"],
        (prevUsers: any) =>
          [
            ...prevUsers,
            {
              ...newUserInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as User[]
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}
//READ hook (get users from api)
function useGetUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(users);
    },
    refetchOnWindowFocus: false,
  });
}
//UPDATE hook (put user in api)
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo: User) => {
      queryClient.setQueryData(["users"], (prevUsers: any) =>
        prevUsers?.map((prevUser: User) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser
        )
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}
//DELETE hook (delete user in api)
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (userId: string) => {
      queryClient.setQueryData(["users"], (prevUsers: any) =>
        prevUsers?.filter((user: User) => user.id !== userId)
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}
const queryClient = new QueryClient();

const UsersPage = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <UsersTable />
    </ModalsProvider>
  </QueryClientProvider>
);

const validateRequired = (value: string) => !!value.length;
const validateEmail = (Email: string) =>
  !!Email.length &&
  Email.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
function validateUser(user: User) {
  return {
    FirstName: !validateRequired(user.firstName)
      ? "First Name is Required"
      : "",
    LastName: !validateRequired(user.lastName) ? "Last Name is Required" : "",
    Email: !validateEmail(user.email) ? "Incorrect Email Format" : "",
  };
}

type User = {
  id: string;
  firstName: string;
  lastName: string;

  cin: string;
  password: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  role: string;
};

const users: User[] = [
  {
    id: "1",
    firstName: "Kevin",
    lastName: "Yan",

    cin: "bj86799",
    password: "12345",
    gender: "Male",
    phone: "0654321",
    email: "KevinYan@gmail.com",
    address: "casa street 4",
    role: "ADMIN",
  },
];

export default UsersPage;