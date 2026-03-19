import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { UpdateToast } from "@/components/UpdateToast";
import { LoginScreen } from "@/components/LoginScreen";
import { useEffect, useState } from "react";
import { registerSW } from "@/lib/swUpdate";

export default function App({ Component, pageProps }: AppProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Prüfen ob App installiert ist (PWA) oder im Browser läuft
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    
    // Bei installierter PWA: localStorage (persistent)
    // Im Browser: sessionStorage (nur für aktuelle Session)
    const storage = isInstalled ? localStorage : sessionStorage;
    const authenticated = storage.getItem("gerlieva_authenticated");
    
    setIsAuthenticated(authenticated === "true");
    setIsLoading(false);

    // Service Worker Registration mit Update-Callback
    registerSW((reg) => {
      console.log("👉 Update verfügbar");
      setRegistration(reg);
    });
  }, []);

  const handleLogin = () => {
    // Prüfen ob App installiert ist
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    const storage = isInstalled ? localStorage : sessionStorage;
    
    storage.setItem("gerlieva_authenticated", "true");
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
      <Component {...pageProps} />
      <Toaster />
      
      {/* 🔔 Update Toast */}
      <UpdateToast registration={registration} />
    </ThemeProvider>
  );
}