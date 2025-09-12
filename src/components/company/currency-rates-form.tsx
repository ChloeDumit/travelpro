import { useState } from "react";
import { CurrencyRate } from "../../types";
import { CurrencyRatesList } from "./currency-rates-list";
import { CurrencyRateForm } from "./currency-rate-form";

export function CurrencyRatesForm() {
  const [editingRate, setEditingRate] = useState<CurrencyRate | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddRate = () => {
    setIsAdding(true);
    setEditingRate(null);
  };

  const handleEditRate = (rate: CurrencyRate) => {
    setEditingRate(rate);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingRate(null);
  };

  const handleSuccess = () => {
    setIsAdding(false);
    setEditingRate(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      {(isAdding || editingRate) && (
        <CurrencyRateForm
          rate={editingRate}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}

      {/* List */}
      <CurrencyRatesList
        onEditRate={handleEditRate}
        onAddRate={handleAddRate}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
