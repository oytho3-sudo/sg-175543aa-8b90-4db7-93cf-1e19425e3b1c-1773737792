import { Toaster } from "@/components/ui/toaster";
import { LoginScreen } from "@/components/LoginScreen";
import { UpdateBanner } from "@/components/UpdateBanner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("gerlieva_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);

    // Register service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope);
            
            // Check for updates every 60 seconds
            setInterval(() => {
              registration.update();
            }, 60000);
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Show loading state briefly to avoid flash
  if (isLoading) {
    return null;
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <>
      <Component {...pageProps} />
      <UpdateBanner />
      <Toaster />
    </>
  );
}