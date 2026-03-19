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

      // Prüfe auf wartenden Service Worker beim Start
      if (reg.waiting) {
        console.log('[UpdateBanner] Found waiting service worker on startup');
        setShowBanner(true);
      }

      // Neue Updates erkennen
      reg.addEventListener("updatefound", () => {
        console.log('[UpdateBanner] Update found, new worker installing');
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            console.log('[UpdateBanner] New worker state:', newWorker.state);
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // Neues Update verfügbar - Banner anzeigen
              console.log('[UpdateBanner] New update available, showing banner');
              setShowBanner(true);
            }
          });
        }
      });

      // Manuell nach Updates suchen (nur einmal beim Start)
      console.log('[UpdateBanner] Checking for updates');
      reg.update();
    });

    // Reload NUR wenn Benutzer bestätigt hat
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        console.log('[UpdateBanner] Controller changed, reloading page');
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (!registration?.waiting) {
      console.error('[UpdateBanner] No waiting worker found');
      return;
    }

    console.log('[UpdateBanner] User confirmed update, posting SKIP_WAITING');
    // Benutzer hat bestätigt - jetzt Update durchführen
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
    setShowBanner(false);
  };

  const handleDismiss = () => {
    console.log('[UpdateBanner] User dismissed update banner');
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