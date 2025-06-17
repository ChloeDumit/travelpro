import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Download, ArrowLeft } from 'lucide-react';
import { Header } from '../../components/layout/header';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { Sale } from '../../types';
import { salesService } from '../../lib/services/sales';

export function SalesListPage() {
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await salesService.getAllSales();
        setSales(response.sales);
      } catch (err) {
        setError('Failed to fetch sales');
        console.error('Error fetching sales:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Sales</h2>
        <Button variant='default' size="sm" onClick={() => navigate('/sales/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            All Sales
          </Button>
          <Button variant="ghost" size="sm">
            Drafts
          </Button>
          <Button variant="ghost" size="sm">
            Confirmed
          </Button>
          <Button variant="ghost" size="sm">
            Completed
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
        {sales.map((sale) => (
          <Card 
            key={sale.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/sales/${sale.id}`)}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h3 className="text-lg font-medium">{sale.passengerName}</h3>
                  <Badge className={getStatusColor(sale.status)}>
                    {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Sale ID</p>
                    <p className="text-sm font-medium">#{sale.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Client ID</p>
                    <p className="text-sm font-medium">{sale.clientId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Creation Date</p>
                    <p className="text-sm">{formatDate(sale.creationDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Travel Date</p>
                    <p className="text-sm">{formatDate(sale.travelDate)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="text-sm capitalize">{sale.saleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="text-sm capitalize">{sale.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Region</p>
                    <p className="text-sm capitalize">{sale.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Passengers</p>
                    <p className="text-sm">{sale.passengerCount}</p>
                  </div>
                </div>
              </div>
              <div className="md:w-64 flex flex-col justify-between border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-4">
                <div>
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="text-lg font-bold">{formatCurrency(sale.totalCost, sale.currency)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance Due</p>
                  <p className={`text-sm font-medium ${sale.pendingBalance > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                    {formatCurrency(sale.pendingBalance, sale.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seller</p>
                  <p className="text-sm">{sale.seller.username}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}