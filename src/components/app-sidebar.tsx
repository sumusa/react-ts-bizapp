import * as React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Wallet,
  StickyNote,
  HelpCircle,
  MessageSquare,
  Phone,
  Settings,
  Building2,
  // GalleryVerticalEnd,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "summie",
    email: "s@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Summie's Arts",
      logo: Building2,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      // items: [
      //   {
      //     title: "Overview",
      //     url: "/dashboard/overview",
      //   },
      //   {
      //     title: "Analytics",
      //     url: "/dashboard/analytics",
      //   },
      //   {
      //     title: "Reports",
      //     url: "/dashboard/reports",
      //   },
      // ],
    },
    {
      title: "Products",
      url: "/products",
      icon: Package,
      // items: [
      //   {
      //     title: "Inventory",
      //     url: "/products/inventory",
      //   },
      //   {
      //     title: "Categories",
      //     url: "/products/categories",
      //   },
      //   {
      //     title: "Management",
      //     url: "/products/management",
      //   },
      // ],
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
      // items: [
      //   {
      //     title: "All Orders",
      //     url: "/orders/all-orders",
      //   },
      //   {
      //     title: "Pending",
      //     url: "/orders/pending",
      //   },
      //   {
      //     title: "Completed",
      //     url: "/orders/completed",
      //   },
      // ],
    },
    {
      title: "Customers",
      url: "/customers",
      icon: Users,
      // items: [
      //   {
      //     title: "List",
      //     url: "/customers/list",
      //   },
      //   {
      //     title: "Groups",
      //     url: "/customers/groups",
      //   },
      //   {
      //     title: "Analytics",
      //     url: "/customers/analytics",
      //   },
      // ],
    },
    {
      title: "Finances",
      url: "/finances",
      icon: Wallet,
      // items: [
      //   {
      //     title: "Overview",
      //     url: "/finances/overview",
      //   },
      //   {
      //     title: "Transactions",
      //     url: "/finances/transactions",
      //   },
      //   {
      //     title: "Reports",
      //     url: "/finances/reports",
      //   },
      // ],
    },
    {
      title: "Notes",
      url: "/notes",
      icon: StickyNote,
      // items: [
      //   {
      //     title: "All Notes",
      //     url: "/notes/all-notes",
      //   },
      //   {
      //     title: "Recent",
      //     url: "/notes/recent",
      //   },
      //   {
      //     title: "Archive",
      //     url: "/notes/archive",
      //   },
      // ],
    },
  ],
  projects: [
    {
      name: "Help",
      url: "/support/help",
      icon: HelpCircle,
    },
    {
      name: "Feedback",
      url: "/support/feedback",
      icon: MessageSquare,
    },
    {
      name: "Contact",
      url: "/support/contact",
      icon: Phone,
    },
    {
      name: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={[...data.navMain, ...data.projects]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
