import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, DollarSign, Calendar, FileText } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { PageLoading } from "../../components/ui/loading-spinner";
import {
  supplierPaymentsService,
  SalesBySupplier,
  SupplierPayment,
} from "../../lib/services/supplier-payments.service";
import { useAuthState } from "../../hooks/useAuthState";
import { formatCurrency, formatDate } from "../../lib/utils";
import { ConfirmModal } from "../../components/ui/confirm-modal";

export function SupplierDetailPage() {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuthState();
  const [supplier, setSupplier] = useState<SalesBySupplier | null>(null);
  const [payments, setPayments] = useState<SupplierPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paymentToDelete, setPaymentToDelete] =
    useState<SupplierPayment | null>(null);

  useEffect(() => {
    if (!hasRole("admin")) {
      navigate("/dashboard");
      return;
    }

    if (supplierId) {
      loadSupplierData();
    }
  }, [supplierId, hasRole, navigate]);

  const loadSupplierData = async () => {
    try {
      setLoading(true);
      const [supplierResponse, paymentsResponse] = await Promise.all([
        supplierPaymentsService.getSalesBySupplier(supplierId!),
        supplierPaymentsService.getPaymentHistory(supplierId!),
      ]);

      setSupplier(supplierResponse.data || null);
      setPayments(paymentsResponse.data?.payments || []);
    } catch (err) {
      setError("Error al cargar datos del proveedor");
      console.error("Error loading supplier data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;

    try {
      await supplierPaymentsService.delete(paymentToDelete.id);
      setPayments(payments.filter((p) => p.id !== paymentToDelete.id));
      setShowDeleteModal(false);
      setPaymentToDelete(null);
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  };

  const calculateTotalPaid = () => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const calculateRemainingBalance = () => {
    if (!supplier) return 0;
    return supplier.totalAmount - calculateTotalPaid();
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

  if (loading) {
    return <PageLoading message="Cargando datos del proveedor..." />;
  }

  if (error || !supplier) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error || "Proveedor no encontrado"}</p>
        <Button onClick={loadSupplierData} className="mt-2">
          Reintentar
        </Button>
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
              {supplier.supplierName}
            </h1>
            <p className="text-gray-600">Detalles del proveedor y pagos</p>
          </div>
        </div>
        <Button
          onClick={() =>
            navigate(`/supplier-payments/new?supplierId=${supplier.supplierId}`)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Pago
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Ventas
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(supplier.totalAmount, supplier.currency)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {supplier.sales.length} ventas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Pagado
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(calculateTotalPaid(), supplier.currency)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {payments.length} pagos realizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Saldo Pendiente
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(calculateRemainingBalance(), supplier.currency)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {calculateRemainingBalance() > 0
                ? "Pendiente de pago"
                : "Completamente pagado"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Moneda
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {supplier.currency}
            </div>
            <p className="text-xs text-gray-500 mt-1">Moneda de operación</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Ventas del Proveedor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {supplier.sales.map((sale) => (
              <div
                key={sale.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {sale.passengerName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Fecha: {formatDate(sale.creationDate)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      sale.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {sale.status}
                  </Badge>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(sale.totalCost, supplier.currency)}
                    </div>
                    <p className="text-xs text-gray-500">Costo</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Historial de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay pagos registrados para este proveedor
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {payment.description}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Fecha: {formatDate(payment.paymentDate)}
                    </p>
                    {payment.reference && (
                      <p className="text-sm text-gray-500">
                        Referencia: {payment.reference}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                      <p className="text-xs text-gray-500">
                        {payment.paymentMethod}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPaymentToDelete(payment);
                        setShowDeleteModal(true);
                      }}
                      className="hover:bg-red-500 hover:text-white"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Payment Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPaymentToDelete(null);
        }}
        onConfirm={handleDeletePayment}
        title="Eliminar Pago"
        description={`¿Estás seguro de que quieres eliminar el pago de ${
          paymentToDelete
            ? formatCurrency(paymentToDelete.amount, paymentToDelete.currency)
            : ""
        }?`}
      />
    </div>
  );
}
