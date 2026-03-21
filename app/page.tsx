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
import Timeline from "@/components/Timeline/timeline";
import { Globe } from "@/components/ui/globe";
import WhatsHappeningCarousel from "@/components/EventCarousel/whatsHappening";
import DefaultDemo from "@/components/Parralax/zoom";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import Example from "@/components/image-gallery";
import InteractiveImageBentoGallery from "@/components/bento-gallery";
import InteractiveImageBentoGalleryDemo from "@/components/Parralax/bento";
// import BentoBox from "@/components/BentoBox/bentobox";

gsap.registerPlugin(ScrollTrigger);
const eventsData = [
  {
    id: 1,
    imageUrl: "/Events/event1.png",
    title: "Serene Saturday Meditation",
    tags: ["Meditation", "Satsang"],
    date: "Sat, 15 Feb • 7:00",
    location: "NJ Center",
  },
  {
    id: 2,
    imageUrl: "/Events/event2.png",
    title: "Soulful Thursdays Satsang",
    tags: ["Satsang", "Talk"],
    date: "Thu, 20 Feb • 6:30",
    location: "Online",
  },
  {
    id: 3,
    imageUrl: "/Events/event3.png",
    title: "Bridge Builders Youth Circle",
    tags: ["Talk", "Workshop"],
    date: "Sat, 22 Feb • 6:00",
    location: "NY Center",
  },
  {
    id: 4,
    imageUrl: "/Events/event1.png",
    title: "Community Weekend ",
    tags: ["Retreat", "Meditation"],
    date: "Sun, 23 Feb • 8:00",
    location: "NJ Center",
  },
  {
    id: 5,
    imageUrl: "/Events/event3.png",
    title: "Bridge Builders Youth Circle",
    tags: ["Talk", "Workshop"],
    date: "Sat, 22 Feb • 7:00",
    location: "NY Center",
  },
  {
    id: 6,
    imageUrl: "/Events/event1.png",
    title: "Community Weekend ",
    tags: ["Retreat", "Meditation"],
    date: "Sun, 23 Feb • 8:00",
    location: "NJ Center",
  },
  {
    id: 7,
    imageUrl: "/Events/event3.png",
    title: "Bridge Builders Youth Circle",
    tags: ["Talk", "Workshop"],
    date: "Sat, 22 Feb • 9:00",
    location: "NY Center",
  },
  {
    id: 8,
    imageUrl: "/Events/event1.png",
    title: "Community Weekend ",
    tags: ["Retreat", "Meditation"],
    date: "Sun, 23 Feb • 8:00",
    location: "NJ Center",
  },
  {
    id: 9,
    imageUrl: "/Events/event3.png",
    title: "Bridge Builders Youth Circle",
    tags: ["Talk", "Workshop"],
    date: "Sat, 22 Feb • 10:00",
    location: "NY Center",
  },
  {
    id: 10,
    imageUrl: "/Events/event1.png",
    title: "Community Weekend ",
    tags: ["Retreat", "Meditation"],
    date: "Sun, 23 Feb • 8:00",
    location: "NJ Center",
  },
];
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
      {/* 
      <Serious/>
       */}
      {/* <div className="mt-20 h-100vh">
<img src="/card_cover_1.jpg" alt="Hero Image" className="w-full h-auto object-cover" />

      </div> */}
      {/* <Stats/>
      <DefaultDemo/> */}
      <PortfolioGallery/>
      <Example/>
      <InteractiveImageBentoGalleryDemo/>
      {/* <BentoBox/> */}
      {/* <BentoStack/> */}
      {/* <WhatsHappeningCarousel slides={eventsData}/> */}
      {/* <Redo />
      <InkwellGallery /> */}
      {/* <Globe />
      <Timeline /> */}
      {/* <BentoSlider />
      <MomentForYou />
      <HoverCards /> */}
    </>
  );
}
