import "@/styles/globals.css";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { PathBreadcrumb } from "@/components/common/breadcrumb";
import { SafeAppSidebar } from "@/components/sidebar/safe-app-sidebar";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <SafeAppSidebar />
      <main className="w-full overflow-y-auto">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <PathBreadcrumb />
          </div>
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
}
