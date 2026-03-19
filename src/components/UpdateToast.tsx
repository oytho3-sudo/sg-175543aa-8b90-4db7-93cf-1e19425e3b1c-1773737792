import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";

type Props = {
  registration: ServiceWorkerRegistration | null;
  onDismiss?: () => void;
};

export const UpdateToast: React.FC<Props> = ({ registration, onDismiss }) => {
  if (!registration) return null;

  const handleUpdate = () => {
    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-4 min-w-[320px]">
        <div className="flex-1">
          <p className="font-semibold text-card-foreground">Neue Version verfügbar</p>
          <p className="text-sm text-muted-foreground">Klicke auf Aktualisieren, um die neueste Version zu laden</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleUpdate}
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Aktualisieren
          </Button>
          
          {onDismiss && (
            <Button 
              onClick={onDismiss}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};