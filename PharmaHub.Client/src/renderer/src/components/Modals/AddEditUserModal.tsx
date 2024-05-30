'use client'

import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core'
import { useCreateUser, useUpdateUser } from '@renderer/services/users.service'
import { User } from '@renderer/utils/types'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react'

const DEFAULT_USER_DATA = {
  id: '',
  firstName: '',
  lastName: '',
  cni: '',
  phone: '',
  email: '',
  password: '',
  role: 'Admin',
  address: '',
  gender: 'M'
}

function AddEditUserModal({
  showAddEditUserModal,
  setShowAddEditUserModal,
  props
}: {
  showAddEditUserModal: boolean
  setShowAddEditUserModal: Dispatch<SetStateAction<boolean>>
  props?: User
}) {
  const [data, setData] = useState<User>(props || DEFAULT_USER_DATA)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser()

  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser()
  const handleSubmit = useCallback(async () => {
    if (props?.id) {
      await updateUser(data)
    } else {
      await createUser(data)
    }
  }, [data, props])

  const isLoading = useMemo(() => {
    return isCreatingUser || isUpdatingUser
  }, [isCreatingUser, isUpdatingUser])
  return (
    <div>
      <Modal
        size="lg"
        opened={showAddEditUserModal}
        onClose={() => {
          setShowAddEditUserModal(false)
        }}
        title={
          props
            ? `Edit user ${props?.firstName} ${props?.lastName}`
            : 'Add new user'
        }
      >
        <Stack
          align="stretch"
          justify="center"
          gap="md"
          component="form"
          onSubmit={async (e) => {
            e.preventDefault()
            await handleSubmit()
            setShowAddEditUserModal(false)
          }}
        >
          <Group grow>
            <TextInput
              name="firstName"
              label="Fist Name"
              value={data.firstName}
              onChange={handleChange}
            />
            <TextInput
              name="lastName"
              label="Last Name"
              value={data.lastName}
              onChange={handleChange}
            />
          </Group>
          <TextInput
            name="cni"
            label="CNI"
            value={data.cni}
            onChange={handleChange}
          />
          <TextInput
            name="phone"
            label="Phone Number"
            value={data.phone}
            onChange={handleChange}
          />
          <TextInput
            name="address"
            label="Address"
            value={data.address}
            onChange={handleChange}
          />
          <Group grow>
            <TextInput
              name="email"
              label="Email"
              value={data.email}
              onChange={handleChange}
            />
            <TextInput
              name="password"
              label="Password"
              value={data.password}
              onChange={handleChange}
            />
          </Group>
          <Select
            name="role"
            data={['Admin', 'User']}
            label="Role"
            defaultValue="Admin"
            value={data.role}
            onChange={(value) => {
              setData({ ...data, role: value || 'Admin' })
            }}
          />
          <Select
            name="gender"
            data={['M', 'F']}
            label="Gender"
            defaultValue="M"
            value={data.gender}
            onChange={(value) => {
              setData({ ...data, gender: value || 'M' })
            }}
          />
          <Group justify="end" mt="md">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => {
                setShowAddEditUserModal(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} disabled={isLoading}>
              Submit
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  )
}

export default AddEditUserModal

export function useAddEditUserModal({
  props
}: {
  props?: any
} = {}) {
  const [showAddEditUserModal, setShowAddEditUserModal] = useState(false)

  const AddEditUserModalCallback = useCallback(() => {
    return (
      <AddEditUserModal
        showAddEditUserModal={showAddEditUserModal}
        setShowAddEditUserModal={setShowAddEditUserModal}
        props={props}
      />
    )
  }, [showAddEditUserModal, setShowAddEditUserModal])

  const AddEditUserButtonCallback = useCallback(() => {
    return (
      <Button
        onClick={() => {
          setShowAddEditUserModal(true)
        }}
      >
        Add new user
      </Button>
    )
  }, [setShowAddEditUserModal])

  return useMemo(
    () => ({
      showAddEditUserModal,
      setShowAddEditUserModal,
      AddEditUserModal: AddEditUserModalCallback,
      AddEditUserButton: AddEditUserButtonCallback
    }),
    [
      showAddEditUserModal,
      setShowAddEditUserModal,
      AddEditUserModalCallback,
      AddEditUserButtonCallback
    ]
  )
}
