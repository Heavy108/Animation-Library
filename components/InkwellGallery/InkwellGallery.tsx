"use client";

import { useRef } from "react";
import styles from "./InkwellGallery.module.css";
import collection from "./collection";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface TransformState {
  currentRotation: number;
  targetRotation: number;
  currentScale: number;
  targetScale: number;
  currentX: number;
  targetX: number;
  currentY: number;
  targetY: number;
  angle: number;
}

export default function InkwellGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (context) => {
      const gallery = galleryRef.current!;
      const galleryContainer = galleryContainerRef.current!;
      const titleContainer = titleContainerRef.current!;
      const centerText = centerTextRef.current!;

      gallery.innerHTML = "";
      titleContainer.innerHTML = "";

      const cards: HTMLDivElement[] = [];
      const transformState: TransformState[] = [];

      const config = {
        imageCount: 25,
        radius: 275,
        autoRotateSpeed: 0.1,
        sensitivity: 500,
        effectFalloff: 250,
        cardMoveAmount: 50,
        isMobile: window.innerWidth < 1000,
      };

      const parallaxState = {
        targetX: 0,
        targetY: 0,
        targetZ: 0,
        currentX: 0,
        currentY: 0,
        currentZ: 0,
        lerpFactor: 0.1,
      };

      let rotationValue = 0;
      let isZoomedIn = false;
      let isPaused = false;
      let activeIndex = -1;
      let focusedCard: HTMLDivElement | null = null;

      /* ---------------- CREATE CARDS ---------------- */

      for (let i = 0; i < config.imageCount; i++) {
        const angle = (i / config.imageCount) * Math.PI * 2;
        const x = config.radius * Math.cos(angle);
        const y = config.radius * Math.sin(angle);
        const cardIndex = i % collection.length;

        const card = document.createElement("div");
        card.className = styles.card;
        card.dataset.title = collection[cardIndex].title;

        const img = document.createElement("img");
        img.src = collection[cardIndex].img;
        card.appendChild(img);

        gsap.set(card, {
          x,
          y,
          rotation: (angle * 180) / Math.PI + 90,
          transformPerspective: 800,
        });

        transformState.push({
          currentRotation: 0,
          targetRotation: 0,
          currentScale: 1,
          targetScale: 1,
          currentX: 0,
          targetX: 0,
          currentY: 0,
          targetY: 0,
          angle,
        });

        card.addEventListener("click", () => {
          if (!isZoomedIn) return;

          if (isPaused && focusedCard === card) {
            isPaused = false;
            gsap.to(card, { scale: 1, duration: 0.3 });
            focusedCard = null;
          } else {
            isPaused = true;
            if (focusedCard) gsap.to(focusedCard, { scale: 1, duration: 0.3 });

            gsap.to(card, {
              scale: 1.3,
              duration: 0.4,
              ease: "back.out(1.5)",
            });

            focusedCard = card;
          }
        });

        gallery.appendChild(card);
        cards.push(card);
      }

      /* ---------------- EVENTS ---------------- */

      const handleMouseMove = (e: MouseEvent) => {
        if (isZoomedIn || config.isMobile) return;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const percentX = (e.clientX - centerX) / centerX;
        const percentY = (e.clientY - centerY) / centerY;

        parallaxState.targetY = percentX * 15;
        parallaxState.targetX = -percentY * 15;
        parallaxState.targetZ = (percentX + percentY) * 5;

        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.sensitivity) {
            const flipFactor = Math.max(0, 1 - distance / config.effectFalloff);

            const angle = transformState[index].angle;
            const moveAmount = config.cardMoveAmount * flipFactor;

            transformState[index].targetRotation = 180 * flipFactor;
            transformState[index].targetScale = 1 + 0.3 * flipFactor;
            transformState[index].targetX = moveAmount * Math.cos(angle);
            transformState[index].targetY = moveAmount * Math.sin(angle);
          } else {
            transformState[index].targetRotation = 0;
            transformState[index].targetScale = 1;
            transformState[index].targetX = 0;
            transformState[index].targetY = 0;
          }
        });
      };

      document.addEventListener("mousemove", handleMouseMove);

      /* ---------------- SCROLL TRIGGER ---------------- */

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=800",
        pin: true,
        pinSpacing: true,
       onEnter: () => {
  if (!isZoomedIn) {
    isZoomedIn = true;
    isPaused = false;

    /* -------- RESET PARALLAX COMPLETELY -------- */

    parallaxState.targetX = 0;
    parallaxState.targetY = 0;
    parallaxState.targetZ = 0;
    parallaxState.currentX = 0;
    parallaxState.currentY = 0;
    parallaxState.currentZ = 0;

    gsap.set(galleryContainer, {
      rotateX: 0,
      rotateY: 0,
      rotation: 0,
    });

    /* -------- RESET ALL CARD INTERACTION STATE -------- */

    transformState.forEach((state) => {
      state.targetRotation = 0;
      state.currentRotation = 0;

      state.targetScale = 1;
      state.currentScale = 1;

      state.targetX = 0;
      state.currentX = 0;

      state.targetY = 0;
      state.currentY = 0;
    });

    /* -------- FORCE CARDS INTO CLEAN CIRCLE POSITION -------- */

    cards.forEach((card, i) => {
      const angle = transformState[i].angle;

      gsap.set(card, {
        x: config.radius * Math.cos(angle),
        y: config.radius * Math.sin(angle),
        rotationY: 0,
        scale: 1,
      });
    });

    /* -------- ZOOM ANIMATION -------- */

    gsap.to(gallery, {
      scale: 5,
      y: 1300,
      duration: 2,
      ease: "expo.inOut",
    });

    gsap.to(centerText, {
      opacity: 0,
      duration: 0.5,
    });
  }
},
        onLeaveBack: () => {
          isZoomedIn = false;
          isPaused = false;

          if (focusedCard) {
            gsap.to(focusedCard, { scale: 1, duration: 0.3 });
            focusedCard = null;
          }

          titleContainer.innerHTML = "";

          gsap.to(gallery, {
            scale: 1,
            y: 0,
            duration: 1.5,
            ease: "power3.inOut",
          });

          gsap.to(centerText, { opacity: 1, duration: 0.5 });
        },
      });

      /* ---------------- TICKER (FULL ORIGINAL LOGIC) ---------------- */

      const tick = () => {
        if (isPaused) return;

        rotationValue -= config.autoRotateSpeed;
        gsap.set(gallery, { rotation: rotationValue });

        if (!isZoomedIn) {
          parallaxState.currentX +=
            (parallaxState.targetX - parallaxState.currentX) *
            parallaxState.lerpFactor;
          parallaxState.currentY +=
            (parallaxState.targetY - parallaxState.currentY) *
            parallaxState.lerpFactor;
          parallaxState.currentZ +=
            (parallaxState.targetZ - parallaxState.currentZ) *
            parallaxState.lerpFactor;

          gsap.set(galleryContainer, {
            rotateX: parallaxState.currentX,
            rotateY: parallaxState.currentY,
            rotation: parallaxState.currentZ,
          });

          cards.forEach((card, index) => {
            const state = transformState[index];

            state.currentRotation +=
              (state.targetRotation - state.currentRotation) *
              parallaxState.lerpFactor;
            state.currentScale +=
              (state.targetScale - state.currentScale) *
              parallaxState.lerpFactor;
            state.currentX +=
              (state.targetX - state.currentX) * parallaxState.lerpFactor;
            state.currentY +=
              (state.targetY - state.currentY) * parallaxState.lerpFactor;

            const baseX = config.radius * Math.cos(state.angle);
            const baseY = config.radius * Math.sin(state.angle);

            gsap.set(card, {
              x: baseX + state.currentX,
              y: baseY + state.currentY,
              rotationY: state.currentRotation,
              scale: state.currentScale,
            });
          });
        }

        /* -------- TITLE LOGIC RESTORED -------- */

        if (isZoomedIn) {
          const degreesPerCard = 360 / config.imageCount;
          let normalized = rotationValue % 360;
          if (normalized < 0) normalized += 360;

          const rawIndex = Math.round((270 - normalized) / degreesPerCard);

          const currentIndex =
            ((rawIndex % config.imageCount) + config.imageCount) %
            config.imageCount;

          if (activeIndex !== currentIndex) {
            activeIndex = currentIndex;

            titleContainer.innerHTML = "";
            const p = document.createElement("p");
            p.textContent = cards[currentIndex].dataset.title!;
            titleContainer.appendChild(p);

            const split = new SplitText(p, {
              type: "words",
              wordsClass: styles.word,
            });

            gsap.from(split.words, {
              y: "125%",
              duration: 0.5,
              stagger: 0.03,
              ease: "power4.out",
            });
          }
        }
      };

      gsap.ticker.add(tick);

      /* ---------------- CLEANUP (SAFE) ---------------- */

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        gsap.ticker.remove(tick);
        context.revert(); // 🔥 scoped cleanup only
      };
    },
    { scope: containerRef },
  );

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.container}>
        <div ref={galleryContainerRef} className={styles.galleryContainer}>
          <div ref={galleryRef} className={styles.gallery}></div>
        </div>

        <div ref={centerTextRef} className={styles.centerText}>
          <h1>The Collection</h1>
        </div>

        <div ref={titleContainerRef} className={styles.titleContainer}></div>
      </div>
    </div>
  );
}
