import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProtokolleSeite() {
  return (
    <>
      <SEO 
        title="Protokolle - Service Bericht"
        description="Wartungsprotokolle und Service-Dokumentation"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Startseite
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Protokolle</h1>
            <p className="text-gray-600">Service-Dokumentation und Wartungsprotokolle</p>
          </div>

          <div className="grid gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-magenta-600" />
                  Wartungsprotokoll_GS
                </CardTitle>
                <CardDescription>
                  Wartungsprotokoll für Geschirrspüler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/service-bericht">
                  <Button className="w-full bg-magenta-600 hover:bg-magenta-700 text-white">
                    Protokoll öffnen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}