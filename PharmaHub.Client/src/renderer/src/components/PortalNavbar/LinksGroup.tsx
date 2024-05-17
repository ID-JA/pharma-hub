import { Box, Collapse, Group, UnstyledButton, rem } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import classes from './PortalNavbar.module.css'
import { Link } from '@tanstack/react-router'

export function LinksGroup({ icon: Icon, label, to, initiallyOpened, links }: any) {
  const hasLinks = Array.isArray(links)
  const [opened, setOpened] = useState(initiallyOpened || false)

  const items = useMemo(() => {
    return hasLinks
      ? links.map((subLink) => (
          <Link
            key={subLink.label}
            to={subLink.to}
            className={classes.link}
            activeOptions={{ exact: subLink.exact }}
            activeProps={{ className: classes.activeLink }}
          >
            {subLink.label}
          </Link>
        ))
      : []
  }, [hasLinks, links])

  const handleToggle = () => {
    setOpened((prevOpened) => !prevOpened)
  }

  return (
    <>
      {hasLinks ? (
        <>
          <UnstyledButton onClick={handleToggle} className={classes.control}>
            <Group justify="space-between" gap={0}>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Icon className={classes.linkIcon} stroke={1.5} />
                <Box ml="md">{label}</Box>
              </Box>
              {hasLinks && (
                <IconChevronRight
                  className={classes.chevron}
                  stroke={1.5}
                  style={{
                    width: rem(16),
                    height: rem(16),
                    transform: opened ? 'rotate(-90deg)' : 'none'
                  }}
                />
              )}
            </Group>
          </UnstyledButton>
          {hasLinks && <Collapse in={opened}>{items}</Collapse>}
        </>
      ) : (
        <Link to={to} className={classes.control} activeProps={{ className: classes.activeLink }}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Icon className={classes.linkIcon} stroke={1.5} />
            <Box ml="md">{label}</Box>
          </Box>
        </Link>
      )}
    </>
  )
}
