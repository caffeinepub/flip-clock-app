import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "fc_location_asked";

interface LocationPermissionModalProps {
  onAllow: () => void;
}

export function LocationPermissionModal({
  onAllow,
}: LocationPermissionModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already asked or if permission already decided
    const alreadyAsked = localStorage.getItem(STORAGE_KEY);
    if (alreadyAsked) return;

    if (!navigator.permissions) {
      // Fallback: just show the modal
      setVisible(true);
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "prompt") {
          setVisible(true);
        } else {
          // Already granted or denied — no need to ask
          localStorage.setItem(STORAGE_KEY, "true");
        }
      })
      .catch(() => {
        setVisible(true);
      });
  }, []);

  function handleAllow() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
    onAllow();
  }

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="location-overlay"
          data-ocid="location.modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          style={{
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(6px)",
          }}
        >
          <motion.div
            initial={{ scale: 0.88, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 16, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 28,
              delay: 0.05,
            }}
            className="relative flex flex-col items-center text-center rounded-2xl p-8 max-w-sm w-full
              2xl:max-w-lg 2xl:p-12"
            style={{
              background: "oklch(var(--card))",
              border: "1px solid var(--nav-border)",
              boxShadow:
                "0 24px 80px rgba(0,0,0,0.5), 0 0 40px oklch(var(--accent) / 0.15)",
            }}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.18,
                type: "spring",
                stiffness: 280,
                damping: 18,
              }}
              className="mb-5 flex items-center justify-center w-16 h-16 rounded-full
                2xl:w-20 2xl:h-20 2xl:mb-6"
              style={{
                background: "oklch(var(--accent) / 0.18)",
                border: "1.5px solid oklch(var(--accent) / 0.45)",
                boxShadow: "0 0 24px oklch(var(--accent) / 0.3)",
              }}
            >
              <MapPin
                size={30}
                strokeWidth={1.8}
                style={{ color: "var(--nav-active)" }}
                className="2xl:w-9 2xl:h-9"
              />
            </motion.div>

            {/* Title */}
            <h2
              className="text-xl font-bold tracking-tight mb-2 2xl:text-2xl"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Enable Weather?
            </h2>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-7 max-w-[260px] 2xl:text-base 2xl:mb-9"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Allow location access to show current weather and wind speed on
              your clock.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full 2xl:gap-4">
              <Button
                data-ocid="location.confirm_button"
                onClick={handleAllow}
                className="w-full font-semibold rounded-xl 2xl:py-6 2xl:text-base"
                style={{
                  background: "oklch(var(--accent))",
                  color: "oklch(var(--accent-foreground))",
                }}
              >
                <MapPin size={16} className="mr-2 shrink-0" />
                Allow Location
              </Button>
              <Button
                data-ocid="location.cancel_button"
                variant="ghost"
                onClick={handleDismiss}
                className="w-full font-medium rounded-xl 2xl:py-6 2xl:text-base"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Not Now
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
