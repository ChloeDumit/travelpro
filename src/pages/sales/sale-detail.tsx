import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Ban,
  Check,
  Printer,
  Pencil,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { SaleSummary } from "../../components/sales/sale-summary";
import { PaymentForm } from "../../components/sales/payment-form";
import { PaymentHistory } from "../../components/sales/payment-history";
import { Sale, Payment } from "../../types";
import { salesService } from "../../lib/services/sales.service";
import { paymentsService } from "../../lib/services/payments.service";
import { LoadingState } from "../../components/ui/loading-spinner";

export function SaleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  useEffect(() => {
    const fetchSale = async () => {
      if (!id) return;
      try {
        const saleData = await salesService.getById(id);
        setSale(saleData.data || null);
      } catch (err) {
        setError("Failed to fetch sale details");
        console.error("Error fetching sale:", err);
      } finally {
        setLoading(false);
      }
    };
    const fetchPayments = async () => {
      if (!id) return;
      try {
        const payments = await paymentsService.getBySaleId(id);
        setPayments((payments.data || []) as unknown as Payment[]);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };
    fetchSale();
    fetchPayments();
  }, [id]);

  const handleStatusUpdate = async (status: "completed" | "cancelled") => {
    if (!id) return;

    try {
      await salesService.update(id, { status });
      window.location.reload();
    } catch (err) {
      console.error("Error updating sale status:", err);
    }
  };

  const handlePaymentAdded = (payment: Payment) => {
    if (payment) {
      window.location.reload();
    }
  };

  const handlePaymentUpdated = (payment: Payment) => {
    if (payment) {
      window.location.reload();
    }
  };

  // Calculate total sale amount from items
  const calculateTotalSale = (sale: Sale) => {
    if (!sale.items) return sale.totalCost;
    return sale.items.reduce((total, item) => total + item.salePrice, 0);
  };

  if (loading) {
    return <LoadingState message="Cargando venta..." />;
  }

  if (error || !sale) {
    return <div className="text-red-500">{error || "Sale not found"}</div>;
  }

  const totalSale = calculateTotalSale(sale);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 ">
        <Button variant="outline" size="sm" onClick={() => navigate("/sales")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPaymentForm(true)}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Registrar Pago
        </Button>
        {sale.status !== "completed" && (
          <>
            <Button
              variant="success"
              size="sm"
              onClick={() => handleStatusUpdate("completed")}
            >
              <Check className="mr-2 h-4 w-4" />
              Liquidar Venta
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/sales/${id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar Venta
            </Button>
          </>
        )}
        {sale.status !== "cancelled" && sale.status !== "completed" && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleStatusUpdate("cancelled")}
          >
            <Ban className="mr-2 h-4 w-4" />
            Cancelar Venta
          </Button>
        )}
        {sale.status === "completed" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Generar Factura")}
          >
            <Printer className="mr-2 h-4 w-4" />
            Generar Factura
          </Button>
        )}
      </div>

      <SaleSummary sale={sale} />

      <PaymentHistory
        payments={payments}
        totalSale={totalSale}
        onPaymentUpdated={handlePaymentUpdated}
      />

      <PaymentForm
        saleId={sale.id}
        totalSale={totalSale}
        onPaymentAdded={handlePaymentAdded}
        onClose={() => setShowPaymentForm(false)}
        isOpen={showPaymentForm}
      />
    </div>
  );
}
