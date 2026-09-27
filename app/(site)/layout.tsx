import { Navbar } from "@/components/navbar";
import CustomCursor from "@/components/ui/CustomCursor";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div id="top" className="relative flex min-h-screen flex-col">
            <CustomCursor />
            <Navbar />
            <main id="main-content" tabIndex={-1} className="w-full flex-grow overflow-x-clip">
                {children}
            </main>
        </div>
    );
}
