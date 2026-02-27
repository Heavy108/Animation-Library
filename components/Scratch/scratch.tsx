"use client";

import { useState, useRef, useLayoutEffect } from "react";
import styles from "./scratch.module.css";

/* ── Types ── */
type CardData = {
  id: string;
  label: string;
  image: string;
  gradient: [string, string];
  quote: string;
  author: string;
};

/* ── Cards ── */
const cards: CardData[] = [
  {
    id: "calm",
    label: "Calm",
    image: "img6.jpeg",
    gradient: ["#0f766e", "#0e7490"],
    quote:
      "Within you, there is a stillness and a sanctuary to which you can retreat at any time.",
    author: "Hermann Hesse",
  },
  {
    id: "clarity",
    label: "Clarity",
    image: "img2.jpeg",
    gradient: ["#0891b2", "#1d4ed8"],
    quote:
      "Clarity comes not from certainty, but from the willingness to look honestly at what is.",
    author: "Unknown",
  },
  {
    id: "strength",
    label: "Strength",
    image: "img3.jpeg",
    gradient: ["#1d4ed8", "#4338ca"],
    quote:
      "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne",
  },
  {
    id: "gratitude",
    label: "Gratitude",
    image: "img4.jpeg",
    gradient: ["#4338ca", "#7e22ce"],
    quote:
      "Gratitude turns what we have into enough, and more. It turns denial into acceptance.",
    author: "Melodie Beattie",
  },
];

/* ───────────────── RevealCanvas ───────────────── */

function RevealCanvas({
  gradient,
  onComplete,
}: {
  gradient: [string, string];
  onComplete: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const revealed = useRef(false);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const w = parent.offsetWidth;
    const h = parent.offsetHeight;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, gradient[0]);
    grad.addColorStop(1, gradient[1]);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 70;
  }, [gradient]);

  const checkReveal = () => {
    if (revealed.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const total = pixels.data.length / 4;

    let cleared = 0;

    for (let i = 3; i < pixels.data.length; i += 4) {
      if (pixels.data[i] === 0) cleared++;
    }

    const percent = cleared / total;

    if (percent > 0.45) {
      revealed.current = true;
      onComplete();
    }
  };

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
    lastPos.current = { x, y };
  };

  const continueStroke = (x: number, y: number) => {
    if (!isDrawing.current || !ctxRef.current) return;
    const ctx = ctxRef.current;

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPos.current = { x, y };

    checkReveal();
  };

  const endStroke = () => {
    isDrawing.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className={styles.revealCanvas}
      onMouseDown={(e) => {
        const p = toCanvasPos(e.clientX, e.clientY);
        beginStroke(p.x, p.y);
      }}
      onMouseMove={(e) => {
        const p = toCanvasPos(e.clientX, e.clientY);
        continueStroke(p.x, p.y);
      }}
      onMouseUp={endStroke}
      onMouseLeave={endStroke}
      onTouchStart={(e) => {
        e.preventDefault();
        const p = toCanvasPos(e.touches[0].clientX, e.touches[0].clientY);
        beginStroke(p.x, p.y);
      }}
      onTouchMove={(e) => {
        e.preventDefault();
        const p = toCanvasPos(e.touches[0].clientX, e.touches[0].clientY);
        continueStroke(p.x, p.y);
      }}
      onTouchEnd={endStroke}
    />
  );
}

/* ───────────────── Main Component ───────────────── */

export default function MomentForYou() {
  const [active, setActive] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
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
              onClick={() => {
                setRevealed(false);
                setActive(card.id);
              }}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                  <img
                    src={card.image}
                    alt={card.label}
                    className={styles.cardImage}
                  />
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
            <div className={styles.modalContent}>
              <blockquote className={styles.modalQuote}>
                “{activeCard.quote}”
              </blockquote>
              <p className={styles.modalAuthor}>— {activeCard.author}</p>
              <span className={styles.modalLabel}>{activeCard.label}</span>
            </div>

            {!revealed && (
              <RevealCanvas
                gradient={activeCard.gradient}
                onComplete={() => setRevealed(true)}
              />
            )}

            <button className={styles.closeBtn} onClick={() => setActive(null)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
