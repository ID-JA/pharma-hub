import {
  ActionIcon,
  Button,
  Drawer,
  InputBase,
  Table,
  Text
} from '@mantine/core'
import { useDebouncedState, useDisclosure } from '@mantine/hooks'
import { http } from '@renderer/utils/http'
import { IconPlus } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

export function InventorySelectorDrawer({
  onAddInventory
}: {
  onAddInventory: (inventory: any) => void
}) {
  const [medicamentName, setMedicamentName] = useDebouncedState('', 500)

  const { data } = useQuery({
    queryKey: ['inventories', medicamentName],
    queryFn: async () => {
      return (
        await http.get('/api/inventories', {
          params: {
            medicament: medicamentName ? medicamentName : undefined
          }
        })
      ).data.data
    }
  })

  const rows = data?.map((item) => {
    return (
      <Table.Tr key={item.inventory.id}>
        <Table.Td>{item.medication.name}</Table.Td>
        <Table.Td ta="center">{item.inventory.boxQuantity}</Table.Td>
        <Table.Td ta="center">{item.inventory.ppv}</Table.Td>
        <Table.Td ta="center">{item.inventory.pph}</Table.Td>
        <Table.Td ta="center">
          {new Date(item.inventory.expirationDate).toDateString()}
        </Table.Td>
        <Table.Td ta="center">
          <ActionIcon variant="default" onClick={() => onAddInventory(item)}>
            <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.7} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    )
  })
  return (
    <>
      <InputBase
        w="50%"
        label="Search for Medicaments"
        defaultValue={medicamentName}
        onChange={(event) => setMedicamentName(event.target.value)}
        placeholder="Medicament Name"
        mb="md"
      />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th ta="center">Quantity</Table.Th>
            <Table.Th ta="center">PPV</Table.Th>
            <Table.Th ta="center">PPH</Table.Th>
            <Table.Th ta="center">Expiration Date</Table.Th>
            <Table.Th ta="center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  )
}

export const useInventorySelector = ({
  onAddInventory
}: {
  onAddInventory: (inventory: any) => void
}) => {
  const [opened, { close, open }] = useDisclosure(false)
  const InventorySelectorDrawerCallback = useCallback(() => {
    return (
      <Drawer
        size="xl"
        onClose={close}
        opened={opened}
        title={
          <Text fw="600" td="underline">
            Pending orders from the same selected supplier
          </Text>
        }
      >
        <InventorySelectorDrawer onAddInventory={onAddInventory} />
      </Drawer>
    )
  }, [opened, close, onAddInventory])

  const InventorySelectorDrawerButtonCallback = useCallback(() => {
    return (
      <Button onClick={open} variant="light">
        Sélectionner inventaire
      </Button>
    )
  }, [open])

  return useMemo(
    () => ({
      opened,
      open,
      close,
      InventorySelectorDrawer: InventorySelectorDrawerCallback,
      InventorySelectorDrawerButton: InventorySelectorDrawerButtonCallback
    }),
    [
      opened,
      open,
      close,
      InventorySelectorDrawerCallback,
      InventorySelectorDrawerButtonCallback
    ]
  )
}
