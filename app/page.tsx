"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Adaline from "@/components/Adaline/adaline";
import InkwellGallery from "@/components/InkwellGallery/InkwellGallery";
import Redo from "@/components/Redo/Redo";
import Serious from "@/components/Serious/serious";
import MomentForYou from "@/components/Scratch/scratch";
import HoverCards from "@/components/HoverCard/HoverCard";

import BentoBox from "@/components/BentoBox/bentobox";
import Stats from "@/components/stats/stats";
import BentoSlider from "@/components/BentoSlider/bentoslider";
// import BentoBox from "@/components/BentoBox/bentobox";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

   
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(id);
      lenis.destroy();
      gsap.ticker.remove(ticker); 
    };
  }, []);

  return (
    <>
      {/* <Adaline /> */}
      {/* <Redo/>
      <Serious/>
      <InkwellGallery /> */}
      {/* <div className="mt-20 h-100vh">
<img src="/card_cover_1.jpg" alt="Hero Image" className="w-full h-auto object-cover" />

      </div> */}
      <Stats/>
      {/* <BentoBox/> */}
      {/* <BentoStack/> */}
      <BentoSlider/>
      <MomentForYou/>
      <HoverCards/>
    </>
  );
}
