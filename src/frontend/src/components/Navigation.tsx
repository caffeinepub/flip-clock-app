import { Bell, Clock, Settings, Timer } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import type { ActiveView } from "../context/AppContext";

interface NavItem {
  view: ActiveView;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  ocid: string;
}

const NAV_ITEMS: NavItem[] = [
  { view: "clock", label: "Clock", icon: Clock, ocid: "nav.clock.tab" },
  { view: "alarm", label: "Alarm", icon: Bell, ocid: "nav.alarm.tab" },
  { view: "stopwatch", label: "Watch", icon: Timer, ocid: "nav.stopwatch.tab" },
];

interface NavigationProps {
  onOpenSettings: () => void;
}

export function BottomNav({ onOpenSettings }: NavigationProps) {
  const { activeView, setActiveView } = useAppContext();

  return (
    <nav
      className="flex items-center justify-around px-2 py-1"
      style={{
        background: "var(--nav-bg)",
        borderTop: "1px solid var(--nav-border)",
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      {NAV_ITEMS.map(({ view, label, icon: Icon, ocid }) => {
        const active = activeView === view;
        return (
          <button
            type="button"
            key={view}
            data-ocid={ocid}
            onClick={() => setActiveView(view)}
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-colors min-w-[60px]"
            style={{
              color: active ? "var(--nav-active)" : "var(--nav-inactive)",
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold tracking-wide uppercase">
              {label}
            </span>
          </button>
        );
      })}
      <button
        type="button"
        data-ocid="settings.open_modal_button"
        onClick={onOpenSettings}
        className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-colors min-w-[60px]"
        style={{ color: "var(--nav-inactive)" }}
      >
        <Settings size={22} strokeWidth={1.8} />
        <span className="text-[10px] font-semibold tracking-wide uppercase">
          Settings
        </span>
      </button>
    </nav>
  );
}

export function SidebarNav({ onOpenSettings }: NavigationProps) {
  const { activeView, setActiveView } = useAppContext();

  return (
    <aside
      className="hidden lg:flex flex-col justify-between h-full py-6 px-3"
      style={{
        background: "var(--nav-bg)",
        borderRight: "1px solid var(--nav-border)",
        width: "200px",
        minWidth: "200px",
      }}
    >
      <div>
        <div className="px-3 mb-8">
          <h1
            className="text-base font-bold tracking-widest uppercase"
            style={{ color: "var(--nav-active)" }}
          >
            FlipClock
          </h1>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ view, label, icon: Icon, ocid }) => {
            const active = activeView === view;
            return (
              <button
                type="button"
                key={view}
                data-ocid={ocid}
                onClick={() => setActiveView(view)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium w-full text-left"
                style={{
                  color: active ? "var(--nav-active)" : "var(--nav-inactive)",
                  background: active
                    ? "oklch(var(--accent) / 0.15)"
                    : "transparent",
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          data-ocid="settings.open_modal_button"
          onClick={onOpenSettings}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium w-full text-left"
          style={{ color: "var(--nav-inactive)" }}
        >
          <Settings size={18} strokeWidth={1.8} />
          Settings
        </button>
      </div>
    </aside>
  );
}
