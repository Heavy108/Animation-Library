"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import WhatsHappeningCard, {
  WhatsHappeningCardProps,
} from "./whatsHappeningCard";
import styles from "./whatsHappening.module.css";
// import Title from "../Title";
// import Button from "../button";
// import { BlurShape } from "@/icons/icon";
interface WhatsHappeningCarouselProps {
  slides: WhatsHappeningCardProps[];
}

export default function WhatsHappeningCarousel({
  slides,
}: WhatsHappeningCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);

    const timer = setTimeout(() => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }, 0);

    return () => {
      clearTimeout(timer);
      emblaApi.off("reInit", onInit);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  return (
    <section className={styles.section}>
      {/* <div className={styles.blur}>
        <BlurShape />
        <BlurShape />
      </div>
      <div className={styles.header}>
        <Title text="What's Happening Now" />
        <p className="body-2">
          From weekly programs to annual retreats, there’s something here for
          you
        </p>
      </div> */}

      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {slides.map((slide, index) => (
            <div className={styles.slide} key={index}>
              <WhatsHappeningCard {...slide} />
            </div>
          ))}
        </div>
      </div>

      {/* Segmented Progress-Bar Navigation */}
      <div className={styles.progressNav}>
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`${styles.segment} ${
              index === selectedIndex ? styles.segmentActive : ""
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide group ${index + 1}`}
          />
        ))}
      </div>

      <div className={styles.buttonContainer}>
        <Button
          path="#"
          name="View All Events"
          color="#00AC8C"
          textColor="#fff"
          hasArrow
          hasArrowCircle
        />
      </div>
    </section>
  );
}
