import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { Sale, SaleItem } from '../../types';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface SaleSummaryProps {
  sale: Sale;
}

export function SaleSummary({ sale }: SaleSummaryProps) {
console.log(sale);
  const items = sale.items;
  const saleData = sale;

  console.log(saleData);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Venta #{saleData.id}</span>
            <Badge className={getStatusColor(saleData.status)}>
              {saleData.status.charAt(0).toUpperCase() + saleData.status.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pasajero</h3>
              <p className="mt-1 text-sm font-medium">{saleData.passengerName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">ID/RUT</h3>
              <p className="mt-1 text-sm font-medium">{saleData.clientId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Fecha de Creación</h3>
              <p className="mt-1 text-sm font-medium">{formatDate(saleData.creationDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Fecha de Viaje</h3>
              <p className="mt-1 text-sm font-medium">{formatDate(saleData.travelDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tipo de Venta</h3>
              <p className="mt-1 text-sm font-medium capitalize">{saleData.saleType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Región</h3>
              <p className="mt-1 text-sm font-medium capitalize">{saleData.region}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tipo de Servicio</h3>
              <p className="mt-1 text-sm font-medium capitalize">{saleData.serviceType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Moneda</h3>
              <p className="mt-1 text-sm font-medium">{saleData.currency}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Vendedor</h3>
              <p className="mt-1 text-sm font-medium">{saleData.seller.username}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pasajeros</h3>
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
          <CardTitle>Resumen Financiero</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Costo Total:</span>
              <span>{formatCurrency(saleData.totalCost, saleData.currency)}</span>
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
          <h5 className="text-xs text-gray-500">Proveedor</h5>
          <p className="text-sm">{item.provider}</p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Operador</h5>
          <p className="text-sm">{item.operator}</p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Rango de Fecha</h5>
          <p className="text-sm">
            {formatDate(item.dateIn)} - {formatDate(item.dateOut)}
          </p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Pasajeros</h5>
          <p className="text-sm">{item.passengerCount}</p>
        </div>
      </div>
      
      <div className="flex justify-between mt-4 pt-2 border-t">
        <div>
          <h5 className="text-xs text-gray-500">Precio de Venta</h5>
          <p className="text-sm font-medium">
            {formatCurrency(item.salePrice, item.saleCurrency)}
          </p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Precio de Costo</h5>
          <p className="text-sm">
            {formatCurrency(item.costPrice, item.costCurrency)}
          </p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Código de Reserva</h5>
          <p className="text-sm">{item.reservationCode || 'N/A'}</p>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">Fecha de Pago</h5>
          <p className="text-sm">{item.paymentDate ? formatDate(item.paymentDate) : 'Pending'}</p>
        </div>
      </div>
    </div>
  );
}