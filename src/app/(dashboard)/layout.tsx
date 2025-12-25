"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import Header from "@/components/dashboard/Header";
import Chatbot from "@/components/chatbot/Chatbot";
import { useUser } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!isUserLoading && !user) {
      router.replace("/login");
    }
  }, [isUserLoading, user, router]);

  // While loading, show a skeleton screen.
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
      </div>
    );
  }

  // If loading is finished and there's a user, show the dashboard.
  if (user) {
    return (
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
          </main>
          <Chatbot />
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // If not loading and no user, this will be briefly rendered before the redirect effect runs.
  // You can show a message or a blank screen.
  return null;
}
