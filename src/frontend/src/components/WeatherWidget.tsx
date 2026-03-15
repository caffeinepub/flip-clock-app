import { Wind } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export function WeatherWidget() {
  const {
    weather,
    weatherLoading: loading,
    weatherError: error,
    weatherPermissionDenied: permissionDenied,
    requestLocation,
  } = useAppContext();

  const baseStyle: React.CSSProperties = {
    background: "oklch(var(--foreground) / 0.06)",
    border: "1px solid oklch(var(--foreground) / 0.1)",
    borderRadius: "12px",
    backdropFilter: "blur(8px)",
    color: "oklch(var(--foreground) / 0.75)",
    fontSize: "0.78rem",
    letterSpacing: "0.02em",
  };

  if (permissionDenied) {
    return (
      <div
        data-ocid="weather.widget"
        className="flex items-center gap-2 px-4 py-2 mt-4"
        style={baseStyle}
      >
        <span style={{ fontSize: "0.85rem" }}>📍</span>
        <span style={{ color: "oklch(var(--foreground) / 0.45)" }}>
          Location denied
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        data-ocid="weather.widget"
        className="flex items-center gap-3 px-4 py-2 mt-4"
        style={baseStyle}
      >
        <div
          className="w-4 h-4 rounded-full border-2 animate-spin"
          style={{
            borderColor: "oklch(var(--foreground) / 0.15)",
            borderTopColor: "oklch(var(--foreground) / 0.5)",
          }}
        />
        <span style={{ color: "oklch(var(--foreground) / 0.4)" }}>
          Loading weather…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-ocid="weather.widget"
        className="flex items-center gap-2 px-4 py-2 mt-4"
        style={baseStyle}
      >
        <span style={{ color: "oklch(var(--foreground) / 0.4)" }}>
          Weather unavailable
        </span>
      </div>
    );
  }

  if (!weather) {
    return (
      <div data-ocid="weather.widget" className="mt-4">
        <button
          type="button"
          data-ocid="weather.allow_button"
          onClick={requestLocation}
          className="flex items-center gap-2 px-4 py-2 transition-all hover:scale-105 active:scale-95"
          style={{
            ...baseStyle,
            cursor: "pointer",
            color: "oklch(var(--foreground) / 0.6)",
          }}
        >
          <span style={{ fontSize: "0.95rem" }}>📍</span>
          <span>Allow Location for Weather</span>
        </button>
      </div>
    );
  }

  return (
    <div
      data-ocid="weather.widget"
      className="flex items-center gap-4 px-5 py-2 mt-4"
      style={baseStyle}
    >
      <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>
        {weather.conditionEmoji}
      </span>
      <span style={{ color: "oklch(var(--foreground) / 0.8)" }}>
        {weather.condition}
      </span>
      <span
        className="font-semibold"
        style={{ color: "oklch(var(--foreground) / 0.9)" }}
      >
        {weather.temp}°C
      </span>
      <span
        className="flex items-center gap-1"
        style={{ color: "oklch(var(--foreground) / 0.65)" }}
      >
        <Wind size={12} />
        {weather.windSpeed} mph
      </span>
    </div>
  );
}
