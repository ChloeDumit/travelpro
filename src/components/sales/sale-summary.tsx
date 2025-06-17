import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { Sale, SaleItem } from '../../types';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface SaleSummaryProps {
  sale: Sale;
}

export function SaleSummary({ sale }: SaleSummaryProps) {

  const items = sale.sale.items;
  const saleData = sale.sale;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sale #{sale.id}</span>
            <Badge className={getStatusColor(sale.status)}>
              {saleData.status.charAt(0).toUpperCase() + saleData.status.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Passenger</h3>
              <p className="mt-1 text-sm font-medium">{saleData.passengerName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Client ID</h3>
              <p className="mt-1 text-sm font-medium">{saleData.clientId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Creation Date</h3>
              <p className="mt-1 text-sm font-medium">{formatDate(saleData.creationDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Travel Date</h3>
              <p className="mt-1 text-sm font-medium">{formatDate(saleData.travelDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sale Type</h3>
              <p className="mt-1 text-sm font-medium capitalize">{saleData.saleType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Region</h3>
              <p className="mt-1 text-sm font-medium capitalize">{saleData.region}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Service Type</h3>
              <p className="mt-1 text-sm font-medium capitalize">{saleData.serviceType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Currency</h3>
              <p className="mt-1 text-sm font-medium">{saleData.currency}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Seller</h3>
              <p className="mt-1 text-sm font-medium">{saleData.seller.username}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Passengers</h3>
              <p className="mt-1 text-sm font-medium">{saleData.passengerCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <SaleItemCard key={item.id} item={item} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
 
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Total Cost:</span>
              <span>{formatCurrency(saleData.totalCost, saleData.currency)}</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold">
              <span>Balance Due:</span>
                <span className={saleData.pendingBalance > 0 ? 'text-danger-600' : 'text-success-600'}>
                {formatCurrency(saleData.pendingBalance, saleData.currency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SaleItemCardProps {
  item: SaleItem;
}

function SaleItemCard({ item }: SaleItemCardProps) {
  return (
    <div className="border rounded-md p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{item.classification}</h4>
          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
        </div>
        <Badge className={getStatusColor(item.status)}>
          {item.status.toUpperCase()}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <h5 className="text-xs text-gray-500">Provider</h5>
          <p className="text-sm">{item.provider}</p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Operator</h5>
          <p className="text-sm">{item.operator}</p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Date Range</h5>
          <p className="text-sm">
            {formatDate(item.dateIn)} - {formatDate(item.dateOut)}
          </p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Passengers</h5>
          <p className="text-sm">{item.passengerCount}</p>
        </div>
      </div>
      
      <div className="flex justify-between mt-4 pt-2 border-t">
        <div>
          <h5 className="text-xs text-gray-500">Sale Price</h5>
          <p className="text-sm font-medium">
            {formatCurrency(item.salePrice, item.saleCurrency)}
          </p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Cost Price</h5>
          <p className="text-sm">
            {formatCurrency(item.costPrice, item.costCurrency)}
          </p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Reservation Code</h5>
          <p className="text-sm">{item.reservationCode || 'N/A'}</p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Payment Date</h5>
          <p className="text-sm">{item.paymentDate ? formatDate(item.paymentDate) : 'Pending'}</p>
        </div>
      </div>
    </div>
  );
}