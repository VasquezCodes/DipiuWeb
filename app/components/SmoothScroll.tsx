"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis();

        // Sync Lenis scroll with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // Use GSAP ticker to drive Lenis for perfect synchronization
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        // Disable GSAP's lag smoothing to prevent stuttering with Lenis
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove((time) => {
                lenis.raf(time * 1000);
            });
        };
    }, []);

    return null;
}
