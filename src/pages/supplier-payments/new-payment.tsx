import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  FileText,
  CreditCard,
  Search,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { suppliersService } from "../../lib/services/suppliers.service";
import {
  supplierPaymentsService,
  CreateSupplierPaymentData,
} from "../../lib/services/supplier-payments.service";
import { useAuthState } from "../../hooks/useAuthState";
import { Supplier } from "../../types/supplier";
import { SupplierSelect } from "../../components/sales/supplier-select";

export function NewPaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hasRole } = useAuthState();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<CreateSupplierPaymentData>({
    supplierId: searchParams.get("supplierId") || "",
    amount: 0,
    currency: "USD",
    paymentDate: new Date().toISOString().split("T")[0],
    description: "",
    relatedSales: [],
    paymentMethod: "transfer",
    reference: "",
  });

  const loadSuppliers = useCallback(async () => {
    try {
      const response = await suppliersService.getAll();

      setSuppliers(response.data || []);
    } catch (err) {
      console.error("Error loading suppliers:", err);
    }
  }, []);

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!hasRole("admin")) {
      navigate("/dashboard");
      return;
    }

    loadSuppliers();
  }, [hasRole, loadSuppliers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.supplierId || formData.amount <= 0) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await supplierPaymentsService.create(formData);

      // Redirect to supplier detail page
      navigate(`/supplier-payments/supplier/${formData.supplierId}`);
    } catch (err) {
      setError("Error al crear el pago");
      console.error("Error creating payment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateSupplierPaymentData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!hasRole("admin")) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          No tienes permisos para acceder a esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/supplier-payments")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nuevo Pago a Proveedor
            </h1>
            <p className="text-gray-600">
              Registra un nuevo pago realizado a un proveedor
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Información del Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Supplier Selection */}
            <div>
              <div className="relative">
                <SupplierSelect
                  suppliers={filteredSuppliers}
                  value={parseInt(formData.supplierId)}
                  onSelect={(supplier) =>
                    handleInputChange("supplierId", supplier.id)
                  }
                />
              </div>

              {filteredSuppliers.length === 0 && searchQuery && (
                <p className="text-sm text-gray-500 mt-1">
                  No se encontraron proveedores con "{searchQuery}"
                </p>
              )}
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange(
                        "amount",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="pl-10"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda *
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    handleInputChange("currency", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="CLP">CLP</option>
                </select>
              </div>
            </div>

            {/* Payment Date and Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Pago *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) =>
                      handleInputChange("paymentDate", e.target.value)
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      handleInputChange("paymentMethod", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="transfer">Transferencia Bancaria</option>
                    <option value="cash">Efectivo</option>
                    <option value="check">Cheque</option>
                    <option value="card">Tarjeta de Crédito/Débito</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description and Reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="pl-10"
                    placeholder="Descripción del pago"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referencia
                </label>
                <Input
                  type="text"
                  value={formData.reference}
                  onChange={(e) =>
                    handleInputChange("reference", e.target.value)
                  }
                  placeholder="Número de referencia, comprobante, etc."
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/supplier-payments")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700"
              >
                {loading ? "Creando..." : "Crear Pago"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
