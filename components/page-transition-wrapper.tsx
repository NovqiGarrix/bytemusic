"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function PageTransitionWrapper({
    children
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [key, setKey] = useState(pathname);

    useEffect(() => {
        setKey(pathname);
    }, [pathname]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
