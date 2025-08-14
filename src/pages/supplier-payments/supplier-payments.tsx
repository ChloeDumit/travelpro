import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, DollarSign, Eye, Search, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  supplierPaymentsService,
  SalesBySupplier,
} from "../../lib/services/supplier-payments.service";
import { useAuthState } from "../../hooks/useAuthState";
import { formatCurrency, formatDate } from "../../lib/utils";

export function SupplierPaymentsPage() {
  const navigate = useNavigate();
  const { hasRole } = useAuthState();
  const [suppliers, setSuppliers] = useState<SalesBySupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCurrency, setFilterCurrency] = useState<string>("all");

  useEffect(() => {
    if (!hasRole("admin")) {
      navigate("/dashboard");
      return;
    }

    loadSuppliers();
  }, [hasRole]); // Removed navigate from dependencies

  const loadSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await supplierPaymentsService.getSuppliersWithSales();
      setSuppliers(response.data?.suppliers || []);
    } catch (err) {
      setError("Error al cargar proveedores");
      console.error("Error loading suppliers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.supplierName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCurrency =
      filterCurrency === "all" || supplier.currency === filterCurrency;
    return matchesSearch && matchesCurrency;
  });

  const getStatusColor = (amount: number) => {
    if (amount === 0) return "bg-green-100 text-green-800";
    if (amount < 1000) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusText = (amount: number) => {
    if (amount === 0) return "Pagado";
    if (amount < 1000) return "Pendiente";
    return "Urgente";
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pagos a Proveedores
          </h1>
          <p className="text-gray-600">
            Gestiona los pagos pendientes a proveedores
          </p>
        </div>
        <Button onClick={() => navigate("/supplier-payments/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Pago
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar proveedores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filterCurrency}
            onChange={(e) => setFilterCurrency(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">Todas las monedas</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CLP">CLP</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Pendiente
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(
                suppliers.reduce((sum, s) => sum + s.totalAmount, 0),
                "USD"
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {suppliers.filter((s) => s.totalAmount > 0).length} proveedores
              con pagos pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Proveedores Activos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {suppliers.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total de proveedores con ventas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ventas Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {suppliers.reduce((sum, s) => sum + s.sales.length, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total de ventas registradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando proveedores...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
          <Button onClick={loadSuppliers} className="mt-2">
            Reintentar
          </Button>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No se encontraron proveedores
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSuppliers.map((supplier) => (
            <Card
              key={supplier.supplierId}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium text-gray-900">
                      {supplier.supplierName}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={getStatusColor(supplier.totalAmount)}>
                        {getStatusText(supplier.totalAmount)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {supplier.sales.length} ventas
                      </span>
                      <span className="text-sm text-gray-500">
                        Moneda: {supplier.currency}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(supplier.totalAmount, supplier.currency)}
                    </div>
                    <p className="text-sm text-gray-500">Monto pendiente</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Ventas recientes:</span>
                  </div>
                  <div className="grid gap-2">
                    {supplier.sales.slice(0, 3).map((sale) => (
                      <div
                        key={sale.id}
                        className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                      >
                        <span className="font-medium">
                          {sale.passengerName}
                        </span>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={
                              sale.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {sale.status}
                          </Badge>
                          <span className="text-gray-600">
                            {formatCurrency(sale.totalCost, supplier.currency)}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDate(sale.creationDate)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {supplier.sales.length > 3 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        +{supplier.sales.length - 3} ventas más
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
