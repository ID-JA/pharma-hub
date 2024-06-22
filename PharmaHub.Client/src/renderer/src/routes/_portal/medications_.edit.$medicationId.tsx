import { createFileRoute } from '@tanstack/react-router'
import { useMedication } from './medicaments_.consultation'
import {
  Group,
  Stack,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Checkbox,
  Radio,
  Container,
  Title,
  Button,
  Loader,
  Flex,
  Divider,
  Box
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useTaxesQuery } from '@renderer/services/medicaments.service'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useMemo, useCallback } from 'react'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { http } from '@renderer/utils/http'
import { toast } from 'sonner'
import MedicationFamilySelector from '@renderer/components/Medicaments/MedicationFamilySelector'
import MedicationDciSelector from '@renderer/components/Medicaments/MedicationDciSelector'
import MedicationFormSelector from '@renderer/components/Medicaments/MedicationFormSelector'

export const Route = createFileRoute('/_portal/medications/edit/$medicationId')(
  {
    component: UpdateMedicationDetail
  }
)

const MedicationSchema = z.object({
  id: z.number().nonnegative(),
  name: z.string().min(1).optional(),
  dosage: z.string().min(1).optional(),
  barcode: z.string().min(1).optional(),
  dci: z.array(z.string()).optional(),
  form: z.string().min(1).optional(),
  family: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  laboratory: z.string().min(1).optional(),
  pfhtNotActive: z.number().nonnegative(),
  pfhtActive: z.number().nonnegative(),
  pamp: z.number().nonnegative().default(0),
  pbr: z.number().nonnegative(),
  tva: z.number().nonnegative(),
  marge: z.number().nonnegative(),
  discountRate: z.number().nonnegative(),
  reimbursementRate: z.number().nonnegative(),
  status: z.string().min(1).optional(),
  orderSystem: z.string().min(1).optional(),
  minQuantity: z.number().nonnegative(),
  maxQuantity: z.number().nonnegative(),
  usedBy: z.array(z.string()).optional(),
  withPrescription: z.string(),
  section: z.string().min(1).optional()
})

const MEDICATION_DEFAULT_VALUE = {
  id: 0,
  name: '',
  dosage: '',
  barcode: '',
  dci: [],
  form: '',
  family: '',
  type: '',
  laboratory: '',
  pfhtNotActive: 0,
  pfhtActive: 0,
  pamp: 0,
  pbr: 0,
  tva: 0,
  marge: 0,
  discountRate: 0,
  reimbursementRate: 0,
  status: '',
  orderSystem: '',
  quantity: 0,
  minQuantity: 0,
  maxQuantity: 0,
  usedBy: [],
  withPrescription: '',
  section: ''
}
type Medication = typeof MEDICATION_DEFAULT_VALUE

function UpdateMedicationDetail() {
  const { medicationId } = Route.useParams()
  const { data } = useMedication(medicationId)

  return (
    <Container size="lg" bg="white" style={{ borderRadius: '10px' }} mih="90vh">
      {data.id !== 0 ? (
        <Box py="md">
          <MedicationDetail data={data} />
          <Divider my="lg" />
          <PartialSaleConfig data={data} />
        </Box>
      ) : (
        <Flex h="100%" justify="center" align="center" mih="90vh">
          <Loader type="bars" />
        </Flex>
      )}
    </Container>
  )
}

export default UpdateMedicationDetail

