"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import styles from "./adalin.module.css";

export default function Adaline() {
  const containerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const canvasRef = useRef(null);
  const navRef = useRef(null);
  const headerRef = useRef(null);
  const heroImgRef = useRef(null);
  const contextRef = useRef(null);
  const videoFramesRef = useRef({ frame: 0 });
  const lenisRef = useRef(null);

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- LENIS ---------------- */

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  /* ---------------- GSAP ---------------- */

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      contextRef.current = context;

      const setCanvasSize = () => {
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * pixelRatio;
        canvas.height = window.innerHeight * pixelRatio;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(pixelRatio, pixelRatio);
      };

      setCanvasSize();

      const frameCount = 207;
      const currentFrame = (index) =>
        `/frames/frame_${(index + 1).toString().padStart(4, "0")}.jpg`;

      const images = [];
      let imagesLoaded = 0;

      const onImageLoad = () => {
        imagesLoaded++;
        if (imagesLoaded === frameCount) {
          render();
          setupScrollTrigger();
        }
      };

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = onImageLoad;
        img.onerror = onImageLoad;
        images.push(img);
      }

      const render = () => {
        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;

        context.clearRect(0, 0, canvasWidth, canvasHeight);

        const img = images[videoFramesRef.current.frame];
        if (!img || !img.complete) return;

        const imageAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, drawX, drawY;

        if (imageAspect > canvasAspect) {
          drawHeight = canvasHeight;
          drawWidth = drawHeight * imageAspect;
          drawX = (canvasWidth - drawWidth) / 2;
          drawY = 0;
        } else {
          drawWidth = canvasWidth;
          drawHeight = drawWidth / imageAspect;
          drawX = 0;
          drawY = (canvasHeight - drawHeight) / 2;
        }

        context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      };

      const setupScrollTrigger = () => {
        ScrollTrigger.create({
          trigger: heroSectionRef.current,
          start: "top top",
          end: `+=${window.innerHeight * 7}`,
          pin: true,
          pinSpacing: true,
          refreshPriority:1,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            const frameProgress = Math.min(progress / 0.9, 1);
            videoFramesRef.current.frame = Math.round(
              frameProgress * (frameCount - 1),
            );

            render();

            /* NAV FADE */
            gsap.set(navRef.current, {
              opacity: progress <= 0.1 ? 1 - progress / 0.1 : 0,
            });

            /* HEADER DEPTH */
            if (progress <= 0.25) {
              const translateZ = (progress / 0.25) * -500;
              const opacity = progress >= 0.2 ? 1 - (progress - 0.2) / 0.05 : 1;

              gsap.set(headerRef.current, {
                transform: `translate(-50%, -50%) translateZ(${translateZ}px)`,
                opacity,
              });
            } else {
              gsap.set(headerRef.current, { opacity: 0 });
            }

            /* HERO IMAGE */
            if (progress < 0.6) {
              gsap.set(heroImgRef.current, {
                transform: "translateZ(1000px)",
                opacity: 0,
              });
            } else {
              const imgProgress = (progress - 0.6) / 0.3;
              const translateZ = 1000 - imgProgress * 1000;

              gsap.set(heroImgRef.current, {
                transform: `translateZ(${translateZ}px)`,
                opacity: Math.min(imgProgress, 1),
              });
            }
          },
        });
      };

      const handleResize = () => {
        setCanvasSize();
        render();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <nav ref={navRef} className={styles.nav}>
        <div className={styles.navLinks}>
          <a href="#">Overview</a>
          <a href="#">Solutions</a>
          <a href="#">Resources</a>
        </div>

        <div className={styles.logo}>
          <a href="#">
            <img src="/logo.png" alt="" /> Byewind
          </a>
        </div>

        <div className={styles.navButtons}>
          <div className={`${styles.btn} ${styles.primary}`}>
            <a href="#">Live Demo</a>
          </div>
          <div className={`${styles.btn} ${styles.secondary}`}>
            <a href="#">Get Started</a>
          </div>
        </div>
      </nav>

      <section ref={heroSectionRef} className={styles.section}>
        <canvas ref={canvasRef} className={styles.canvas} />

        <div className={styles.heroContent}>
          <div className={styles.header} ref={headerRef}>
            <h1>One unified workspace to build, test, and ship AI faster</h1>
            <p>Trusted by</p>

            <div className={styles.clientLogos}>
              <div className={styles.clientLogo}>
                <img src="/client-logo-1.png" alt="" />
              </div>
              <div className={styles.clientLogo}>
                <img src="/client-logo-2.png" alt="" />
              </div>
              <div className={styles.clientLogo}>
                <img src="/client-logo-3.png" alt="" />
              </div>
              <div className={styles.clientLogo}>
                <img src="/client-logo-4.png" alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroImgContainer}>
          <div className={styles.heroImg} ref={heroImgRef}>
            <img src="/dashboard.png" alt="" />
          </div>
        </div>
      </section>

      <section className={styles.outro}>
        <h1>Join teams building faster with Byewind.</h1>
      </section>
    </div>
  );
}
