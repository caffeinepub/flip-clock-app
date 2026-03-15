import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { HamburgerNav } from "./components/Navigation";
import { SettingsSheet } from "./components/SettingsSheet";
import { AppProvider, useAppContext } from "./context/AppContext";
import { AlarmView } from "./views/AlarmView";
import { ClockView } from "./views/ClockView";
import { StopwatchView } from "./views/StopwatchView";

function AppInner() {
  const { theme, activeView } = useAppContext();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      data-theme={theme}
      className="flex h-dvh w-screen overflow-hidden relative"
      style={{ background: "oklch(var(--background))" }}
    >
      {/* Hamburger nav — visible on all screen sizes */}
      <HamburgerNav
        onOpenSettings={() => setSettingsOpen(true)}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {/* Main content area — full width */}
      <main className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {activeView === "clock" && <ClockViewWrapper />}
          {activeView === "alarm" && <AlarmView />}
          {activeView === "stopwatch" && <StopwatchView />}
        </div>
      </main>

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <Toaster />
    </div>
  );
}

function ClockViewWrapper() {
  return (
    <div className="h-full min-h-dvh flex items-center justify-center">
      <ClockView />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
