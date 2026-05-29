import { Navbar } from "@/components/navbar";
import CustomCursor from "@/components/ui/CustomCursor";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <CustomCursor />
            <Navbar />
            <main className="w-full flex-grow overflow-x-clip">
                {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
                {/* Footer content can go here if needed later */}
            </footer>
        </div>
    );
}
