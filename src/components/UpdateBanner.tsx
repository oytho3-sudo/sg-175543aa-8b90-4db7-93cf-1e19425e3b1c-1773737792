import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, RefreshCw } from "lucide-react";

export function UpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Service Worker Updates überwachen
    navigator.serviceWorker.ready.then((reg) => {
      setRegistration(reg);

      // Prüfe auf wartenden Service Worker
      if (reg.waiting) {
        setShowBanner(true);
      }

      // Neue Updates erkennen
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // Neues Update verfügbar - Banner anzeigen
              setShowBanner(true);
            }
          });
        }
      });

      // Regelmäßig nach Updates suchen (alle 60 Sekunden)
      const interval = setInterval(() => {
        reg.update();
      }, 60000);

      // Bei Sichtbarkeit der Seite nach Updates suchen
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          reg.update();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        clearInterval(interval);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    });

    // Reload NUR wenn Benutzer bestätigt hat
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (!registration?.waiting) return;

    // Benutzer hat bestätigt - jetzt Update durchführen
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5" />
            <p className="text-sm font-medium">
              Ein neues Update ist verfügbar! Möchtest du jetzt aktualisieren?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUpdate}
              className="whitespace-nowrap"
            >
              Jetzt aktualisieren
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}