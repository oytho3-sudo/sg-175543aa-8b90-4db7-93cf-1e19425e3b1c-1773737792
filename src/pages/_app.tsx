import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { UpdateBanner } from "@/components/UpdateBanner";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Check if HTTPS (required for service workers)
      if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
        console.warn("Service Workers require HTTPS");
        return;
      }

      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
          
          // Check for updates immediately
          registration.update();
          
          // Set up periodic update checks
          const updateInterval = setInterval(() => {
            registration.update();
          }, 60000); // Check every 60 seconds

          // Also check when page becomes visible
          document.addEventListener("visibilitychange", () => {
            if (!document.hidden) {
              registration.update();
            }
          });

          return () => clearInterval(updateInterval);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <ThemeProvider>
      <UpdateBanner />
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  );
}