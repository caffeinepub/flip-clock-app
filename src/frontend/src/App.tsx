import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { BottomNav, SidebarNav } from "./components/Navigation";
import { SettingsSheet } from "./components/SettingsSheet";
import { AppProvider, useAppContext } from "./context/AppContext";
import { AlarmView } from "./views/AlarmView";
import { ClockView } from "./views/ClockView";
import { StopwatchView } from "./views/StopwatchView";

function AppInner() {
  const { theme, activeView } = useAppContext();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div
      data-theme={theme}
      className="flex h-dvh w-screen overflow-hidden"
      style={{ background: "oklch(var(--background))" }}
    >
      {/* Desktop sidebar */}
      <SidebarNav onOpenSettings={() => setSettingsOpen(true)} />

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {activeView === "clock" && <ClockViewWrapper />}
          {activeView === "alarm" && <AlarmView />}
          {activeView === "stopwatch" && <StopwatchView />}
        </div>

        {/* Mobile/tablet bottom nav */}
        <div className="lg:hidden shrink-0">
          <BottomNav onOpenSettings={() => setSettingsOpen(true)} />
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

// Clock view fills the entire content area
function ClockViewWrapper() {
  return (
    <div className="h-full min-h-[calc(100dvh-65px)] lg:min-h-full flex items-center justify-center">
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
