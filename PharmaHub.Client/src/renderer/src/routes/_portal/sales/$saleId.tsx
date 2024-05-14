import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/sales/$saleId')({
  component: () => <div>Hello /_portal/sales/$saleId!(iam sale id )</div>
})
