import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Modal } from "../ui/modal";
import { paymentsService } from "../../lib/services/payments.service";
import { Payment } from "../../types";

interface PaymentFormProps {
  saleId: string;
  totalSale?: number;
  currency: "USD" | "EUR" | "local";
  onPaymentAdded: (payment: Payment) => void;
  onClose: () => void;
  isOpen: boolean;
  editingPayment?: Payment | null;
}

export function PaymentForm({
  saleId,
  currency,
  onPaymentAdded,
  onClose,
  isOpen,
  editingPayment,
}: PaymentFormProps) {
  const [formData, setFormData] = useState({
    paymentDate: editingPayment?.date
      ? new Date(editingPayment.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    amount: editingPayment?.amount?.toString() || "",
    currency: editingPayment?.currency || currency,
    paymentMethod:
      (editingPayment?.method as "creditCard" | "cash" | "transfer") || "cash",
    reference: editingPayment?.reference || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form when editingPayment changes
  useEffect(() => {
    if (editingPayment) {
      setFormData({
        paymentDate: new Date(editingPayment.date).toISOString().split("T")[0],
        amount: editingPayment.amount.toString(),
        currency: editingPayment.currency,
        paymentMethod: editingPayment.method as
          | "creditCard"
          | "cash"
          | "transfer",
        reference: editingPayment.reference,
      });
    }
  }, [editingPayment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      let payment;
      if (editingPayment) {
        // Update existing payment
        payment = await paymentsService.update(editingPayment.id, {
          amount,
          currency: formData.currency,
          method: formData.paymentMethod,
          reference: formData.reference,
          date: new Date(formData.paymentDate).toISOString(),
        });
      } else {
        // Create new payment
        payment = await paymentsService.create({
          saleId,
          date: formData.paymentDate,
          amount,
          currency: formData.currency,
          method: formData.paymentMethod,
          reference: formData.reference,
        });
      }

      if (payment?.data) {
        // Extract the payment object from the response
        onPaymentAdded(payment.data as unknown as Payment);
      }
      onClose();

      // Reset form
      setFormData({
        paymentDate: new Date().toISOString().split("T")[0],
        amount: "",
        currency: currency,
        paymentMethod: "cash",
        reference: "",
      });
    } catch (err) {
      console.log(err);
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${editingPayment ? "update" : "create"} payment`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Import currency options from company types
  const currencyOptions = [
    { value: "USD", label: "USD - Dólar Americano" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "CLP", label: "CLP - Peso Chileno" },
    { value: "ARS", label: "ARS - Peso Argentino" },
    { value: "BRL", label: "BRL - Real Brasileño" },
    { value: "MXN", label: "MXN - Peso Mexicano" },
    { value: "COP", label: "COP - Peso Colombiano" },
    { value: "PEN", label: "PEN - Sol Peruano" },
    { value: "UYU", label: "UYU - Peso Uruguayo" },
    { value: "BOB", label: "BOB - Boliviano" },
  ];

  const methodOptions = [
    { value: "cash", label: "Efectivo" },
    { value: "creditCard", label: "Tarjeta de Crédito" },
    { value: "transfer", label: "Transferencia" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPayment ? "Editar Pago" : "Registrar Pago"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Pago
            </label>
            <Input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => handleInputChange("paymentDate", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Select
              label="Moneda"
              options={currencyOptions}
              value={formData.currency}
              onChange={(e) => handleInputChange("currency", e.target.value)}
            />
          </div>

          <div>
            <Select
              label="Método de Pago"
              options={methodOptions}
              value={formData.paymentMethod}
              onChange={(e) =>
                handleInputChange("paymentMethod", e.target.value)
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referencia
          </label>
          <Input
            type="text"
            value={formData.reference}
            onChange={(e) => handleInputChange("reference", e.target.value)}
            placeholder="Número de recibo, transferencia, etc."
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Guardando..."
              : editingPayment
              ? "Actualizar Pago"
              : "Registrar Pago"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