function MedicationDetail({ data }) {
  const { data: taxes } = useTaxesQuery()
  const form = useForm<Medication>({
    initialValues: {
      ...data,
      withPrescription: data.withPrescription === true ? 'yes' : 'no'
    },
    validate: zodResolver(MedicationSchema)
  })
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
    },
    [form.getValues().type]
  )

  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: any) => {
      await http.put(`/api/medicaments/${data.id}`, {
        id: data.id,
        details: {
          ...values,
          inventory: {}
        }
      })
    },
    onSuccess: () => {
      toast.success('Mise à jour effectuée')
      form.resetDirty()
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['medicamentDetail', { id: data.id.toString() }]
      })
    },
    onError: () => {
      toast.error('Une erreur est survenue')
    }
  })

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        await mutateAsync(values)
      })}
    >
      <Title mb="md" order={3}>
        Modifié Fiche Produit
      </Title>
      <Group grow align="start" gap="xl">
        <Stack gap="xs">
          <TextInput label="Nom de produit" {...form.getInputProps('name')} />
          <MedicationFormSelector {...form.getInputProps('form')} />

          <MedicationDciSelector {...form.getInputProps('dci')} />
          <Select
            label="Type"
            data={taxTypesData}
            {...form.getInputProps('type')}
            onChange={(_, item) => handleTaxTypeChange(item)}
          />
          <MedicationFamilySelector {...form.getInputProps('family')} />

          <Select
            label="Laboratoire"
            data={['ABC Laboratory']}
            {...form.getInputProps('laboratory')}
          />
          <Group grow>
            <NumberInput
              label="Prix Fabricant Hors Taxe Actif"
              {...form.getInputProps('pfhtActive')}
            />
            <NumberInput
              label="Prix Fabricant Hors Taxe Non Actif"
              {...form.getInputProps('pfhtNotActive')}
            />
          </Group>
          {/* <NumberInput
        label="PRIX ACHAT MOYEN PONDÈRE"
        {...form.getInputProps('form')}
      /> */}
          <NumberInput
            label="Taux de Remboursement Sécurité Sociale"
            {...form.getInputProps('pbr')}
          />
        </Stack>
        <Stack gap="xs">
          <TextInput
            type="number"
            label="Code barre"
            {...form.getInputProps('barcode')}
          />
          <Select
            label="Section"
            data={['Fridge']}
            {...form.getInputProps('section')}
          />
          <Group grow>
            <NumberInput label="TVA %" readOnly value={form.getValues().tva} />
            <NumberInput
              label="Marge %"
              readOnly
              value={form.getValues().marge}
            />
          </Group>
          <Textarea label="Dosage" rows={4} {...form.getInputProps('dosage')} />
          <Group grow>
            <Select
              label="Système de commande"
              data={[
                'Manuel',
                'Stock Minimum Et Stock Maximum',
                'Commande = Ventes De La Journée',
                'Couverture De Stock'
              ]}
              {...form.getInputProps('orderSystem')}
            />
            {form.getValues().orderSystem ===
              'Stock Minimum Et Stock Maximum' && (
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
          <Checkbox.Group
            label="Usage"
            value={form.getInputProps('usedBy').value}
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
      <Button
        mt="lg"
        type="submit"
        disabled={!form.isDirty()}
        loading={isPending}
      >
        Valider les modifications
      </Button>
    </form>
  )
}

function PartialSaleConfig({ data }) {
  const form = useForm({
    initialValues: {
      isPartialSaleAllowed: data.isPartialSaleAllowed,
      unitPrice: data.unitPrice,
      saleUnits: data.saleUnits
    }
  })
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: any) => {
      await http.patch(`/api/medicaments/${data.id}`, values)
    },
    onSuccess: () => {
      toast.success('La configuration a été mise à jour avec succès.')
      form.resetDirty()
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['medicamentDetail', { id: data.id.toString() }]
      })
    }
  })
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        await mutateAsync(values)
      })}
    >
      <Title mb="md" order={3}>
        Vente Détail
      </Title>
      <Group grow align="center">
        <Checkbox
          label="Vente partielle"
          {...form.getInputProps('isPartialSaleAllowed', { type: 'checkbox' })}
        />
        <NumberInput
          min={0}
          disabled={!form.getValues().isPartialSaleAllowed}
          label="Nombre unités vente détail"
          {...form.getInputProps('saleUnits')}
        />
        <NumberInput
          min={0}
          disabled={!form.getValues().isPartialSaleAllowed}
          label="Prix vente au détail"
          {...form.getInputProps('unitPrice')}
        />
      </Group>
      <Button
        type="submit"
        mt="md"
        disabled={!form.isDirty()}
        loading={isPending}
      >
        Enregistre
      </Button>
    </form>
  )
}
