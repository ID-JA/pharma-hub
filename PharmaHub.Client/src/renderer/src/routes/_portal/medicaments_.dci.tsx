import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/medicaments/dci')({
  component: () => <div>Hello /_portal/medicaments/dci!</div>
})