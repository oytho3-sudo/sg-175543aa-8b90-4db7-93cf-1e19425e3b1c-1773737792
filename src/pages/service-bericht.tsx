import { SEO } from "@/components/SEO";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServiceBericht() {
  return (
    <>
      <SEO 
        title="Service Bericht - GERLIEVA Sprühtechnik GmbH"
        description="Service Bericht erstellen"
      />
      
      <main className="min-h-screen bg-navy p-4">
        <div className="max-w-4xl mx-auto py-8">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="text-lightgray hover:text-white hover:bg-white/10 mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Button>
          </Link>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-navy mb-6">
              Service Bericht
            </h1>
            <p className="text-muted-foreground">
              Service Bericht Formular wird hier implementiert.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}