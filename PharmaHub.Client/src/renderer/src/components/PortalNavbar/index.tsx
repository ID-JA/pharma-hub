import { useState } from 'react'
import {
  IconLogout,
  IconDashboard,
  IconPill,
  IconBox,
  IconHistory,
  IconTruckDelivery,
  IconSettings
} from '@tabler/icons-react'
import classes from './PortalNavbar.module.css'
import { Link } from '@tanstack/react-router'
import { Code, Title } from '@mantine/core'

const data = [
  { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { link: '/sales', label: 'Sales', icon: IconBox },
  { link: '/medicaments', label: 'Medicaments', icon: IconPill },
  { link: '/dashboard', label: 'Orders', icon: IconTruckDelivery },
  { link: '/dashboard', label: 'Stock History', icon: IconHistory }
]

export function PortalNavbar() {
  const links = data.map((item) => (
    <Link
      to={item.link}
      href={item.link}
      className={classes.link}
      activeProps={{ className: classes.activeLink }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ))

  return (
    <>
      <Title c="green" order={4} mb="xl">
        PharmaHub App <Code>v0.0.1</Code>
      </Title>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <Link
          to="/settings"
          className={classes.link}
          activeProps={{ className: classes.activeLink }}
        >
          <IconSettings className={classes.linkIcon} stroke={1.5} />
          <span>Settings</span>
        </Link>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </>
  )
}
