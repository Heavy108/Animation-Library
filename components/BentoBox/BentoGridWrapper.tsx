// "use client";

// import { useRef } from "react";
// import styles from "./bentobox.module.css";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";
// import
// gsap.registerPlugin(ScrollTrigger);

// const BentoStack = () => {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useGSAP(
//     () => {
//       const slides = gsap.utils.toArray(".bentoSlide");

//       gsap.set(slides, { yPercent: 100 });
//       gsap.set(slides[0], { yPercent: 0 }); // first visible

//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "top top",
//           end: "+=300%", // 3 slides
//           scrub: true,
//           pin: true,
//         },
//       });

//       slides.forEach((slide: any, i) => {
//         if (i === 0) return;

//         tl.to(slide, {
//           yPercent: 0,
//           ease: "none",
//         });
//       });
//     },
//     { scope: containerRef },
//   );

//   return (
//     <section ref={containerRef} className={styles.wrapper}>
//       <div className={styles.pinnedContainer}>
//         <div className="bentoSlide">
//           <BentoGrid
//             stat1="500K+"
//             label1="Participants"
//             stat2="100K+"
//             label2="Supporters"
//           />
//         </div>

//         <div className="bentoSlide">
//           <BentoGrid
//             stat1="250+"
//             label1="Retreats"
//             stat2="75K+"
//             label2="Volunteers"
//           />
//         </div>

//         <div className="bentoSlide">
//           <BentoGrid
//             stat1="60+"
//             label1="Countries"
//             stat2="1M+"
//             label2="Streams"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BentoStack;
