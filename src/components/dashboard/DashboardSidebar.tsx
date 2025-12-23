"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Logo from "@/components/common/Logo";
import { UserNav } from "./UserNav";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Perform logout logic here
    router.push('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                onClick={() => router.push(item.href)}
                tooltip={item.label}
              >
                <span>
                  <item.icon />
                  <span>{item.label}</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex w-full items-center justify-between p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <div className="group-data-[collapsible=icon]:hidden">
             <UserNav />
          </div>
          <SidebarMenuButton size="icon" variant="ghost" className="h-8 w-8 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10" onClick={handleLogout} tooltip="Log out">
             <LogOut />
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
