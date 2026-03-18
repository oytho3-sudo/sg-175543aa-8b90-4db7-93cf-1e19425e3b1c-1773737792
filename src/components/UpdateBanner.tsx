import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, RefreshCw } from "lucide-react";

export function UpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Check for service worker updates
    const checkForUpdates = () => {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
          
          // Check if there's a waiting service worker
          if (registration.waiting) {
            setUpdateReady(true);
            setShowBanner(true);
          }
        }
      });
    };

    // Listen for service worker updates
    navigator.serviceWorker.ready.then((registration) => {
      // Check for updates every 60 seconds
      const interval = setInterval(checkForUpdates, 60000);

      // Check immediately
      checkForUpdates();

      // Listen for waiting service worker
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateReady(true);
              setShowBanner(true);
            }
          });
        }
      });

      // Check when page becomes visible
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          checkForUpdates();
        }
      });

      return () => clearInterval(interval);
    });

    // Listen for controller change (new service worker activated)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }, []);

  const handleUpdate = () => {
    if (!updateReady) return;

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    });
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
              Ein neues Update ist verfügbar! Aktualisiere die App, um die neueste Version zu nutzen.
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