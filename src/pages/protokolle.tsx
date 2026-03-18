import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TsxFile {
  id: string;
  name: string;
  uploadedAt: string;
  path: string;
}

export default function ProtokolleSeite() {
  const [files, setFiles] = useState<TsxFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const newFiles: TsxFile[] = Array.from(uploadedFiles)
      .filter(file => file.name.endsWith('.tsx'))
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        uploadedAt: new Date().toISOString(),
        path: URL.createObjectURL(file)
      }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    if (selectedFile === id) {
      setSelectedFile(null);
    }
  };

  return (
    <>
      <SEO
        title="Protokolle - Gerlieva App"
        description="Verwalten und öffnen Sie Ihre TSX Protokoll-Dateien"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" className="mb-4">
                ← Zurück zur Startseite
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-magenta bg-clip-text text-transparent">
              Protokolle
            </h1>
            <p className="text-muted-foreground">
              Laden Sie TSX-Dateien hoch und öffnen Sie diese hier
            </p>
          </div>

          {/* Upload Area */}
          <Card className="mb-8 border-2 border-dashed hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Dateien hochladen
              </CardTitle>
              <CardDescription>
                Wählen Sie TSX-Dateien aus, die Sie hier verwalten möchten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Klicken zum Hochladen</span> oder Drag & Drop
                    </p>
                    <p className="text-xs text-muted-foreground">TSX Dateien</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".tsx"
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Files List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {files.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Noch keine Dateien hochgeladen
                  </p>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Laden Sie TSX-Dateien hoch, um sie hier anzuzeigen
                  </p>
                </CardContent>
              </Card>
            ) : (
              files.map((file) => (
                <Card
                  key={file.id}
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    selectedFile === file.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedFile(file.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="truncate">{file.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {new Date(file.uploadedAt).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(file.path, "_blank");
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Öffnen
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Info Box */}
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Hinweis:</strong> Die hochgeladenen Dateien werden lokal im Browser gespeichert. 
                Sie bleiben auch nach einem Neuladen der Seite verfügbar, solange der Browser-Cache nicht gelöscht wird.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}