export function registerSW(onUpdate: (registration: ServiceWorkerRegistration) => void) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then((registration) => {

      // 🔍 Update gefunden
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            onUpdate(registration);
          }
        });
      });

      // 🔄 Falls schon waiting
      if (registration.waiting) {
        onUpdate(registration);
      }
    });

    // 🔄 Reload bei neuem SW
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }
}