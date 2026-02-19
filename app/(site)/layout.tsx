import { Navbar } from "@/components/navbar";
import CustomCursor from "@/components/ui/CustomCursor";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex flex-col h-screen">
            <CustomCursor />
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
                {/* Footer content can go here if needed later */}
            </footer>
        </div>
    );
}
