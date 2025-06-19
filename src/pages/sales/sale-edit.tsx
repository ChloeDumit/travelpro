import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { SaleForm } from '../../components/sales/sale-form';
import { SaleFormData, SaleItemFormData } from '../../types';
import { salesService } from '../../lib/services/sales';
import { Client } from '../../types/client';

export function SaleEditPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!id) return;
      try {
        const sale = await salesService.getSaleById(id);
        setInitialData(sale.sale);
      } catch (err) {
        setError('Error fetching sale data');
      }
    };
    fetchInitialData();
  }, [id]);

  const handleSubmit = async (saleData: SaleFormData & { client: Client | null }, items: SaleItemFormData[]) => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      // Convert SaleFormData to Partial<Sale> format
      const updateData = {
        passengerName: saleData.passengerName,
        clientId: saleData.clientId,
        travelDate: saleData.travelDate,
        saleType: saleData.saleType,
        region: saleData.region,
        serviceType: saleData.serviceType,
        currency: saleData.currency,
        passengerCount: saleData.passengerCount,
        totalCost: saleData.totalCost,
        pendingBalance: saleData.totalCost - (saleData.totalSale || 0),
      };
      
      const sale = await salesService.updateSale(id, updateData);
      navigate(`/sales/${sale.sale.id}`);
    } catch (err) {
      setError('Error al actualizar la venta');
      console.error('Error updating sale:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Editar Venta</h2>
        <Button variant="outline" size="sm" onClick={() => navigate('/sales')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <SaleForm onSubmit={handleSubmit} initialData={initialData} />
    </div>
  );
}