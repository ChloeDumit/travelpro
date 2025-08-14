import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, Download } from "lucide-react";
import { Header } from "../../components/layout/header";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { formatCurrency, formatDate, getStatusColor } from "../../lib/utils";
import { Payment } from "../../types";

// Mock data for payments
const mockPayments: Payment[] = [
  {
    id: "PAY-1001",
    saleId: "1001",
    date: "2025-05-10T10:30:00",
    amount: 2500,
    currency: "USD",
    method: "creditCard",
    reference: "VISA-1234",
    status: "confirmed",
  },
  {
    id: "PAY-1002",
    saleId: "1003",
    date: "2025-05-12T14:45:00",
    amount: 5200,
    currency: "EUR",
    method: "transfer",
    reference: "WIRE-5678",
    status: "confirmed",
  },
  {
    id: "PAY-1003",
    saleId: "1004",
    date: "2025-05-15T09:15:00",
    amount: 1200,
    currency: "USD",
    method: "cash",
    reference: "RECEIPT-9012",
    status: "confirmed",
  },
  {
    id: "PAY-1004",
    saleId: "1001",
    date: "2025-05-20T16:30:00",
    amount: 1000,
    currency: "USD",
    method: "transfer",
    reference: "WIRE-3456",
    status: "pending",
  },
];

export function PaymentsListPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Header
        title="Pagos"
        actions={
          <Button onClick={() => navigate("/payments/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Payment
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            All Payments
          </Button>
          <Button variant="ghost" size="sm">
            Credit Card
          </Button>
          <Button variant="ghost" size="sm">
            Cash
          </Button>
          <Button variant="ghost" size="sm">
            Transfer
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {mockPayments.map((payment) => (
          <Card
            key={payment.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/payments/${payment.id}`)}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h3 className="text-lg font-medium">{payment.id}</h3>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status.charAt(0).toUpperCase() +
                      payment.status.slice(1)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Payment Date</p>
                    <p className="text-sm">{formatDate(payment.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sale Reference</p>
                    <p className="text-sm font-medium">#{payment.saleId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Method</p>
                    <p className="text-sm capitalize">
                      {payment.method === "creditCard"
                        ? "Credit Card"
                        : payment.method}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="text-sm">{payment.reference}</p>
                </div>
              </div>
              <div className="md:w-48 flex flex-col justify-between border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-4">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(payment.amount, payment.currency)}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    View
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
