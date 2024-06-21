import { createFileRoute } from '@tanstack/react-router'
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  NumberInput,
  Radio,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { DatePickerInput } from '@mantine/dates'

import {
  useCreateMedicament,
  useTaxesQuery
} from '@renderer/services/medicaments.service'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useCallback, useMemo, useState } from 'react'
import { z } from 'zod'
import { calculatePPH } from '@renderer/utils/functions'
import SearchField from '@renderer/components/SearchField'
export const Route = createFileRoute('/_portal/medications/new')({
  component: NewMedicationPage
})

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  dci: z.array(z.string()).refine((data) => data.length > 0, {
    message: 'Required'
  }),
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
  laboratory: z.string().min(1),
  section: z.string().min(1),
  orderSystem: z.string().min(1),
  maxQuantity: z.number().default(0),
  minQuantity: z.number().default(0),
  usedBy: z
    .array(z.string(), {
      required_error: 'UsedBy is required'
    })
    .refine((data) => data.length > 0, { message: 'Required' }),
  withPrescription: z.string().default('no')
})

type Medicament = z.infer<typeof schema>

function NewMedicationPage() {
  const form = useForm<Medicament>({
    validate: zodResolver(schema),
    initialValues: {
      withPrescription: 'no',
      ppv: 0,
      pph: 0,
      pbr: 0,
      tva: 0,
      discount: 0,
      marge: 0,
      family: '',
      form: '',
      barCode: '',
      name: '',
      type: '',
      orderSystem: '',
      section: '',
      dosage: '',
      expirationDate: new Date(),
      laboratory: '',
      maxQuantity: 0,
      dci: [],
      usedBy: [],
      minQuantity: 0
    }
  })
  const { mutate } = useCreateMedicament()
  const { data: taxes } = useTaxesQuery()

  const taxTypesData = useMemo(() => {
    return taxes?.map((tax) => ({
      label: tax.name,
      value: tax.name,
      ...tax
    }))
  }, [taxes])

  const handleTaxTypeChange = useCallback(
    (item) => {
      form.setFieldValue('type', item.name)
      form.setFieldValue('tva', item.tva)
      form.setFieldValue('marge', item.marge)
      form.setFieldValue('discount', item.salesDiscountRate)
      form.setFieldValue('pph', calculatePPH(form.getValues().ppv, item.marge))
    },
    [form.getValues().type]
  )
  return (
    <Container size="lg" bg="white" py="md" style={{ borderRadius: '10px' }}>
      <form
        onSubmit={form.onSubmit((values) => {
          mutate(
            {
              ...values,
              inventory: {
                quantity: 0,
                expirationDate: values.expirationDate,
                ppv: values.ppv,
                pph: values.pph
              }
            },
            {
              onSuccess: () => {
                form.reset()
              }
            }
          )
        })}
      >
        <Title mb="md" order={3}>
          Fiche Produit
        </Title>
        <Group grow align="start" gap="xl">
          <Stack gap="xs">
            <Group grow>
              <TextInput
                label="Nom de produit"
                {...form.getInputProps('name')}
              />
              <TextInput
                label="Code Barre"
                {...form.getInputProps('barCode')}
              />
              <SearchField
                setValue={(item) => form.setFieldValue('form', item.label)}
                label="From"
                searchUrl="/api/forms"
                queryKey="fromSearch"
                queryParamName="query"
                dataMapper={(item) => ({
                  value: item.id.toString(),
                  label: item.name
                })}
                error={form.getInputProps('form').error}
              />
            </Group>

            <Select
              label="Type"
              data={taxTypesData}
              {...form.getInputProps('type')}
              onChange={(_, item) => handleTaxTypeChange(item)}
            />
            <Group grow>
              <SearchField
                setValue={(item) => form.setFieldValue('family', item.label)}
                label="Famille"
                searchUrl="/api/families"
                queryKey="familySearch"
                queryParamName="query"
                dataMapper={(item) => ({
                  value: item.id.toString(),
                  label: item.name
                })}
                error={form.getInputProps('family').error}
              />
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
            <Select
              label="Laboratoire"
              data={['ABC Laboratory']}
              {...form.getInputProps('laboratory')}
            />
            <Group grow>
              <Select
                label="Système de commande"
                data={[
                  'MANUEL',
                  'STOCK MINIMUM ET STOCK MAXIMUM',
                  'COMMANDE=VENTES DE LA JOURNÉE',
                  'COUVERTURE DE STOCK'
                ]}
                {...form.getInputProps('orderSystem')}
              />
              {form.getValues().orderSystem ===
                'STOCK MINIMUM ET STOCK MAXIMUM' && (
                <Group grow>
                  <NumberInput
                    min={0}
                    decimalScale={0}
                    label="Min Quantity"
                    {...form.getInputProps('minQuantity')}
                  />
                  <NumberInput
                    min={form.getValues().minQuantity}
                    decimalScale={0}
                    label="Max Quantity"
                    {...form.getInputProps('maxQuantity')}
                  />
                </Group>
              )}
            </Group>
          </Stack>
          <Stack gap="xs">
            <Select
              label="Section"
              data={['Fridge']}
              {...form.getInputProps('section')}
            />
            <Group grow>
              <NumberInput
                label="TVA %"
                readOnly
                value={form.getValues().tva}
              />
              <NumberInput
                label="Marge %"
                readOnly
                value={form.getValues().marge}
              />
            </Group>
            <Textarea
              label="Dosage"
              rows={2}
              {...form.getInputProps('dosage')}
            />
            <Checkbox.Group
              label="Usage"
              {...form.getInputProps('usedBy', { type: 'checkbox' })}
            >
              <Group grow>
                <Checkbox mt="md" label="Adult" value="adult" />
                <Checkbox mt="md" label="Child" value="child" />
                <Checkbox mt="md" label="Infant" value="infant" />
              </Group>
            </Checkbox.Group>
            <Radio.Group
              name="favoriteFramework"
              label="Ordonnancier"
              {...form.getInputProps('withPrescription')}
            >
              <Group grow>
                <Radio mt="md" label="Oui" value="yes" />
                <Radio mt="md" label="Non" value="no" />
              </Group>
            </Radio.Group>
          </Stack>
        </Group>
        <Divider my="md" />
        <Title order={3} mb="md">
          Première Inventaire de Produit
        </Title>
        <Group grow>
          <DatePickerInput
            label="Expiration Date"
            {...form.getInputProps('expirationDate')}
          />
          <NumberInput
            label="Prix Public de Vente "
            {...form.getInputProps('ppv')}
            min={0}
            decimalScale={2}
            onChange={(value) => {
              form.setFieldValue('ppv', value as number)
              form.setFieldValue(
                'pph',
                calculatePPH(value as number, form.getValues().marge)
              )
            }}
          />
          <NumberInput
            label="Prix d'Achat Moyenne"
            readOnly
            {...form.getInputProps('pph')}
            decimalScale={2}
          />
          <NumberInput
            label="Taux de Remboursement Sécurité Sociale"
            {...form.getInputProps('pbr')}
            min={0}
            decimalScale={2}
          />
        </Group>
        <Button type="submit" mt="md">
          Enregistrer
        </Button>
      </form>
    </Container>
  )
}
