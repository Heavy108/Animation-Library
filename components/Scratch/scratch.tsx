"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";
import styles from "./scratch.module.css";

/* ── Types ── */
type CardData = {
  id: string;
  label: string;
  cardClass: string;
  bgClass: string;
  quote: string;
  author: string;
  icon: (size?: number) => React.ReactNode;
};

/* ── Icons ── */
const CalmIcon = (size = 64) => (
  <svg viewBox="0 0 80 80" fill="none" width={size} height={size}>
    <circle cx="40" cy="40" r="18" stroke="white" strokeWidth="1.5" />
    <circle cx="40" cy="40" r="28" stroke="white" strokeWidth="1" />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
      <line
        key={deg}
        x1="40"
        y1="12"
        x2="40"
        y2="8"
        stroke="white"
        strokeWidth="1.5"
        transform={`rotate(${deg} 40 40)`}
      />
    ))}
    <path
      d="M40 22 L44 30 L40 38 L36 30 Z"
      stroke="white"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);
const ClarityIcon = (size = 64) => (
  <svg viewBox="0 0 80 80" fill="none" width={size} height={size}>
    <ellipse cx="40" cy="40" rx="22" ry="14" stroke="white" strokeWidth="1.5" />
    <circle cx="40" cy="40" r="6" stroke="white" strokeWidth="1.5" />
    <path d="M18 40 Q40 20 62 40" stroke="white" strokeWidth="1" fill="none" />
    <path d="M18 40 Q40 60 62 40" stroke="white" strokeWidth="1" fill="none" />
  </svg>
);
const StrengthIcon = (size = 64) => (
  <svg viewBox="0 0 80 80" fill="none" width={size} height={size}>
    <circle cx="40" cy="40" r="18" stroke="white" strokeWidth="1.5" />
    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
      <line
        key={deg}
        x1="40"
        y1="22"
        x2="40"
        y2="14"
        stroke="white"
        strokeWidth="1.5"
        transform={`rotate(${deg} 40 40)`}
      />
    ))}
    <circle cx="40" cy="40" r="8" stroke="white" strokeWidth="1.5" />
  </svg>
);
const GratitudeIcon = (size = 64) => (
  <svg viewBox="0 0 80 80" fill="none" width={size} height={size}>
    <polygon
      points="40,14 47,32 66,32 51,43 57,62 40,51 23,62 29,43 14,32 33,32"
      stroke="white"
      strokeWidth="1.5"
      fill="none"
    />
    <circle cx="40" cy="40" r="10" stroke="white" strokeWidth="1" />
  </svg>
);

const cards: CardData[] = [
  {
    id: "calm",
    label: "Calm",
    cardClass: styles.calm,
    bgClass: styles.calmBg,
    quote:
      "Within you, there is a stillness and a sanctuary to which you can retreat at any time.",
    author: "Hermann Hesse",
    icon: CalmIcon,
  },
  {
    id: "clarity",
    label: "Clarity",
    cardClass: styles.clarity,
    bgClass: styles.clarityBg,
    quote:
      "Clarity comes not from certainty, but from the willingness to look honestly at what is.",
    author: "Unknown",
    icon: ClarityIcon,
  },
  {
    id: "strength",
    label: "Strength",
    cardClass: styles.strength,
    bgClass: styles.strengthBg,
    quote:
      "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne",
    icon: StrengthIcon,
  },
  {
    id: "gratitude",
    label: "Gratitude",
    cardClass: styles.gratitude,
    bgClass: styles.gratitudeBg,
    quote:
      "Gratitude turns what we have into enough, and more. It turns denial into acceptance.",
    author: "Melodie Beattie",
    icon: GratitudeIcon,
  },
];

/* ─────────────────────── RevealCanvas ─────────────────────── */

