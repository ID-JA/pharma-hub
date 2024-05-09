"use client";
import { AppShell, Burger, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PortalNavbar } from "@/components/navbar/navbar";
import { ReactNode } from "react";

function PortalLayout({ children }:{children:ReactNode}) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Text>PharmaHub</Text>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <PortalNavbar />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default PortalLayout;
