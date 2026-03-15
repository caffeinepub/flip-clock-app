import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FlipClock } from "../components/FlipClock";
import { WeatherWidget } from "../components/WeatherWidget";
import { useAppContext } from "../context/AppContext";

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
};

export function ClockView() {
  const { triggeredAlarm, dismissTriggeredAlarm } = useAppContext();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        toggleFullscreen();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-full w-full"
      style={{ background: "var(--flip-bg)", minHeight: "100%" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(var(--accent) / 0.04) 0%, transparent 70%)",
        }}
      />

      <FlipClock />
      <WeatherWidget />

      <button
        type="button"
        data-ocid="clock.fullscreen.toggle"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
        className="absolute bottom-4 right-4 p-2 rounded-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: "oklch(var(--foreground) / 0.08)",
          color: "oklch(var(--foreground) / 0.5)",
          backdropFilter: "blur(4px)",
          border: "1px solid oklch(var(--foreground) / 0.1)",
        }}
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>

      {triggeredAlarm && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-50"
          style={{
            background: "var(--overlay-bg)",
            animation: "alarmPulse 1s ease-in-out infinite",
          }}
        >
          <div className="flex flex-col items-center gap-6 p-8 text-center">
            <div
              className="text-6xl"
              style={{ animation: "alarmPulse 0.8s ease-in-out infinite" }}
            >
              🔔
            </div>
            <div>
              <p
                className="text-3xl font-bold tracking-tight mb-2"
                style={{ color: "var(--alarm-pulse)" }}
              >
                {triggeredAlarm.label || "Alarm"}
              </p>
              <p
                className="text-base"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                {triggeredAlarm.hour.toString().padStart(2, "0")}:
                {triggeredAlarm.minute.toString().padStart(2, "0")}
              </p>
            </div>
            <button
              type="button"
              data-ocid="alarm.dismiss_button"
              onClick={dismissTriggeredAlarm}
              className="px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all active:scale-95"
              style={{
                background: "var(--alarm-pulse)",
                color: "oklch(var(--background))",
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
