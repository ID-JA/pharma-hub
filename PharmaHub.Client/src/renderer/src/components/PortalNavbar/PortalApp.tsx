import { ActionIcon, Group } from '@mantine/core'
import classes from './PortalApp.module.css'
import { NewNavbar } from './NewNavbr'
import { useEffect, useRef, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import {
  IconArrowLeft,
  IconArrowRight,
  IconLayoutSidebar
} from '@tabler/icons-react'
import { Outlet } from '@tanstack/react-router'

function PortalApp() {
  const navbarRef = useRef<HTMLDivElement>(null)
  const [opened, { open, toggle }] = useDisclosure(true)
  const [buttonVisible, setButtonVisible] = useState(false)

  const handleToggle = () => {
    toggle()
  }

  const handleTransitionEnd = () => {
    setButtonVisible(!opened)
  }

  useEffect(() => {
    const onTransitionEnd = () => {
      handleTransitionEnd()
    }

    const navbarContainerElement = navbarRef.current
    if (navbarContainerElement) {
      navbarContainerElement.addEventListener('transitionend', onTransitionEnd)
    }

    return () => {
      if (navbarContainerElement) {
        navbarContainerElement.removeEventListener(
          'transitionend',
          onTransitionEnd
        )
      }
    }
  }, [handleTransitionEnd])

  return (
    <div>
      <nav
        className={classes.navbar}
        ref={navbarRef}
        data-state={opened ? 'opened' : 'closed'}
      >
        <div className={classes.navbarInner}>
          <NewNavbar />
        </div>
      </nav>
      <main className={classes.main} data-state={opened ? 'opened' : 'closed'}>
        <div className={classes.sidebarToggle}>
          <ActionIcon radius="xl" onClick={toggle}>
            {opened ? (
              <IconArrowLeft size="1.5rem" />
            ) : (
              <IconArrowRight size="1.5rem" />
            )}
          </ActionIcon>
        </div>
        <Outlet />
      </main>
    </div>
  )
}

export default PortalApp
