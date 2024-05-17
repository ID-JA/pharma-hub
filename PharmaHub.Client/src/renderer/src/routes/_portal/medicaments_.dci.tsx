import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/medicaments/dci')({
  component: DciPage
})

function DciPage() {
  return <div>DCI</div>
}
