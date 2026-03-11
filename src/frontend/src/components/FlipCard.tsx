import { useEffect, useRef, useState } from "react";

interface FlipCardProps {
  digit: string;
  animationsEnabled: boolean;
}

function DigitInner({
  digit,
  position,
}: { digit: string; position: "top" | "bottom" }) {
  return (
    <div
      className={`flip-inner ${position === "top" ? "flip-inner-top" : "flip-inner-bottom"}`}
    >
      <span className="flip-digit-text">{digit}</span>
    </div>
  );
}

export function FlipCard({ digit, animationsEnabled }: FlipCardProps) {
  const [displayDigit, setDisplayDigit] = useState(digit); // for static bottom half
  const [prevDigit, setPrevDigit] = useState(digit); // shown on flaps
  const [isFlipping, setIsFlipping] = useState(false);
  const flipKey = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (digit === displayDigit) return;

    // Clear any pending flip
    if (timerRef.current) clearTimeout(timerRef.current);

    setPrevDigit(displayDigit);
    flipKey.current += 1;

    if (animationsEnabled) {
      setIsFlipping(true);
      timerRef.current = setTimeout(() => {
        setDisplayDigit(digit);
        setIsFlipping(false);
      }, 580);
    } else {
      setDisplayDigit(digit);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [digit, animationsEnabled, displayDigit]);

  const fk = flipKey.current;

  return (
    <div className="flip-card-unit">
      {/* Static top: shows current digit */}
      <div className="flip-half flip-half-top">
        <DigitInner digit={digit} position="top" />
      </div>

      {/* Static bottom: shows displayDigit (previous until flip completes) */}
      <div className="flip-half flip-half-bottom">
        <DigitInner digit={displayDigit} position="bottom" />
      </div>

      {/* Animated flaps (only during flip) */}
      {isFlipping && (
        <>
          {/* Flap top: previous digit top half, rotates from 0 to -90 */}
          <div key={`ft-${fk}`} className="flip-flap-top">
            <DigitInner digit={prevDigit} position="top" />
          </div>

          {/* Flap bottom: new digit bottom half, rotates from 90 to 0 */}
          <div key={`fb-${fk}`} className="flip-flap-bottom">
            <DigitInner digit={digit} position="bottom" />
          </div>
        </>
      )}
    </div>
  );
}

/* ─── FlipDigitGroup: two FlipCards side by side ─── */
interface FlipDigitGroupProps {
  value: number; // 0-99
  animationsEnabled: boolean;
}

export function FlipDigitGroup({
  value,
  animationsEnabled,
}: FlipDigitGroupProps) {
  const tens = String(Math.floor(value / 10) % 10);
  const ones = String(value % 10);

  return (
    <div className="flex" style={{ gap: "var(--fc-group-gap)" }}>
      <FlipCard digit={tens} animationsEnabled={animationsEnabled} />
      <FlipCard digit={ones} animationsEnabled={animationsEnabled} />
    </div>
  );
}
