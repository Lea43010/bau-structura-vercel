import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  FileText, 
  Building2, 
  Users, 
  Map, 
  Settings, 
  FileImage, 
  BarChart3, 
  Search, 
  BookOpen,
  ShieldAlert,
  Shield
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  return (
    <DashboardLayout title="Dashboard" tabs={[]}>
      {/* Moderne Welcome-Sektion */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Willkommen zurück, {user?.name || user?.username}!</h1>
            <p className="text-blue-100 mt-1">Verwalten Sie Ihre Bauprojekte effizient und professionell</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center p-3 bg-white bg-opacity-10 rounded-lg">
            <FileText className="h-6 w-6 text-blue-200 mr-3" />
            <div>
              <p className="font-medium">Projekte</p>
              <p className="text-sm text-blue-200">Verwalten & Überwachen</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-white bg-opacity-10 rounded-lg">
            <Map className="h-6 w-6 text-blue-200 mr-3" />
            <div>
              <p className="font-medium">Tiefbau-Planung</p>
              <p className="text-sm text-blue-200">Geologische Analysen</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-white bg-opacity-10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-200 mr-3" />
            <div>
              <p className="font-medium">Berichte</p>
              <p className="text-sm text-blue-200">Auswertungen & Statistiken</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Hauptbereich - Schnellzugriff auf die wichtigsten Module */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hauptfunktionen</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Projektekarte */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 text-lg font-semibold">Projekte</CardTitle>
                <CardDescription className="text-gray-600">Verwalten Sie alle Bauprojekte zentral</CardDescription>
              </CardHeader>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md text-sm" 
                        onClick={() => navigate("/projects")}>
                  Öffnen
                </Button>
              </CardFooter>
            </Card>

            {/* Unternehmenskarte */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 text-lg font-semibold">Unternehmen</CardTitle>
                <CardDescription className="text-gray-600">Firmen und Geschäftspartner verwalten</CardDescription>
              </CardHeader>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md text-sm" 
                        onClick={() => navigate("/companies")}>
                  Öffnen
                </Button>
              </CardFooter>
            </Card>

            {/* Kundenkarte */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-50">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 text-lg font-semibold">Kunden</CardTitle>
                <CardDescription className="text-gray-600">Kundendaten und Kontakte pflegen</CardDescription>
              </CardHeader>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md text-sm" 
                        onClick={() => navigate("/customers")}>
                  Öffnen
                </Button>
              </CardFooter>
            </Card>

            {/* Tiefbau-Planungskarte */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Map className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-gray-900 text-lg font-semibold">Tiefbau-Planung</CardTitle>
                <CardDescription className="text-gray-600">Geologische Analysen und Kartentools</CardDescription>
              </CardHeader>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md text-sm" 
                        onClick={() => navigate("/tiefbau-map")}>
                  Öffnen
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Erweiterte Funktionen */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Weitere Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {/* Weitere kompakte Karten hier */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate("/settings")}>
              <CardHeader className="p-4 text-center">
                <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <CardTitle className="text-gray-800 text-sm">Einstellungen</CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate("/admin")}>
              <CardHeader className="p-4 text-center">
                <ShieldAlert className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-blue-800 text-sm">Admin-Bereich</CardTitle>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate("/file-security-admin")}>
              <CardHeader className="p-4 text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-green-800 text-sm">Dateisicherheit</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}