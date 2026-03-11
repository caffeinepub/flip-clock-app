import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flag, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Lap {
  index: number;
  time: number;
  split: number;
}

function formatMs(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  const centis = Math.floor((ms % 1000) / 10);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}`;
}

export function StopwatchView() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);

  const startTimeRef = useRef<number>(0);
  const baseElapsedRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const lastLapTimeRef = useRef<number>(0);

  const tick = useCallback(() => {
    const now = performance.now();
    setElapsed(baseElapsedRef.current + (now - startTimeRef.current));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - elapsed/tick refs are stable
  useEffect(() => {
    if (running) {
      startTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
      baseElapsedRef.current = elapsed;
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  const handleStartPause = () => {
    if (running) {
      baseElapsedRef.current = elapsed;
    } else {
      startTimeRef.current = performance.now();
    }
    setRunning((r) => !r);
  };

  const handleReset = () => {
    cancelAnimationFrame(rafRef.current);
    setRunning(false);
    setElapsed(0);
    setLaps([]);
    baseElapsedRef.current = 0;
    lastLapTimeRef.current = 0;
  };

  const handleLap = () => {
    if (!running) return;
    const split = elapsed - lastLapTimeRef.current;
    lastLapTimeRef.current = elapsed;
    setLaps((prev) => [
      { index: prev.length + 1, time: elapsed, split },
      ...prev,
    ]);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(var(--background))", minHeight: "100%" }}
    >
      <div
        className="flex flex-col items-center justify-center py-12 px-6"
        style={{ borderBottom: "1px solid oklch(var(--border))" }}
      >
        <div
          className="text-6xl sm:text-7xl lg:text-8xl font-bold tabular-nums tracking-tighter"
          style={{
            color: "oklch(var(--foreground))",
            fontFamily: '"SF Mono", "JetBrains Mono", monospace',
          }}
        >
          {formatMs(elapsed)}
        </div>

        <div className="flex gap-4 mt-8">
          <Button
            data-ocid="stopwatch.lap_button"
            type="button"
            variant="outline"
            size="lg"
            onClick={handleLap}
            disabled={!running}
            className="gap-2 min-w-[100px]"
          >
            <Flag size={16} />
            Lap
          </Button>

          <Button
            data-ocid="stopwatch.start_button"
            type="button"
            size="lg"
            onClick={handleStartPause}
            className="gap-2 min-w-[120px]"
            style={
              running
                ? {
                    background: "oklch(var(--destructive))",
                    color: "oklch(var(--destructive-foreground))",
                  }
                : {}
            }
          >
            {running ? (
              <>
                <Pause size={16} /> Pause
              </>
            ) : (
              <>
                <Play size={16} /> {elapsed > 0 ? "Resume" : "Start"}
              </>
            )}
          </Button>

          <Button
            data-ocid="stopwatch.reset_button"
            type="button"
            variant="outline"
            size="lg"
            onClick={handleReset}
            className="gap-2 min-w-[100px]"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 py-4">
          {laps.length === 0 ? (
            <div
              data-ocid="stopwatch.lap.empty_state"
              className="text-center py-12"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              <p className="text-sm">No laps recorded</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div
                className="grid grid-cols-3 gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                <span>Lap</span>
                <span className="text-center">Split</span>
                <span className="text-right">Total</span>
              </div>
              {laps.map((lap, idx) => (
                <div
                  key={lap.index}
                  data-ocid={`stopwatch.lap.item.${idx + 1}`}
                  className="grid grid-cols-3 gap-4 px-4 py-3 rounded-lg"
                  style={{
                    background: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                  }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "oklch(var(--foreground))" }}
                  >
                    Lap {lap.index}
                  </span>
                  <span
                    className="text-sm font-mono text-center tabular-nums"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    {formatMs(lap.split)}
                  </span>
                  <span
                    className="text-sm font-mono text-right tabular-nums"
                    style={{ color: "oklch(var(--foreground))" }}
                  >
                    {formatMs(lap.time)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
