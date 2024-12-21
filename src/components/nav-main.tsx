"use client";

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

export function NavMain({
  items,
}: {
  items: {
    title?: string;
    name?: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  const location = useLocation();

  const isActiveLink = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + "/");
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu className="space-y-1.5">
        {items.map((item) => (
          <SidebarMenuItem key={item.title || item.name}>
            <SidebarMenuButton
              asChild
              tooltip={item.title || item.name}
              data-active={isActiveLink(item.url)}
              className={cn(
                "transition-all duration-200 py-1.5 hover:bg-accent hover:text-accent-foreground",
                isActiveLink(item.url) &&
                  "bg-muted font-medium text-accent-foreground"
              )}
            >
              <Link to={item.url}>
                {item.icon && (
                  <item.icon
                    className={cn(
                      "transition-transform ml-.5 mr-4 h-5 w-5",
                      isActiveLink(item.url) &&
                        "font-medium text-accent-foreground",
                      "hover:text-accent-foreground"
                    )}
                  />
                )}
                <span>{item.title || item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
