import { Group, Code, ScrollArea, rem } from "@mantine/core";
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from "@tabler/icons-react";
import classes from "./navbar.module.css";
import { LinksGroup } from "./navbar-links-group";
import {
  IconSettings,
  IconPill,
  IconBusinessplan,
  IconTruckDelivery,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
import Settings from "@/app/portal/settings/page";
const mockdata = [
  { label: "Dashboard", icon: IconGauge, href: "" },
  { label: "Orders", icon: IconTruckDelivery, href: "orders" },
  { label: "Drugs", icon: IconPill, href: "drugs" },
  { label: "Sales", icon: IconBusinessplan, href: "sales" },
  { label: "Settings", icon: IconSettings, href: "settings" },
  { label: "Supplier", icon: IconUserPlus, href: "suppliers" },
  { label: "Users", icon: IconUser, href: "users" },
];

export function PortalNavbar() {
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <ScrollArea className={classes.links}>
      <div className={classes.linksInner}>{links}</div>
    </ScrollArea>
  );
}
