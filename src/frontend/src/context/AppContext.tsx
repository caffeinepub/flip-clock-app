import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { type WeatherData, useWeather } from "../hooks/useWeather";

export type Theme =
  | "dark-minimal"
  | "neon-glow"
  | "vintage-wood"
  | "pastel-light"
  | "cyberpunk";
export type ActiveView = "clock" | "alarm" | "stopwatch";

export interface Alarm {
  id: string;
  label: string;
  hour: number; // 0-23 (24h internal storage)
  minute: number;
  enabled: boolean;
}

interface AppState {
  theme: Theme;
  use24h: boolean;
  animationsEnabled: boolean;
  alarms: Alarm[];
  activeView: ActiveView;
  triggeredAlarm: Alarm | null;
  // Weather (shared across components)
  weather: WeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  weatherPermissionDenied: boolean;
  requestLocation: () => void;
  setTheme: (t: Theme) => void;
  setUse24h: (v: boolean) => void;
  setAnimationsEnabled: (v: boolean) => void;
  setActiveView: (v: ActiveView) => void;
  addAlarm: (a: Omit<Alarm, "id">) => void;
  updateAlarm: (id: string, changes: Partial<Omit<Alarm, "id">>) => void;
  deleteAlarm: (id: string) => void;
  dismissTriggeredAlarm: () => void;
}

const AppContext = createContext<AppState | null>(null);

function loadLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    loadLocalStorage<Theme>("fc_theme", "dark-minimal"),
  );
  const [use24h, setUse24hState] = useState<boolean>(() =>
    loadLocalStorage<boolean>("fc_use24h", false),
  );
  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(() =>
    loadLocalStorage<boolean>("fc_animations", true),
  );
  const [alarms, setAlarms] = useState<Alarm[]>(() =>
    loadLocalStorage<Alarm[]>("fc_alarms", []),
  );
  const [activeView, setActiveView] = useState<ActiveView>("clock");
  const [triggeredAlarm, setTriggeredAlarm] = useState<Alarm | null>(null);
  const [lastTriggered, setLastTriggered] = useState<string>("");

  // Single shared weather instance
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
    permissionDenied: weatherPermissionDenied,
    requestLocation,
  } = useWeather();

  // Persist settings
  useEffect(() => {
    localStorage.setItem("fc_theme", JSON.stringify(theme));
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("fc_use24h", JSON.stringify(use24h));
  }, [use24h]);
  useEffect(() => {
    localStorage.setItem("fc_animations", JSON.stringify(animationsEnabled));
  }, [animationsEnabled]);
  useEffect(() => {
    localStorage.setItem("fc_alarms", JSON.stringify(alarms));
  }, [alarms]);

  // Alarm checker
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const key = `${h}:${m}`;
      if (key === lastTriggered) return;
      const hit = alarms.find(
        (a) => a.enabled && a.hour === h && a.minute === m,
      );
      if (hit) {
        setLastTriggered(key);
        setTriggeredAlarm(hit);
      }
    };
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [alarms, lastTriggered]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const setUse24h = useCallback((v: boolean) => setUse24hState(v), []);
  const setAnimationsEnabled = useCallback(
    (v: boolean) => setAnimationsEnabledState(v),
    [],
  );

  const addAlarm = useCallback((a: Omit<Alarm, "id">) => {
    setAlarms((prev) => [...prev, { ...a, id: Date.now().toString() }]);
  }, []);

  const updateAlarm = useCallback(
    (id: string, changes: Partial<Omit<Alarm, "id">>) => {
      setAlarms((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...changes } : a)),
      );
    },
    [],
  );

  const deleteAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const dismissTriggeredAlarm = useCallback(() => {
    setTriggeredAlarm(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        use24h,
        animationsEnabled,
        alarms,
        activeView,
        triggeredAlarm,
        weather,
        weatherLoading,
        weatherError,
        weatherPermissionDenied,
        requestLocation,
        setTheme,
        setUse24h,
        setAnimationsEnabled,
        setActiveView,
        addAlarm,
        updateAlarm,
        deleteAlarm,
        dismissTriggeredAlarm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
