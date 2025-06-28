import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  FileText, 
  Download, 
  Eye,
  Upload,
  Filter,
  Calendar,
  File,
  Image,
  FileSpreadsheet
} from "lucide-react";

export default function ModernDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Mock data for demonstration - in real app this would come from API
  const documents = [
    {
      id: 1,
      name: "Tiefbau-Bericht_Projekt_A.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: "2024-05-20",
      category: "Berichte",
      projectName: "Projekt Alpha"
    },
    {
      id: 2,
      name: "Bodenanalyse_Standort_B.xlsx",
      type: "excel",
      size: "1.8 MB",
      uploadDate: "2024-05-18",
      category: "Analysen",
      projectName: "Projekt Beta"
    },
    {
      id: 3,
      name: "Baustellenfoto_001.jpg",
      type: "image",
      size: "3.2 MB",
      uploadDate: "2024-05-15",
      category: "Fotos",
      projectName: "Projekt Alpha"
    }
  ];

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === "all" || doc.type === filterType)
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FilePdf className="h-8 w-8 text-red-600" />;
      case 'excel':
        return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
      case 'image':
        return <Image className="h-8 w-8 text-blue-600" />;
      default:
        return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'pdf':
        return <Badge className="bg-red-100 text-red-800">PDF</Badge>;
      case 'excel':
        return <Badge className="bg-green-100 text-green-800">Excel</Badge>;
      case 'image':
        return <Badge className="bg-blue-100 text-blue-800">Bild</Badge>;
      default:
        return <Badge variant="secondary">Datei</Badge>;
    }
  };

  return (
    <DashboardLayout title="Dokumente">
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-amber-600 to-amber-800 text-white border-0">
              <CardHeader className="pb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2 flex items-center">
                      <FileText className="mr-3 h-8 w-8" />
                      Dokumente
                    </CardTitle>
                    <CardDescription className="text-amber-100 text-lg">
                      Verwalten Sie alle Projektdokumente und Dateien zentral
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-amber-500 text-white border-amber-400">
                    {filteredDocuments.length} {filteredDocuments.length === 1 ? 'Dokument' : 'Dokumente'}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Controls Section */}
          <div className="mb-6 space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Dokumente durchsuchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Filter and Upload */}
                  <div className="flex gap-2">
                    <Button
                      variant={filterType === "all" ? "default" : "outline"}
                      onClick={() => setFilterType("all")}
                      size="sm"
                    >
                      <Filter className="h-4 w-4 mr-1" />
                      Alle
                    </Button>
                    <Button
                      variant={filterType === "pdf" ? "default" : "outline"}
                      onClick={() => setFilterType("pdf")}
                      size="sm"
                    >
                      PDF
                    </Button>
                    <Button
                      variant={filterType === "excel" ? "default" : "outline"}
                      onClick={() => setFilterType("excel")}
                      size="sm"
                    >
                      Excel
                    </Button>
                    <Button
                      variant={filterType === "image" ? "default" : "outline"}
                      onClick={() => setFilterType("image")}
                      size="sm"
                    >
                      Bilder
                    </Button>
                    
                    <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800">
                      <Upload className="mr-2 h-4 w-4" />
                      Hochladen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents Grid */}
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'Keine Dokumente gefunden' : 'Noch keine Dokumente vorhanden'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? 'Versuchen Sie einen anderen Suchbegriff.'
                      : 'Laden Sie Ihr erstes Dokument hoch, um zu beginnen.'
                    }
                  </p>
                  {!searchTerm && (
                    <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800">
                      <Upload className="mr-2 h-4 w-4" />
                      Erstes Dokument hochladen
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-amber-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getFileIcon(document.type)}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold text-gray-900 truncate">
                            {document.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {getTypeBadge(document.type)}
                            <Badge variant="outline" className="text-xs">
                              {document.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Größe:</span>
                        <span>{document.size}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Projekt:</span>
                        <span className="truncate ml-2">{document.projectName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(document.uploadDate).toLocaleDateString('de-DE')}</span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Ansehen
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}