function RevealCanvas({ bgClass }: { bgClass: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);

  /*
   * useLayoutEffect fires synchronously after DOM mutation, before paint.
   * At this point offsetWidth/offsetHeight on the parent are real pixels —
   * unlike useEffect which can fire after a zero-size first layout.
   *
   * We read the PARENT's dimensions (the modalCard div) since the canvas
   * itself reports 0×0 before its own attributes are set.
   *
   * The canvas is filled with the same gradient colour as the card background,
   * so it appears seamless. Drawing uses destination-out to punch transparent
   * holes — revealing the text layer (z-index:1) beneath.
   */
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const w = parent.offsetWidth;
    const h = parent.offsetHeight;

    if (!w || !h) return;

    // Setting these clears the canvas buffer — do it once, then fill
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    // ── Step 1: fill entire canvas with matching card colour ──
    // We pick the same colour as the gradient start so it looks flush.
    // We derive it from bgClass.
    const colorMap: Record<string, string> = {
      [styles.calmBg]: "#0f766e",
      [styles.clarityBg]: "#0891b2",
      [styles.strengthBg]: "#1d4ed8",
      [styles.gratitudeBg]: "#4338ca",
    };
    const fillColor = colorMap[bgClass] ?? "#1e3a5f";

    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, w, h);

    // ── Step 2: switch to erase mode ──
    // destination-out makes strokes transparent, revealing layers below.
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 70;
  }, [bgClass]);

  /* Convert client coords → canvas pixel coords */
  const toCanvasPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const beginStroke = (x: number, y: number) => {
    isDrawing.current = true;
    setHasDrawn(true);
    lastPos.current = { x, y };
  };

  const continueStroke = useCallback((x: number, y: number) => {
    if (!isDrawing.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPos.current = { x, y };
  }, []);

  const endStroke = () => {
    isDrawing.current = false;
  };

  /* Mouse */
  const onMouseDown = (e: React.MouseEvent) => {
    const p = toCanvasPos(e.clientX, e.clientY);
    beginStroke(p.x, p.y);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    const p = toCanvasPos(e.clientX, e.clientY);
    continueStroke(p.x, p.y);
  };

  /* Touch */
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const p = toCanvasPos(e.touches[0].clientX, e.touches[0].clientY);
    beginStroke(p.x, p.y);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const p = toCanvasPos(e.touches[0].clientX, e.touches[0].clientY);
    continueStroke(p.x, p.y);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={styles.revealCanvas}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endStroke}
        onMouseLeave={endStroke}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={endStroke}
      />
      <span className={`${styles.hint} ${hasDrawn ? styles.hintHidden : ""}`}>
        draw to reveal
      </span>
    </>
  );
}

/* ──────────────────── Main component ──────────────────── */

export default function MomentForYou() {
  const [active, setActive] = useState<string | null>(null);
  const activeCard = cards.find((c) => c.id === active);

  return (
    <>
      <section className={styles.section}>
        <h1 className={styles.title}>A Moment for You</h1>
        <p className={styles.subtitle}>Choose what you need today</p>

        <div className={styles.grid}>
          {cards.map((card) => (
            <div
              key={card.id}
              className={styles.cardWrapper}
              onClick={() => setActive(card.id)}
              role="button"
              tabIndex={0}
              aria-label={`Choose ${card.label}`}
              onKeyDown={(e) => e.key === "Enter" && setActive(card.id)}
            >
              <div className={styles.cardInner}>
                <div className={`${styles.cardFront} ${card.cardClass}`}>
                  <div className={styles.cardIcon}>{card.icon(64)}</div>
                  <span className={styles.cardLabel}>{card.label}</span>
                  <div className={styles.shimmer} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {active && activeCard && (
        <div className={styles.overlay} onClick={() => setActive(null)}>
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            {/* z-index 0 — gradient background */}
            <div className={`${styles.modalBg} ${activeCard.bgClass}`} />

            {/* z-index 1 — quote text, always rendered but hidden under canvas */}
            <div className={styles.modalContent}>
              <div className={styles.modalIcon}>{activeCard.icon(72)}</div>
              <blockquote className={styles.modalQuote}>
                &ldquo;{activeCard.quote}&rdquo;
              </blockquote>
              <p className={styles.modalAuthor}>— {activeCard.author}</p>
              <span className={styles.modalLabel}>{activeCard.label}</span>
            </div>

            {/* z-index 2 — solid canvas cover; drawing erases fill → shows text */}
            {/* key resets canvas fresh on each card open */}
            <RevealCanvas key={active} bgClass={activeCard.bgClass} />

            {/* z-index 4 — close button, always above canvas */}
            <button
              className={styles.closeBtn}
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
