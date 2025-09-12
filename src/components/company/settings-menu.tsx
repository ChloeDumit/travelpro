import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Settings,
  DollarSign,
  Users,
  Building,
  Shield,
  ChevronRight,
} from "lucide-react";

export type SettingsTab =
  | "currency-rates"
  | "company-info"
  | "users"
  | "security"
  | "integrations";

interface SettingsMenuProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

interface SettingsMenuItem {
  id: SettingsTab;
  label: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

const settingsMenuItems: SettingsMenuItem[] = [
  {
    id: "currency-rates",
    label: "Tasas de Cambio",
    description: "Gestionar monedas y tasas de conversión",
    icon: <DollarSign className="h-5 w-5" />,
    available: true,
  },
  {
    id: "company-info",
    label: "Información de la Empresa",
    description: "Datos básicos y configuración general",
    icon: <Building className="h-5 w-5" />,
    available: false, // Futuro
  },
  {
    id: "users",
    label: "Usuarios y Permisos",
    description: "Gestionar usuarios y roles del sistema",
    icon: <Users className="h-5 w-5" />,
    available: false, // Futuro
  },
  {
    id: "security",
    label: "Seguridad",
    description: "Configuraciones de seguridad y privacidad",
    icon: <Shield className="h-5 w-5" />,
    available: false, // Futuro
  },
  {
    id: "integrations",
    label: "Integraciones",
    description: "Conectar con servicios externos",
    icon: <Settings className="h-5 w-5" />,
    available: false, // Futuro
  },
];

export function SettingsMenu({ activeTab, onTabChange }: SettingsMenuProps) {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuraciones
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <nav className="space-y-1">
          {settingsMenuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-4 ${
                !item.available ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => item.available && onTabChange(item.id)}
              disabled={!item.available}
            >
              <div className="flex items-center gap-3 w-full">
                <div>{item.icon}</div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs">{item.description}</div>
                </div>
                {item.available && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </Button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
