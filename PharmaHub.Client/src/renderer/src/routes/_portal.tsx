import { createFileRoute } from '@tanstack/react-router'
import PortalApp from '@renderer/components/PortalNavbar/PortalApp'

export const Route = createFileRoute('/_portal')({
  component: PortalLayout
})

function PortalLayout() {
  return <PortalApp />
}
