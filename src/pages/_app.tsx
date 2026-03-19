import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { UpdateBanner } from "@/components/UpdateBanner";
import { LoginScreen } from "@/components/LoginScreen";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // SessionStorage statt localStorage - wird beim Schließen des Tabs/Browsers gelöscht
    const authenticated = sessionStorage.getItem("gerlieva_authenticated");
    setIsAuthenticated(authenticated === "true");
    setIsLoading(false);

    // Service Worker Registration
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
        console.warn("Service Workers require HTTPS");
        return;
      }

      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem("gerlieva_authenticated", "true");
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider>
      <UpdateBanner />
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  );
}