import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { FlipDigitGroup } from "./FlipCard";

interface TimeState {
  hours: number;
  minutes: number;
  seconds: number;
  date: string;
}

function getTime(use24h: boolean): TimeState {
  const now = new Date();
  const h = use24h ? now.getHours() : now.getHours() % 12 || 12;
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = `${dayNames[now.getDay()]}, ${monthNames[now.getMonth()]} ${now.getDate()}`;
  return {
    hours: h,
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    date,
  };
}

export function FlipClock() {
  const { animationsEnabled, use24h } = useAppContext();
  const [time, setTime] = useState(() => getTime(use24h));

  useEffect(() => {
    // Sync on use24h change
    setTime(getTime(use24h));
  }, [use24h]);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTime(use24h));
    }, 1000);
    return () => clearInterval(id);
  }, [use24h]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Clock display */}
      <div
        className="flex items-center"
        style={{ gap: "var(--fc-separator-gap)" }}
      >
        {/* Hours */}
        <FlipDigitGroup
          value={time.hours}
          animationsEnabled={animationsEnabled}
        />

        {/* Separator */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            color: "var(--flip-colon)",
            fontSize: "var(--fc-separator-size)",
            fontWeight: 700,
            lineHeight: 1,
            gap: "0.2em",
            animation: "colonBlink 1s step-end infinite",
            paddingBottom: "0.1em",
          }}
        >
          <span>●</span>
          <span>●</span>
        </div>

        {/* Minutes */}
        <FlipDigitGroup
          value={time.minutes}
          animationsEnabled={animationsEnabled}
        />

        {/* Separator */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            color: "var(--flip-colon)",
            fontSize: "var(--fc-separator-size)",
            fontWeight: 700,
            lineHeight: 1,
            gap: "0.2em",
            animation: "colonBlink 1s step-end infinite",
            paddingBottom: "0.1em",
          }}
        >
          <span>●</span>
          <span>●</span>
        </div>

        {/* Seconds */}
        <FlipDigitGroup
          value={time.seconds}
          animationsEnabled={animationsEnabled}
        />
      </div>

      {/* Date */}
      <p
        className="text-sm tracking-widest uppercase font-medium"
        style={{ color: "var(--flip-date-color)", letterSpacing: "0.15em" }}
      >
        {time.date}
      </p>

      {/* AM/PM indicator */}
      {!use24h && (
        <p
          className="text-xs font-semibold tracking-widest"
          style={{ color: "var(--flip-accent)", letterSpacing: "0.2em" }}
        >
          {new Date().getHours() < 12 ? "AM" : "PM"}
        </p>
      )}
    </div>
  );
}
