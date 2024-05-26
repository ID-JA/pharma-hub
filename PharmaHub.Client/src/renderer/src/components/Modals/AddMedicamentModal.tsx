import {
  Button,
  Checkbox,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { DatePickerInput } from '@mantine/dates'

import { useCreateMedicament, useTaxesQuery } from '@renderer/services/medicaments.service'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useCallback, useMemo, useState } from 'react'
import { z } from 'zod'
import SearchField from '../SearchField'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  dci: z.array(z.string()).nonempty(),
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
  dosage: z.string(),
  expirationDate: z.date(),
  laboratory: z.string(),
  section: z.string(),
  orderSystem: z.string(),
  usedBy: z
    .array(z.string(), {
      required_error: 'UsedBy is required'
    })
    .nonempty(),
  withPrescription: z.boolean()
})

type Medicament = z.infer<typeof schema>

function AddMedicamentForm() {
  const form = useForm<Medicament>({
    validate: zodResolver(schema)
  })
  const { mutate: createMedicament } = useCreateMedicament()
  const { data: taxes } = useTaxesQuery()

  const taxTypesData = useMemo(() => {
    return taxes?.map((tax) => ({
      label: tax.name,
      value: tax.name
    }))
  }, [taxes])

  const handleTaxTypeChange = useCallback(
    (item) => {
      form.setFieldValue('type', item.name)
      form.setFieldValue('tva', item.tva)
      form.setFieldValue('marge', item.marge)
      form.setFieldValue('discount', item.salesDiscountRate)
    },
    [form]
  )

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack>
        <Group grow align="start">
          <Stack>
            <SearchField
              setValue={(item) => form.setFieldValue('form', item.label)}
              label="From"
              searchUrl="/api/forms"
              queryKey="fromSearch"
              queryParamName="query"
              dataMapper={(item) => ({ value: item.id.toString(), label: item.name })}
              error={form.getInputProps('form').error}
            />
            <TextInput label="Name" {...form.getInputProps('name')} />
            <DatePickerInput label="Expiration Date" {...form.getInputProps('expirationDate')} />
          </Stack>
          <Stack>
            <Textarea label="Dosage" rows={8} {...form.getInputProps('dosage')} />
          </Stack>
        </Group>
        <Group grow>
          <Select
            label="Type"
            data={taxTypesData}
            {...form.getInputProps('type')}
            onChange={(_, item) => handleTaxTypeChange(item)}
          />
          <SearchField
            setValue={(item) => form.setFieldValue('family', item.label)}
            label="Family"
            searchUrl="/api/families"
            queryKey="familySearch"
            queryParamName="query"
            dataMapper={(item) => ({ value: item.id.toString(), label: item.name })}
            error={form.getInputProps('family').error}
          />
        </Group>
        <Checkbox.Group label="Used by" {...form.getInputProps('usedBy', { type: 'checkbox' })}>
          <Group grow>
            <Checkbox mt="md" label="Adult" value="adult" />
            <Checkbox mt="md" label="Child" value="child" />
            <Checkbox mt="md" label="Infant" value="infant" />
          </Group>
        </Checkbox.Group>
        <Group grow>
          <Select label="Order System" data={['Manual']} {...form.getInputProps('orderSystem')} />
          <Select
            label="Laboratory"
            data={['ABC Laboratory']}
            {...form.getInputProps('laboratory')}
          />
          <Select label="Section" data={['Fridge']} {...form.getInputProps('section')} />
        </Group>
        <Group grow>
          <NumberInput label="TVA(%)" readOnly value={form.getValues().tva} />
          <NumberInput label="Marge(%)" readOnly value={form.getValues().marge} />
          <NumberInput label="Discount(%)" readOnly value={form.getValues().discount} />
        </Group>
        <Group grow align="start" mb="sm">
          <NumberInput label="PPV" {...form.getInputProps('ppv')} min={0} />
          <NumberInput label="PBR" {...form.getInputProps('pbr')} min={0} />
          <NumberInput label="PPH" readOnly {...form.getInputProps('pph')} />
        </Group>
        <Group grow>
          <SearchField
            setValue={(items) => form.setFieldValue('dci', items as any)}
            label="DCI"
            searchUrl="/api/dcis"
            queryKey="dciSearch"
            isMultiSelect
            queryParamName="query"
            dataMapper={(item) => ({ value: item.name, label: item.name })}
            error={form.getInputProps('dci').error}
          />
        </Group>
        <Group justify="space-between">
          <TextInput label="Bar Code" {...form.getInputProps('barCode')} />
          <Group mt="lg">
            <Button type="submit">Validate</Button>
          </Group>
        </Group>
      </Stack>
    </form>
  )
}

export const useAddMedicamentModal = () => {
  const [opened, setOpened] = useState(false)
  const AddMedicamentModalCallback = useCallback(() => {
    return (
      <Modal size="xl" onClose={() => setOpened(false)} opened={opened} title="Add New Medicament">
        <AddMedicamentForm />
      </Modal>
    )
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
