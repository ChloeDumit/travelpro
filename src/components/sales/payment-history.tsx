import { Payment } from "../../types";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatCurrency, formatDate, getStatusColor } from "../../lib/utils";

interface PaymentHistoryProps {
  payments: Payment[];
  totalSale: number;
  currency: "USD" | "EUR" | "local";
}

export function PaymentHistory({
  payments,
  totalSale,
  currency,
}: PaymentHistoryProps) {
  // Calculate total paid amount
  console.log("payments", payments);
  const totalPaid = payments
    .filter((payment) => payment.status === "confirmed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingBalance = totalSale - totalPaid;

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "cash":
        return "Efectivo";
      case "creditCard":
        return "Tarjeta de Crédito";
      case "transfer":
        return "Transferencia";
      default:
        return method;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Historial de Pagos</h3>
        <div className="text-sm text-gray-600">
          Total: {formatCurrency(totalSale, currency)}
        </div>
      </div>

      {/* Payment Summary */}
      <Card className="p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Total Venta</p>
            <p className="text-lg font-semibold">
              {formatCurrency(totalSale, currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pagado</p>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(totalPaid, currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pendiente</p>
            <p
              className={`text-lg font-semibold ${
                pendingBalance > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {formatCurrency(pendingBalance, currency)}
            </p>
          </div>
        </div>
      </Card>

      {/* Payments List */}
      {payments.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          No hay pagos registrados para esta venta
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">Pago #{payment.id}</h4>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status === "confirmed"
                        ? "Confirmado"
                        : "Pendiente"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Fecha</p>
                      <p>{formatDate(payment.date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Monto</p>
                      <p className="font-medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Método</p>
                      <p>{getMethodLabel(payment.method)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Referencia</p>
                      <p className="text-xs">{payment.reference || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
