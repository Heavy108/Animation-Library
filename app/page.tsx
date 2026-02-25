"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Adaline from "@/components/Adaline/adaline";
import InkwellGallery from "@/components/InkwellGallery/InkwellGallery";
import Redo from "@/components/Redo/Redo";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    // ✅ Store the reference so we can remove the exact same function later
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // ✅ Timeout gives both pinned ScrollTriggers time to insert
    // their spacer divs before we recalculate trigger positions
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(id);
      lenis.destroy();
      gsap.ticker.remove(ticker); // ✅ Same reference — actually removes it
    };
  }, []);

  return (
    <>
      <Adaline />
      <Redo/>
      <InkwellGallery />
    </>
  );
}
