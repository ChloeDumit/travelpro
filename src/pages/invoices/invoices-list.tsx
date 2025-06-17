import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Download } from 'lucide-react';
import { Header } from '../../components/layout/header';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { Invoice } from '../../types';

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: 'INV-1001',
    saleId: '1001',
    invoiceNumber: 'INV20250501-001',
    date: '2025-05-01T10:30:00',
    amount: 3500,
    currency: 'USD',
    status: 'paid',
  },
  {
    id: 'INV-1002',
    saleId: '1002',
    invoiceNumber: 'INV20250502-001',
    date: '2025-05-02T14:45:00',
    amount: 850,
    currency: 'USD',
    status: 'pending',
  },
  {
    id: 'INV-1003',
    saleId: '1003',
    invoiceNumber: 'INV20250503-001',
    date: '2025-05-03T09:15:00',
    amount: 5200,
    currency: 'EUR',
    status: 'paid',
  },
  {
    id: 'INV-1004',
    saleId: '1004',
    invoiceNumber: 'INV20250504-001',
    date: '2025-05-04T16:30:00',
    amount: 1200,
    currency: 'USD',
    status: 'paid',
  },
  {
    id: 'INV-1005',
    saleId: '1005',
    invoiceNumber: 'INV20250505-001',
    date: '2025-05-05T11:20:00',
    amount: 3000,
    currency: 'USD',
    status: 'cancelled',
  },
];

export function InvoicesListPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Header 
        title="Invoices" 
        actions={
          <Button onClick={() => navigate('/invoices/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        } 
      />

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            All Invoices
          </Button>
          <Button variant="ghost" size="sm">
            Pending
          </Button>
          <Button variant="ghost" size="sm">
            Paid
          </Button>
          <Button variant="ghost" size="sm">
            Cancelled
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
        {mockInvoices.map((invoice) => (
          <Card 
            key={invoice.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/invoices/${invoice.id}`)}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h3 className="text-lg font-medium">{invoice.invoiceNumber}</h3>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Invoice Date</p>
                    <p className="text-sm">{formatDate(invoice.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sale Reference</p>
                    <p className="text-sm font-medium">#{invoice.saleId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Currency</p>
                    <p className="text-sm">{invoice.currency}</p>
                  </div>
                </div>
              </div>
              <div className="md:w-48 flex flex-col justify-between border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-4">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-lg font-bold">{formatCurrency(invoice.amount, invoice.currency)}</p>
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