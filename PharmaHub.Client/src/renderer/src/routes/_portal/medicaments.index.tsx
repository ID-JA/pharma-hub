import { useCallback, useEffect } from 'react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import {
  Box,
  Button,
  Checkbox,
  Fieldset,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  medicamentQueryOptions,
  useCreateMedicament,
  useUpdateMedicament
} from '@renderer/services/medicaments.service'

const productSearchSchema = z.object({
  medicamentId: z.number().optional()
})

export const Route = createFileRoute('/_portal/medicaments/')({
  validateSearch: productSearchSchema,
  component: CreateEditMedicamentPage
})

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

function CreateEditMedicamentPage() {
  const navigate = useNavigate()
  const searchParams = Route.useSearch()
  const { data: medicamentDetail } = useQuery(
    medicamentQueryOptions(searchParams.medicamentId)
  )
  const { mutate: createMedicament } = useCreateMedicament()
  const { mutate: updateMedicament } = useUpdateMedicament()

  const form = useForm({
    initialValues: DEFAULT_VALUE,
    validate: zodResolver(schema)
  })

  useEffect(() => {
    if (medicamentDetail) {
      form.setValues(medicamentDetail)
    }
  }, [medicamentDetail])

  const handleSubmit = useCallback(
    (values: any) => {
      if (searchParams.medicamentId) {
        updateMedicament(values)
      } else {
        createMedicament(values)
      }
    },
    [medicamentDetail, searchParams.medicamentId]
  )

  return (
    <Box p="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Title order={3} ta="center">
          {searchParams.medicamentId ? 'Edit' : 'Create New'} Medicament
        </Title>
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
              <NumberInput
                label="Discount"
                {...form.getInputProps('discount')}
              />
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
              style={{
                display: searchParams.medicamentId ? 'inline' : 'none'
              }}
              onClick={() => {
                form.reset()
                navigate({
                  to: '/medicaments',
                  search: {}
                })
              }}
            >
              Cancel Editing
            </Button>
            <Button type="submit">Submit</Button>
          </Group>
        </Stack>
      </form>
    </Box>
  )
}
