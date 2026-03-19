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
    // Service Worker Registration mit Update-Callback
    registerSW((reg) => {
      console.log("👉 Update verfügbar");
      setRegistration(reg);
    });

    // Authentifizierung vom Backend prüfen
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/me");
      setIsAuthenticated(res.ok);
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
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