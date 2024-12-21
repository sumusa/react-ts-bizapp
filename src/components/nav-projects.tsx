import { Link, useLocation } from "react-router-dom";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const location = useLocation();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Support</SidebarGroupLabel>
      <SidebarMenu className="space-y-1.5">
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              tooltip={item.name}
              data-active={location.pathname === item.url}
              className={cn(
                "transition-all duration-200 py-1.5 hover:bg-accent hover:text-accent-foreground",
                location.pathname === item.url &&
                  "bg-muted font-medium text-foreground"
              )}
            >
              <Link to={item.url}>
                <item.icon
                  className={cn(
                    "transition-transform mr-2",
                    location.pathname === item.url && "text-primary",
                    "group-hover:text-accent-foreground"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
