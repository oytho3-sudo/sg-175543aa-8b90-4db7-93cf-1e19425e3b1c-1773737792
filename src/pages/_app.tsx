import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { UpdateToast } from "@/components/UpdateToast";

export default function App({ Component, pageProps }: AppProps) {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Service Worker registrieren
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setRegistration(reg);
        })
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, []);

  return (
    <ThemeProvider>
      <Component {...pageProps} />
      <Toaster />
      <UpdateToast registration={registration} />
    </ThemeProvider>
  );
}