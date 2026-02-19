import { Sidebar } from "@/components/saas/Sidebar";
import { TopBar } from "@/components/saas/TopBar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-default-50 dark:bg-background text-foreground">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden relative">
                <TopBar />
                <main className="flex-1 overflow-y-scroll p-6 scrollbar-hide">
                    {children}
                </main>
            </div>
        </div>
    );
}
