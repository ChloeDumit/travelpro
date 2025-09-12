import { SettingsTab } from "./settings-menu";
import { CurrencyRatesForm } from "./currency-rates-form";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Building, Users, Shield, Settings } from "lucide-react";

interface SettingsContentProps {
  activeTab: SettingsTab;
}

export function SettingsContent({ activeTab }: SettingsContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case "currency-rates":
        return <CurrencyRatesForm />;

      case "company-info":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Información de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Esta funcionalidad estará disponible próximamente</p>
                <p className="text-sm">
                  Gestiona los datos básicos de tu empresa
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case "users":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuarios y Permisos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Esta funcionalidad estará disponible próximamente</p>
                <p className="text-sm">Gestiona usuarios y roles del sistema</p>
              </div>
            </CardContent>
          </Card>
        );

      case "security":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Esta funcionalidad estará disponible próximamente</p>
                <p className="text-sm">
                  Configuraciones de seguridad y privacidad
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case "integrations":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Integraciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Esta funcionalidad estará disponible próximamente</p>
                <p className="text-sm">Conecta con servicios externos</p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Selecciona una configuración del menú</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return <div className="flex-1">{renderContent()}</div>;
}
