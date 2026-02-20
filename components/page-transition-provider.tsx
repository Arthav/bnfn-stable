"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useRef } from "react";

function FrozenRouter(props: { children: React.ReactNode }) {
    const context = useContext(LayoutRouterContext);
    const frozen = useRef(context).current;

    if (!frozen) {
        return <>{props.children}</>;
    }

    return (
        <LayoutRouterContext.Provider value={frozen}>
            {props.children}
        </LayoutRouterContext.Provider>
    );
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                className="h-full"
            >
                <FrozenRouter>{children}</FrozenRouter>
            </motion.div>
        </AnimatePresence>
    );
}
// Note: Determining if FrozenRouter is truly needed with template.tsx.
// If using template.tsx, the template unmounts.
// If we use AnimatePresence in layout.tsx wrapping children (which includes template),
// then when route changes, the OLD children (Old Template) are removed from tree.
// AnimatePresence keeps them.
// But standard Next.js Router might update the content *inside* the old template if we don't freeze it?
// Actually, template instance is unique key.
// Let's try simple AnimatePresence first. Wrapper div with key={pathname}.
