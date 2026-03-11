import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "../context/AppContext";
import type { Theme } from "../context/AppContext";

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
}

const THEMES: { id: Theme; label: string; preview: string[] }[] = [
  {
    id: "dark-minimal",
    label: "Dark Minimal",
    preview: ["#1a1a1a", "#2d2d2d", "#f2f2f2"],
  },
  {
    id: "neon-glow",
    label: "Neon Glow",
    preview: ["#0d1a2e", "#1a2d40", "#00e8c8"],
  },
  {
    id: "vintage-wood",
    label: "Vintage Wood",
    preview: ["#4a3020", "#614035", "#ede0c8"],
  },
  {
    id: "pastel-light",
    label: "Pastel Light",
    preview: ["#f0ecf8", "#dfd8f0", "#4a3a8a"],
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    preview: ["#110920", "#1e0d38", "#e040a0"],
  },
];

export function SettingsSheet({ open, onClose }: SettingsSheetProps) {
  const {
    theme,
    setTheme,
    use24h,
    setUse24h,
    animationsEnabled,
    setAnimationsEnabled,
  } = useAppContext();

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-80 max-w-full"
        style={{
          background: "oklch(var(--card))",
          borderLeft: "1px solid oklch(var(--border))",
        }}
      >
        <SheetHeader>
          <SheetTitle style={{ color: "oklch(var(--foreground))" }}>
            Settings
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <Label
                htmlFor="format-toggle"
                className="text-sm font-semibold"
                style={{ color: "oklch(var(--foreground))" }}
              >
                24-Hour Format
              </Label>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Toggle between 12h and 24h
              </p>
            </div>
            <Switch
              id="format-toggle"
              data-ocid="settings.format.toggle"
              checked={use24h}
              onCheckedChange={setUse24h}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label
                htmlFor="anim-toggle"
                className="text-sm font-semibold"
                style={{ color: "oklch(var(--foreground))" }}
              >
                Flip Animations
              </Label>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Enable card flip transitions
              </p>
            </div>
            <Switch
              id="anim-toggle"
              data-ocid="settings.animations.toggle"
              checked={animationsEnabled}
              onCheckedChange={setAnimationsEnabled}
            />
          </div>

          <div>
            <Label
              className="text-sm font-semibold block mb-3"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Theme
            </Label>
            <div
              className="grid grid-cols-1 gap-2"
              data-ocid="settings.theme.select"
            >
              {THEMES.map((t) => {
                const active = theme === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-left w-full"
                    style={{
                      border: active
                        ? "2px solid oklch(var(--primary))"
                        : "2px solid oklch(var(--border))",
                      background: active
                        ? "oklch(var(--accent) / 0.15)"
                        : "oklch(var(--secondary) / 0.5)",
                      color: "oklch(var(--foreground))",
                    }}
                  >
                    <div className="flex gap-1 shrink-0">
                      {t.preview.map((c) => (
                        <div
                          key={c}
                          className="w-4 h-4 rounded-full"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                    {t.label}
                    {active && (
                      <span
                        className="ml-auto text-xs"
                        style={{ color: "oklch(var(--primary))" }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
