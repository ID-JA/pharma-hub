import {
  IconLogout,
  IconDashboard,
  IconPill,
  IconBox,
  IconTruckDelivery,
  IconBuildingWarehouse,
  IconSettings
} from '@tabler/icons-react'
import classes from './PortalNavbar.module.css'
import { Link } from '@tanstack/react-router'
import { Box, Code, Title } from '@mantine/core'
import { LinksGroup } from './LinksGroup'

const data = [
  { to: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/sales', label: 'Sales', icon: IconBox },
  {
    label: 'Stock',
    icon: IconBuildingWarehouse,
    links: [
      { label: 'Consultation', to: '/medicaments/consultation', exact: true },
      { label: 'Inventory History', to: '/medicaments/forms' },
      { label: 'DCIs', to: '/medicaments/dci' },
      { label: 'Forms', to: '/medicaments/forms' }
    ]
  },
  { to: '/dashboard', label: 'Orders', icon: IconTruckDelivery }
]

export function PortalNavbar() {
  const links = data.map((item) => <LinksGroup {...item} key={item.label} />)

  return (
    <>
      <Title c="green" order={4} mb="xl">
        PharmaHub App <Code>v0.0.1</Code>
      </Title>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <Link
          to="/settings"
          className={classes.control}
          activeProps={{ className: classes.activeLink }}
        >
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <IconSettings className={classes.linkIcon} stroke={1.5} />
            <Box ml="md">Settings</Box>
          </Box>
        </Link>

        <a href="#" className={classes.control} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </>
  )
}
