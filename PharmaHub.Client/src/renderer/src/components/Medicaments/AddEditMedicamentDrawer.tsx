import {
  Button,
  Checkbox,
  Drawer,
  Fieldset,
  Group,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  TextInput,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  medicamentQueryOptions,
  useCreateMedicament,
  useUpdateMedicament
} from '@renderer/services/medicaments.service'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, Route } from '@tanstack/react-router'
import { zodResolver } from 'mantine-form-zod-resolver'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  dci: z.string().min(1, 'DCI is required'),
  form: z.string().min(1, 'Form is required'),
  ppv: z.number().min(0, 'PPV must be non-negative'),
  pph: z.number().min(0, 'PPH must be non-negative'),
  tva: z.number().min(0, 'TVA must be non-negative'),
  discount: z.number().min(0, 'Discount must be non-negative'),
  pbr: z.number().min(0, 'PBR must be non-negative'),
  type: z.string().min(1, 'Type is required'),
  marge: z.number().min(0, 'Marge must be non-negative'),
  codebar: z.string().min(1, 'CodeBar is required'),
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
  codebar: '',
  family: '',
  usedBy: 1,
  withPrescription: false
}
function AddEditMedicamentDrawer({
  opened,
  setOpened,
  props
}: {
  opened: boolean
  setOpened: Dispatch<SetStateAction<boolean>>
  props?: any
}) {
  // const navigate = useNavigate()
  // const searchParams = Route.useSearch()
  // const { data: medicamentDetail } = useQuery(medicamentQueryOptions(searchParams.medicamentId))
  const { mutate: createMedicament } = useCreateMedicament()
  // const { mutate: updateMedicament } = useUpdateMedicament()
  const form = useForm({
    initialValues: DEFAULT_VALUE,
    validate: zodResolver(schema)
  })

  // useEffect(() => {
  //   if (medicamentDetail) {
  //     form.setValues(medicamentDetail)
  //   }
  // }, [medicamentDetail])

  const handleSubmit = useCallback(
    (values: any) => {
      // if (searchParams.medicamentId) {
      //   updateMedicament(values)
      // } else {
      createMedicament(values)
      // }
    },
    []
    // [medicamentDetail, searchParams.medicamentId]
  )

  return (
    <Drawer onClose={() => setOpened(false)} opened={opened} title="Add New Medicament">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Fieldset legend="Basic information">
            <Group grow align="start">
              <TextInput label="Name" {...form.getInputProps('name')} />
              <TextInput label="Code bar" {...form.getInputProps('codebar')} />
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
          <Fieldset legend="Pricing">
            <Group grow align="start" mb="sm">
              <NumberInput label="PPV" {...form.getInputProps('ppv')} />
              <NumberInput label="PPH" {...form.getInputProps('pph')} />
              <NumberInput label="PBR" {...form.getInputProps('pbr')} />
            </Group>
            <Group grow align="start">
              <NumberInput label="TVA" {...form.getInputProps('tva')} />
              <NumberInput label="Discount" {...form.getInputProps('discount')} />
              <NumberInput label="Marge" {...form.getInputProps('marge')} />
            </Group>
          </Fieldset>

          <Fieldset legend="Categorization">
            <TextInput label="Family" {...form.getInputProps('family')} />
            <TextInput label="Type" {...form.getInputProps('type')} />
            <Select
              label="Used By"
              data={[
                {
                  label: 'Adult',
                  value: '1'
                },
                {
                  label: 'Children',
                  value: '2'
                }
              ]}
              {...form.getInputProps('usedBy')}
            />
          </Fieldset>

          <Group justify="end" mt="md">
            <Button
              size="sm"
              variant="outline"
              color="red"
              onClick={() => {
                setOpened(false)
              }}
            >
              Cancel Editing
            </Button>
            <Button type="submit">Submit</Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  )
}

export const useAddEditMedicamentDrawer = ({ props }: { props?: any } = {}) => {
  const [opened, setOpened] = useState(false)
  const AddEditMedicamentDrawerCallback = useCallback(() => {
    return <AddEditMedicamentDrawer opened={opened} setOpened={setOpened} props={props} />
  }, [opened, setOpened])

  const AddEditMedicamentButtonCallback = useCallback(() => {
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
      AddEditMedicamentDrawer: AddEditMedicamentDrawerCallback,
      AddEditMedicamentButton: AddEditMedicamentButtonCallback
    }),
    [opened, setOpened, AddEditMedicamentDrawerCallback, AddEditMedicamentButtonCallback]
  )
}

export default AddEditMedicamentDrawer
