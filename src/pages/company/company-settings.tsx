import { useState } from "react";
import {
  SettingsMenu,
  SettingsContent,
  SettingsTab,
} from "../../components/company";

export function CompanySettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("currency-rates");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Configuraciones de Empresa
        </h1>
        <p className="text-gray-600 mt-1">
          Gestiona las configuraciones y preferencias de tu empresa
        </p>
      </div>

      <div className="flex gap-6">
        <SettingsMenu activeTab={activeTab} onTabChange={setActiveTab} />
        <SettingsContent activeTab={activeTab} />
      </div>
    </div>
  );
}
