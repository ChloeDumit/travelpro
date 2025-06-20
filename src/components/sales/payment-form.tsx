import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Modal } from '../ui/modal';
import { paymentsService } from '../../lib/services/payments';
import { Payment } from '../../types';

interface PaymentFormProps {
  saleId: string;
  totalSale: number;
  currency: 'USD' | 'EUR' | 'local';
  onPaymentAdded: (payment: Payment) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function PaymentForm({ 
  saleId, 
  totalSale, 
  currency, 
  onPaymentAdded, 
  onClose, 
  isOpen 
}: PaymentFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    currency: currency,
    method: 'cash' as 'creditCard' | 'cash' | 'transfer',
    reference: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const payment = await paymentsService.createPayment({
        saleId,
        date: formData.date,
        amount,
        currency: formData.currency,
        method: formData.method,
        reference: formData.reference,
      });

      onPaymentAdded(payment);
      onClose();
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        currency: currency,
        method: 'cash',
        reference: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'local', label: 'Local' },
  ];

  const methodOptions = [
    { value: 'cash', label: 'Efectivo' },
    { value: 'creditCard', label: 'Tarjeta de Crédito' },
    { value: 'transfer', label: 'Transferencia' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Pago">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Pago
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
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
              onChange={(e) => handleInputChange('amount', e.target.value)}
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
              onChange={(e) => handleInputChange('currency', e.target.value)}
            />
          </div>

          <div>
            <Select
              label="Método de Pago"
              options={methodOptions}
              value={formData.method}
              onChange={(e) => handleInputChange('method', e.target.value)}
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
            onChange={(e) => handleInputChange('reference', e.target.value)}
            placeholder="Número de recibo, transferencia, etc."
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Registrar Pago'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 