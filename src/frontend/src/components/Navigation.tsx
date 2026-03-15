import { Bell, Clock, Menu, Settings, Timer, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
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
  {
    view: "stopwatch",
    label: "Stopwatch",
    icon: Timer,
    ocid: "nav.stopwatch.tab",
  },
];

interface HamburgerNavProps {
  onOpenSettings: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function HamburgerNav({
  onOpenSettings,
  menuOpen,
  setMenuOpen,
}: HamburgerNavProps) {
  const { activeView, setActiveView } = useAppContext();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen, setMenuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen, setMenuOpen]);

  function handleNavClick(view: ActiveView) {
    setActiveView(view);
    setMenuOpen(false);
  }

  function handleSettings() {
    onOpenSettings();
    setMenuOpen(false);
  }

  return (
    <>
      {/* Hamburger toggle button */}
      <button
        type="button"
        data-ocid="nav.toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 left-4 z-50 flex items-center justify-center rounded-xl transition-all
          w-11 h-11 2xl:w-14 2xl:h-14"
        style={{
          background: "oklch(var(--accent) / 0.18)",
          border: "1px solid var(--nav-border)",
          color: "var(--nav-active)",
          backdropFilter: "blur(8px)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {menuOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={22} strokeWidth={2} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Menu size={22} strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(2px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Slide-in Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            ref={drawerRef}
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 left-0 h-full z-50 flex flex-col"
            style={{
              background: "var(--nav-bg)",
              borderRight: "1px solid var(--nav-border)",
              width: "clamp(220px, 72vw, 320px)",
              boxShadow: "6px 0 32px rgba(0,0,0,0.45)",
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-5 shrink-0 2xl:px-8 2xl:py-7"
              style={{ borderBottom: "1px solid var(--nav-border)" }}
            >
              <div className="flex items-center gap-3">
                {/* Flip card mini logo */}
                <div
                  className="w-8 h-8 2xl:w-11 2xl:h-11 rounded-md flex items-center justify-center font-bold text-sm 2xl:text-base"
                  style={{
                    background: "oklch(var(--accent) / 0.25)",
                    color: "var(--nav-active)",
                    border: "1px solid oklch(var(--accent) / 0.5)",
                    boxShadow: "0 0 10px oklch(var(--accent) / 0.4)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  12
                </div>
                <h1
                  className="font-bold tracking-widest uppercase text-sm 2xl:text-base"
                  style={{ color: "var(--nav-active)" }}
                >
                  FlipClock
                </h1>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.close_button"
                className="rounded-lg p-1.5 transition-colors"
                style={{ color: "var(--nav-inactive)" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-1 flex-1 px-3 pt-4 2xl:px-5 2xl:pt-6">
              {NAV_ITEMS.map(({ view, label, icon: Icon, ocid }, idx) => {
                const active = activeView === view;
                return (
                  <motion.button
                    type="button"
                    key={view}
                    data-ocid={ocid}
                    onClick={() => handleNavClick(view)}
                    initial={{ x: -24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.06 + idx * 0.05, duration: 0.22 }}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl w-full text-left
                      transition-colors font-medium text-sm 2xl:text-base 2xl:py-5 2xl:px-6 2xl:gap-5"
                    style={{
                      color: active
                        ? "var(--nav-active)"
                        : "var(--nav-inactive)",
                      background: active
                        ? "oklch(var(--accent) / 0.18)"
                        : "transparent",
                      border: active
                        ? "1px solid oklch(var(--accent) / 0.35)"
                        : "1px solid transparent",
                    }}
                  >
                    <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                    {label}
                    {active && (
                      <motion.span
                        layoutId="active-indicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--nav-active)" }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Settings at bottom */}
            <div
              className="px-3 pt-3 pb-1 2xl:px-5 2xl:pb-3"
              style={{ borderTop: "1px solid var(--nav-border)" }}
            >
              <motion.button
                type="button"
                data-ocid="settings.open_modal_button"
                onClick={handleSettings}
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.24, duration: 0.22 }}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl w-full text-left
                  transition-colors font-medium text-sm 2xl:text-base 2xl:py-5 2xl:px-6 2xl:gap-5"
                style={{ color: "var(--nav-inactive)" }}
              >
                <Settings size={20} strokeWidth={1.8} />
                Settings
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// Keep legacy exports as aliases for any remaining imports
export const BottomNav = HamburgerNav;
export const SidebarNav = HamburgerNav;
