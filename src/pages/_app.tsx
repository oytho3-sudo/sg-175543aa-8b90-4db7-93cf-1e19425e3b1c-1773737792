import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { UpdateToast } from "@/components/UpdateToast";
import { registerSW } from "@/lib/swUpdate";

export default function App({ Component, pageProps }: AppProps) {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    registerSW((reg) => {
      setRegistration(reg);
    });
  }, []);

  const handleDismiss = () => {
    setRegistration(null);
  };

  return (
    <ThemeProvider>
      <Component {...pageProps} />
      <Toaster />
      <UpdateToast 
        registration={registration} 
        onDismiss={handleDismiss}
      />
    </ThemeProvider>
  );
}