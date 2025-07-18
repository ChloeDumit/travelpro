import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Ban, Check, Printer, Pencil } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { SaleSummary } from '../../components/sales/sale-summary';
import { PaymentForm } from '../../components/sales/payment-form';
import { PaymentHistory } from '../../components/sales/payment-history';
import { Sale, Payment } from '../../types';
import { salesService } from '../../lib/services/sales';

export function SaleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    const fetchSale = async () => {
      if (!id) return;
      try {
        const saleData = await salesService.getSaleById(id);
        setSale(saleData);
      } catch (err) {
        setError('Failed to fetch sale details');
        console.error('Error fetching sale:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
  }, [id]);

  const handleStatusUpdate = async (status: 'completed' | 'cancelled') => {
    if (!id) return;

    try {
      const updatedSale = await salesService.updateSaleStatus(id, status);
      setSale(updatedSale.sale);
  
    } catch (err) {
      console.error('Error updating sale status:', err);
    }
  };

  const handlePaymentAdded = (payment: Payment) => {
    if (sale) {
      setSale(prev => prev ? { ...prev, payments: [payment, ...(prev.payments || [])] } : null);
    }
  };

  // Calculate total sale amount from items
  const calculateTotalSale = (sale: Sale) => {
    if (!sale.items) return sale.totalCost;
    return sale.items.reduce((total, item) => total + item.salePrice, 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !sale) {
    return <div className="text-red-500">{error || 'Sale not found'}</div>;
  }

  const totalSale = calculateTotalSale(sale);
  const payments = sale.payments || [];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 ">
            <Button variant="outline" size="sm" onClick={() => navigate('/sales')}>
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
        {sale.status !== 'completed' && (
          <>
          <Button 
            variant="success" 
            size="sm"
            onClick={() => handleStatusUpdate('completed')}
          >
            <Check className="mr-2 h-4 w-4" />
            Completar Venta
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/sales/${id}/edit`)}
          >
            <Pencil  className="mr-2 h-4 w-4" />
            Editar Venta
          </Button>
          </>
        )}
        {sale.status !== 'cancelled' && sale.status !== 'completed' && (
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => handleStatusUpdate('cancelled')}
          >
            <Ban className="mr-2 h-4 w-4" />
            Cancelar Venta
          </Button>
        )}
        {sale.status === 'completed' && (
            <Button 
            variant="outline" 
            size="sm"
            onClick={() => console.log('Generar Factura')}
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
        currency={sale.currency} 
      />

      <PaymentForm
        saleId={sale.id}
        totalSale={totalSale}
        currency={sale.currency}
        onPaymentAdded={handlePaymentAdded}
        onClose={() => setShowPaymentForm(false)}
        isOpen={showPaymentForm}
      />
    </div>
  );
}