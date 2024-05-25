import {
  Button,
  Checkbox,
  Fieldset,
  Group,
  Modal,
  NumberInput,
  Stack,
  TextInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useCreateMedicament } from '@renderer/services/medicaments.service'
import { zodResolver } from 'mantine-form-zod-resolver'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  dci: z.string().min(1, 'DCI is required'),
  form: z.string().min(1, 'Form is required'),
  ppv: z.number().min(0, 'PPV must be non-negative'),
  pph: z.number().min(0, 'PPH must be non-negative'), // dynamic
  tva: z.number().min(0, 'TVA must be non-negative'), // dynamic
  discount: z.number().min(0, 'Discount must be non-negative'),
  pbr: z.number().min(0, 'PBR must be non-negative'),
  type: z.string().min(1, 'Type is required'),
  marge: z.number().min(0, 'Marge must be non-negative'), // dynamic
  barCode: z.string().min(1, 'Bar Code is required'),
  family: z.string().min(1, 'Family is required'),
  usedBy: z.enum(['1', '2'], {
    required_error: 'UsedBy is required'
  }),
  withPrescription: z.boolean()
})

const DEFAULT_VALUE = {
  name: '',
  dci: '',
  form: '',
  ppv: 0,
  pph: 0,
  tva: 0,
  discount: 0,
  pbr: 0,
  type: '',
  marge: 0,
  barCode: '',
  family: '',
  usedBy: [],
  withPrescription: false
}

function AddMedicamentModal({
  opened,
  setOpened
}: {
  opened: boolean
  setOpened: Dispatch<SetStateAction<boolean>>
}) {
  const { mutate: createMedicament } = useCreateMedicament()

  const form = useForm({
    initialValues: DEFAULT_VALUE,
    validate: zodResolver(schema)
  })

  return (
    <Modal size="xl" onClose={() => setOpened(false)} opened={opened} title="Add New Medicament">
      <form onSubmit={form.onSubmit((values) => createMedicament(values))}>
        <Stack gap="md">
          <Fieldset legend="Basic information">
            <Group grow align="start">
              <TextInput label="Name" {...form.getInputProps('name')} />
              <TextInput label="Bar Code" {...form.getInputProps('barCode')} />
            </Group>
            <Group grow align="start">
              <TextInput label="DCI" {...form.getInputProps('dci')} />
              <TextInput label="Form" {...form.getInputProps('form')} />
            </Group>
            <Checkbox
              mt="md"
              label="With Prescription"
              {...form.getInputProps('withPrescription', { type: 'checkbox' })}
            />
          </Fieldset>
          <Fieldset legend="Categorization">
            <TextInput label="Family" {...form.getInputProps('family')} />
            <TextInput label="Type" {...form.getInputProps('type')} />
            <Checkbox.Group label="Used by" {...form.getInputProps('usedBy', { type: 'checkbox' })}>
              <Group>
                <Checkbox mt="md" label="Adult" value="adult" />
                <Checkbox mt="md" label="Child" value="child" />
                <Checkbox mt="md" label="Infant" value="infant" />
              </Group>
            </Checkbox.Group>
          </Fieldset>
          <Fieldset legend="Pricing">
            <Group grow align="start" mb="sm">
              <NumberInput label="PPV" {...form.getInputProps('ppv')} />
              <NumberInput label="PPH" readOnly {...form.getInputProps('pph')} />
              <NumberInput label="PBR" {...form.getInputProps('pbr')} />
            </Group>
            <Group grow align="start">
              <NumberInput label="TVA" readOnly {...form.getInputProps('tva')} />
              <NumberInput label="Marge" readOnly {...form.getInputProps('marge')} />
              <NumberInput label="Discount" {...form.getInputProps('discount')} />
            </Group>
          </Fieldset>

          <Group justify="end" mt="md">
            <Button type="submit">Validate</Button>
            <Button size="sm" variant="outline" color="red" onClick={() => setOpened(false)}>
              Close
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export const useAddMedicamentModal = () => {
  const [opened, setOpened] = useState(false)
  const AddMedicamentModalCallback = useCallback(() => {
    return <AddMedicamentModal opened={opened} setOpened={setOpened} />
  }, [opened, setOpened])

  const AddMedicamentButtonCallback = useCallback(() => {
    return (
      <Button
        onClick={() => {
          setOpened(true)
        }}
        variant="light"
      >
        New Medicament
      </Button>
    )
  }, [setOpened])

  return useMemo(
    () => ({
      opened,
      setOpened,
      AddMedicamentModal: AddMedicamentModalCallback,
      AddMedicamentButton: AddMedicamentButtonCallback
    }),
    [opened, setOpened, AddMedicamentModalCallback, AddMedicamentButtonCallback]
  )
}
