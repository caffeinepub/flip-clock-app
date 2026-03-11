import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";

interface AlarmFormState {
  label: string;
  hour12: string;
  minute: string;
  ampm: "AM" | "PM";
  hour24: string;
}

const DEFAULT_FORM: AlarmFormState = {
  label: "",
  hour12: "7",
  minute: "0",
  ampm: "AM",
  hour24: "7",
};

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export function AlarmView() {
  const { alarms, use24h, addAlarm, updateAlarm, deleteAlarm } =
    useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<AlarmFormState>(DEFAULT_FORM);

  const openDialog = () => {
    setForm(DEFAULT_FORM);
    setDialogOpen(true);
  };

  const handleSave = () => {
    let h: number;
    if (use24h) {
      h = Number.parseInt(form.hour24, 10);
    } else {
      const h12 = Number.parseInt(form.hour12, 10);
      if (form.ampm === "AM") {
        h = h12 === 12 ? 0 : h12;
      } else {
        h = h12 === 12 ? 12 : h12 + 12;
      }
    }
    const m = Number.parseInt(form.minute, 10);
    addAlarm({
      label: form.label || "Alarm",
      hour: h,
      minute: m,
      enabled: true,
    });
    setDialogOpen(false);
  };

  function formatAlarmTime(
    alarm: { hour: number; minute: number },
    fmt24h: boolean,
  ): string {
    const mm = alarm.minute.toString().padStart(2, "0");
    if (fmt24h) {
      return `${alarm.hour.toString().padStart(2, "0")}:${mm}`;
    }
    const h12 = alarm.hour % 12 || 12;
    const ampm = alarm.hour < 12 ? "AM" : "PM";
    return `${h12}:${mm} ${ampm}`;
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(var(--background))", minHeight: "100%" }}
    >
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid oklch(var(--border))" }}
      >
        <h2
          className="text-xl font-bold tracking-tight"
          style={{ color: "oklch(var(--foreground))" }}
        >
          Alarms
        </h2>
        <Button
          data-ocid="alarm.add_button"
          type="button"
          size="sm"
          onClick={openDialog}
          className="gap-2"
        >
          <Plus size={16} />
          Add Alarm
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {alarms.length === 0 ? (
          <div
            data-ocid="alarm.empty_state"
            className="flex flex-col items-center justify-center gap-4 py-20"
          >
            <Bell
              size={40}
              strokeWidth={1}
              style={{ color: "oklch(var(--muted-foreground))" }}
            />
            <div className="text-center">
              <p
                className="font-semibold"
                style={{ color: "oklch(var(--foreground))" }}
              >
                No alarms set
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Tap &ldquo;Add Alarm&rdquo; to create your first alarm
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {alarms.map((alarm, idx) => (
              <div
                key={alarm.id}
                data-ocid={`alarm.item.${idx + 1}`}
                className="flex items-center justify-between px-5 py-4 rounded-xl"
                style={{
                  background: "oklch(var(--card))",
                  border: alarm.enabled
                    ? "1px solid oklch(var(--border))"
                    : "1px solid oklch(var(--border) / 0.4)",
                  opacity: alarm.enabled ? 1 : 0.55,
                }}
              >
                <div className="flex flex-col">
                  <span
                    className="text-2xl font-bold tabular-nums tracking-tight"
                    style={{
                      color: alarm.enabled
                        ? "oklch(var(--foreground))"
                        : "oklch(var(--muted-foreground))",
                      fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                    }}
                  >
                    {formatAlarmTime(alarm, use24h)}
                  </span>
                  <span
                    className="text-xs mt-1 font-medium"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    {alarm.label}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    data-ocid={`alarm.toggle.${idx + 1}`}
                    checked={alarm.enabled}
                    onCheckedChange={(v) =>
                      updateAlarm(alarm.id, { enabled: v })
                    }
                  />
                  <button
                    type="button"
                    data-ocid={`alarm.delete_button.${idx + 1}`}
                    onClick={() => deleteAlarm(alarm.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => !o && setDialogOpen(false)}
      >
        <DialogContent data-ocid="alarm.dialog" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Alarm</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="alarm-label">Label</Label>
              <Input
                id="alarm-label"
                data-ocid="alarm.label.input"
                placeholder="e.g. Wake up"
                value={form.label}
                onChange={(e) =>
                  setForm((f) => ({ ...f, label: e.target.value }))
                }
              />
            </div>

            {use24h ? (
              <div className="flex gap-3">
                <div className="flex flex-col gap-2 flex-1">
                  <Label>Hour (0-23)</Label>
                  <Select
                    value={form.hour24}
                    onValueChange={(v) => setForm((f) => ({ ...f, hour24: v }))}
                  >
                    <SelectTrigger data-ocid="alarm.time.input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HOURS_24.map((h) => (
                        <SelectItem key={h} value={String(h)}>
                          {h.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <Label>Minute</Label>
                  <Select
                    value={form.minute}
                    onValueChange={(v) => setForm((f) => ({ ...f, minute: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MINUTES.map((m) => (
                        <SelectItem key={m} value={String(m)}>
                          {m.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="flex flex-col gap-2 flex-1">
                  <Label>Hour</Label>
                  <Select
                    value={form.hour12}
                    onValueChange={(v) => setForm((f) => ({ ...f, hour12: v }))}
                  >
                    <SelectTrigger data-ocid="alarm.time.input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HOURS_12.map((h) => (
                        <SelectItem key={h} value={String(h)}>
                          {h.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <Label>Minute</Label>
                  <Select
                    value={form.minute}
                    onValueChange={(v) => setForm((f) => ({ ...f, minute: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MINUTES.map((m) => (
                        <SelectItem key={m} value={String(m)}>
                          {m.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>AM/PM</Label>
                  <Select
                    value={form.ampm}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, ampm: v as "AM" | "PM" }))
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              data-ocid="alarm.cancel_button"
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="alarm.save_button"
              type="button"
              onClick={handleSave}
            >
              Save Alarm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
