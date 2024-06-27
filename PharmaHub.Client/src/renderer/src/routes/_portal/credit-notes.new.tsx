import { Tabs } from '@mantine/core'
import CreditNoteForm from '@renderer/components/CreditNotes/CreditNoteForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/credit-notes/new')({
  component: CreditNotesPage
})

function CreditNotesPage() {
  return (
    <Tabs defaultValue="create">
      <Tabs.List>
        <Tabs.Tab value="create">Emission Avoir</Tabs.Tab>
        <Tabs.Tab value="view">Consultation Avoirs</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="create">
        <CreditNoteForm />
      </Tabs.Panel>
      <Tabs.Panel value="view">Consultation Avoirs</Tabs.Panel>
    </Tabs>
  )
}

export default CreditNotesPage
