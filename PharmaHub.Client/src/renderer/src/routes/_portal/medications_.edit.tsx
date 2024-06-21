import { createFileRoute } from '@tanstack/react-router'
import { useMedications } from './credit-notes.new'

export const Route = createFileRoute('/_portal/medications/edit')({
  component: UpdateMedicationDetail
})

function UpdateMedicationDetail() {
  const { data } = useMedications({ searchValue: '', searchFieldName: '' })
  return <div>{JSON.stringify(data)}</div>
}

export default UpdateMedicationDetail
