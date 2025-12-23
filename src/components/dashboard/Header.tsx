"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "./UserNav";
import { usePathname } from "next/navigation";

const getTitle = (pathname: string) => {
    switch (pathname) {
        case "/dashboard":
            return "Dashboard";
        case "/history":
            return "Verification History";
        case "/settings":
            return "Settings";
        default:
            return "Dashboard";
    }
}

export default function Header() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:block">
            <UserNav />
        </div>
      </div>
    </header>
  );
}
