import { SEO } from "@/components/SEO";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <SEO 
        title="GERLIEVA Sprühtechnik GmbH"
        description="Professionelle Sprühtechnik-Lösungen und Service"
      />
      
      <main className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="text-center space-y-12 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-lightgray tracking-tight">
              GERLIEVA
            </h1>
            <p className="text-2xl md:text-3xl text-lightgray/90 font-semibold">
              Sprühtechnik GmbH
            </p>
          </div>

          <div className="pt-8">
            <Link href="/service-bericht">
              <Button 
                size="lg"
                className="bg-orange hover:bg-orange/90 text-white font-semibold text-lg px-12 py-6 h-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <FileText className="mr-3 h-6 w-6" />
                Service Bericht
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}