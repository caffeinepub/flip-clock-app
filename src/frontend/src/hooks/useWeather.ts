import { useCallback, useEffect, useState } from "react";

export interface WeatherData {
  temp: number;
  windSpeed: number;
  condition: string;
  conditionEmoji: string;
}

interface UseWeatherReturn {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
  requestLocation: () => void;
}

function getCondition(code: number): {
  condition: string;
  conditionEmoji: string;
} {
  if (code === 0) return { condition: "Clear", conditionEmoji: "☀️" };
  if (code <= 3) return { condition: "Partly Cloudy", conditionEmoji: "⛅" };
  if (code === 45 || code === 48)
    return { condition: "Foggy", conditionEmoji: "🌫️" };
  if (code >= 51 && code <= 57)
    return { condition: "Drizzle", conditionEmoji: "🌦️" };
  if (code >= 61 && code <= 67)
    return { condition: "Rain", conditionEmoji: "🌧️" };
  if (code >= 71 && code <= 77)
    return { condition: "Snow", conditionEmoji: "❄️" };
  if (code >= 80 && code <= 82)
    return { condition: "Showers", conditionEmoji: "🌦️" };
  if (code >= 85 && code <= 86)
    return { condition: "Snow Showers", conditionEmoji: "🌨️" };
  if (code >= 95) return { condition: "Thunderstorm", conditionEmoji: "⛈️" };
  return { condition: "Unknown", conditionEmoji: "🌡️" };
}

async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,windspeed_10m,weathercode&wind_speed_unit=mph&temperature_unit=celsius`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather");
  const data = await res.json();
  const current = data.current;
  const { condition, conditionEmoji } = getCondition(current.weathercode);
  return {
    temp: Math.round(current.temperature_2m),
    windSpeed: Math.round(current.windspeed_10m),
    condition,
    conditionEmoji,
  };
}

export function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    setError(null);
    setPermissionDenied(false);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await fetchWeather(
            pos.coords.latitude,
            pos.coords.longitude,
          );
          setWeather(data);
        } catch {
          setError("Weather unavailable");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
        } else {
          setError("Location unavailable");
        }
      },
      { timeout: 10000 },
    );
  }, []);

  // Auto-attempt if permission was already granted
  useEffect(() => {
    if (!navigator.permissions) return;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "granted") {
          requestLocation();
        }
      })
      .catch(() => {});
  }, [requestLocation]);

  return { weather, loading, error, permissionDenied, requestLocation };
}
