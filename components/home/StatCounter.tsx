"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate, motion, useMotionValue, useTransform } from "framer-motion";

interface StatCounterProps {
    value: string;
    label: string;
}

export default function StatCounter({ value, label }: StatCounterProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const count = useMotionValue(0);

    // Check if the value is something like "+200" or "98%"
    const numericPart = value.match(/\d+/);
    const prefix = value.startsWith('+') ? '+' : '';
    const suffix = value.endsWith('%') ? '%' : '';
    const target = numericPart ? parseInt(numericPart[0], 10) : 0;

    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(prefix + "0" + suffix);

    useEffect(() => {
        if (isInView && numericPart) {
            const controls = animate(count, target, {
                duration: 2,
                ease: "easeOut",
            });

            return controls.stop;
        }
    }, [isInView, target, count, numericPart]);

    // Use a simplified approach for SSR/Hydration and smooth updates
    useEffect(() => {
        return rounded.on("change", (v) => {
            setDisplayValue(`${prefix}${v}${suffix}`);
        });
    }, [rounded, prefix, suffix]);

    if (!numericPart) {
        return (
            <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-black text-white">{value}</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/70">{label}</span>
            </div>
        );
    }

    return (
        <div ref={ref} className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-white">
                {displayValue}
            </span>
            <span className="text-[10px] md:text-xs font-bold text-white/70">{label}</span>
        </div>
    );
}
