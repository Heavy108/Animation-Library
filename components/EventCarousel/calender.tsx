"use client";

import React, { useState } from "react";
import WhatsHappeningCard from "./whatsHappeningCard";
import styles from "./calender.module.css";

interface Event {
  id: number;
  imageUrl: string;
  title: string;
  tags: string[];
  date: string;
  location: string;
}

export default function CalendarView({ events }: { events: Event[] }) {
  // State for the mobile view's selected date
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Mocking 28 days for February
  const daysInMonth = Array.from({ length: 28 }, (_, i) => i + 1);

  // Helper to find events for a specific day
  const getEventsForDay = (day: number) => {
    return events.filter((e) => e.date.includes(`${day} Feb`));
  };

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className={styles.wrapper}>
      {/* =========================================
          MOBILE VIEW (Compact Calendar + Cards)
          ========================================= */}
      <div className={styles.mobileView}>
        <div className={styles.calendarCard}>
          <div className={styles.monthHeader}>
            <h3>February 2026</h3>
          </div>

          <div className={styles.daysGrid}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className={styles.dayName}>
                {d}
              </div>
            ))}

            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDay(day);
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedDate === day;

              return (
                <button
                  key={day}
                  className={`${styles.dayCell} ${isSelected ? styles.selectedDay : ""}`}
                  onClick={() => setSelectedDate(day)}
                >
                  <span className={styles.dayNumber}>{day}</span>

                  {hasEvents && (
                    <div className={styles.dotsContainer}>
                      {dayEvents.slice(0, 3).map((_, i) => (
                        <span key={i} className={styles.dot}></span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.eventsArea}>
          {selectedDate ? (
            <>
              <h2 className={styles.eventsAreaTitle}>
                Events on February {selectedDate}
              </h2>
              {selectedEvents.length > 0 ? (
                <div className={styles.cardsGrid}>
                  {selectedEvents.map((event) => (
                    <WhatsHappeningCard key={event.id} {...event} />
                  ))}
                </div>
              ) : (
                <div className={styles.noEvents}>
                  <p>No events scheduled for this day.</p>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noEvents}>
              <p>Please select a date on the calendar to view events.</p>
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          DESKTOP VIEW (Full Large Grid)
          ========================================= */}
      <div className={styles.desktopView}>
        <div className={styles.desktopCalendarCard}>
          <div className={styles.monthHeader}>
            <h3>February 2026</h3>
          </div>

          <div className={styles.desktopGrid}>
            {/* Desktop Day Names */}
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((d) => (
              <div key={d} className={styles.desktopDayName}>
                {d}
              </div>
            ))}

            {/* Desktop Calendar Cells */}
            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDay(day);

              return (
                <div key={day} className={styles.desktopDayCell}>
                  <span className={styles.desktopDayNumber}>{day}</span>

                  {/* Render Full Event Pills inside the box */}
                  <div className={styles.desktopEventList}>
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={styles.eventPill}
                        title={event.title}
                      >
                        <div className={styles.pillTime}>
                          {/* Simple extraction of time from "Sat, 15 Feb • 7:00" */}
                          {event.date.split("•")[1]?.trim()}
                        </div>
                        <div className={styles.pillTitle}>{event.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
