import { Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/sales')({
  component: () => (
    <div>
      {/* Render Sub header */}
      I am Sales page's layout Render list of sales
      <Outlet />
    </div>
  )
})
