"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import styles from "./stats2.module.css";

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PROJECTS = [
  { name: "Human Form Study", img: "/img1.jpeg" },
  { name: "Interior Light", img: "/img2.jpeg" },
  { name: "Project 21", img: "/img3.jpeg" },
  { name: "Shadow Portraits", img: "/img4.jpeg" },
  { name: "Everyday Objects", img: "/img5.jpeg" },
  { name: "Unit 07 Care", img: "/img6.jpeg" },
  { name: "Motion Practice", img: "/img7.jpeg" },
  { name: "Noonlight Series", img: "/img8.jpeg" },
  { name: "Material Stillness", img: "/img9.jpeg" },
  { name: "Quiet Walk", img: "/img10.jpeg" },
];

export default function ScrollAnimationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLElement>(null);
  const projectImagesContainerRef = useRef<HTMLDivElement>(null);
  const projectNamesContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null); // Ref for the main title

  // Refs for skipping
  const outroRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Arrays to hold refs for multiple elements
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const mobileNameRefs = useRef<(HTMLParagraphElement | null)[]>([]); // New ref for mobile text

  useGSAP(
    () => {
      // 1. Setup Lenis Smooth Scroll
      const lenis = new Lenis();
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // 2. Setup Animation Variables
      const totalProjectCount = PROJECTS.length;
      const spotlightSection = spotlightRef.current;
      const projectImagesContainer = projectImagesContainerRef.current;
      const projectNamesContainer = projectNamesContainerRef.current;

      if (
        !spotlightSection ||
        !projectImagesContainer ||
        !projectNamesContainer
      )
        return;

      setTimeout(() => {
        const spotlightSectionHeight = spotlightSection.offsetHeight;
        const spotlightSectionPadding = parseFloat(
          window.getComputedStyle(spotlightSection).padding,
        );
        const containerHeight = projectNamesContainer.offsetHeight;
        const imagesHeight = projectImagesContainer.offsetHeight;

        const moveDistanceNames =
          spotlightSectionHeight -
          spotlightSectionPadding * 2 -
          containerHeight;
        const moveDistanceImages = window.innerHeight - imagesHeight;

        const imgActivationThreshold = window.innerHeight / 2;

        // 3. Create ScrollTrigger
        ScrollTrigger.create({
          trigger: spotlightSection,
          start: "top top",
          end: `+=${window.innerHeight * 5}px`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const isDesktop = window.innerWidth > 1000;

            // --- FADE TITLE ON MOBILE ---
            // It fades out fully within the first 20% of the overall scroll
            if (titleRef.current) {
              if (!isDesktop) {
                gsap.set(titleRef.current, {
                  opacity: Math.max(0, 1 - progress * 5),
                });
              } else {
                gsap.set(titleRef.current, { opacity: 1 }); // Always visible on desktop
              }
            }

            const activeIndex = Math.min(
              Math.floor(progress * totalProjectCount),
              totalProjectCount - 1,
            );

            // Move the Images container (Always moves)
            gsap.set(projectImagesContainer, {
              y: progress * moveDistanceImages,
            });

            // Handle Image & Mobile Text Opacities
            imgRefs.current.forEach((img, index) => {
              if (!img) return;
              const imgRect = img.getBoundingClientRect();
              const imgTop = imgRect.top;
              const imgBottom = imgRect.bottom;
              const mobileText = mobileNameRefs.current[index];

              if (
                imgTop <= imgActivationThreshold &&
                imgBottom >= imgActivationThreshold
              ) {
                gsap.set(img, { opacity: 1 });
                // Fade in the text underneath the active image on mobile
                if (mobileText) gsap.set(mobileText, { opacity: 1 });
              } else {
                gsap.set(img, { opacity: 0.5 });
                // Dim the text underneath inactive images
                if (mobileText) gsap.set(mobileText, { opacity: 0.2 });
              }
            });

            // Handle Desktop Name Positions and Colors
            nameRefs.current.forEach((p, index) => {
              if (!p) return;

              if (isDesktop) {
                // DESKTOP: Keep text fixed at y: 0, just highlight active index
                gsap.set(p, { y: 0 });

                if (index === activeIndex) {
                  gsap.set(p, { color: "#fff" });
                } else {
                  gsap.set(p, { color: "#4a4a4a" });
                }
              }
              // We don't animate the desktop text list on mobile anymore, we just hide it in CSS
            });
          },
        });

        ScrollTrigger.refresh();
      }, 100);

      return () => {
        lenis.destroy();
        gsap.ticker.remove(lenis.raf);
        lenisRef.current = null;
      };
    },
    { scope: containerRef },
  );

  const handleSkip = () => {
    if (lenisRef.current && outroRef.current) {
      // Lenis smooth scrolls perfectly to the next section
      lenisRef.current.scrollTo(outroRef.current, { duration: 1.5 });
    }
  };

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.container} ref={containerRef}>
        <section
          className={`${styles.section} ${styles.spotlight}`}
          ref={spotlightRef}
        >
          <h2 className={styles.sectionTitle} ref={titleRef}>
            What we offer
          </h2>

          <div className={styles.projectImages} ref={projectImagesContainerRef}>
            {PROJECTS.map((project, index) => (
              <div key={`group-${index}`} className={styles.mobileGroup}>
                <div
                  className={styles.projectImg}
                  ref={(el) => {
                    imgRefs.current[index] = el;
                  }}
                >
                  <img src={project.img} alt={project.name} />
                </div>
                <p
                  className={styles.mobileName}
                  ref={(el) => {
                    mobileNameRefs.current[index] = el;
                  }}
                >
                  {project.name}
                </p>
              </div>
            ))}
          </div>

          <div className={styles.projectNames} ref={projectNamesContainerRef}>
            {PROJECTS.map((project, index) => (
              <p
                key={`name-${index}`}
                className={styles.normalText}
                ref={(el) => {
                  nameRefs.current[index] = el;
                }}
              >
                {project.name}
              </p>
            ))}
          </div>

          <button className={styles.skipButton} onClick={handleSkip}>
            Skip Section
          </button>
        </section>

        {/* --- ADD THIS BLOCK BACK IN --- */}
        {/* This is the target destination for the Skip Button */}
        <section className={`${styles.section} ${styles.outro}`} ref={outroRef}>
          <p className={styles.normalText}>This is the next section</p>
        </section>
        {/* ------------------------------ */}
      </div>
    </main>
  );
}
