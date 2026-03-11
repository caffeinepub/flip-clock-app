import { FlipClock } from "../components/FlipClock";
import { useAppContext } from "../context/AppContext";

export function ClockView() {
  const { triggeredAlarm, dismissTriggeredAlarm } = useAppContext();

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
