"use client";

import React, { useState } from "react";
import WhatsHappeningCard from "@/components/EventCarousel/whatsHappeningCard";
import CalendarView from "@/components/EventCarousel/calender"; // We will create this next
import styles from "@/components/EventCarousel/event.module.css";

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

export default function AllEventsPage() {
  const [view, setView] = useState<"grid" | "calendar">("grid");

  return (
    <main className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>All Events</h1>

        {/* View Toggle */}
        <div className={styles.toggleContainer}>
          <button
            className={view === "grid" ? styles.activeTab : ""}
            onClick={() => setView("grid")}
          >
            Grid View
          </button>
          <button
            className={view === "calendar" ? styles.activeTab : ""}
            onClick={() => setView("calendar")}
          >
            Calendar View
          </button>
        </div>
      </header>

      <section className={styles.content}>
        {view === "grid" ? (
          <div className={styles.eventGrid}>
            {eventsData.map((event) => (
              <WhatsHappeningCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <CalendarView events={eventsData} />
        )}
      </section>
    </main>
  );
}
