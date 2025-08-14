import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { formatCurrency, formatDate, getStatusColor } from "../../lib/utils";
import { Sale, SaleStatus } from "../../types";
import { salesService } from "../../lib/services/sales.service";
import { useAuth } from "../../contexts/auth-context";

export function SalesListPage() {
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<SaleStatus | "all">("all");
  const { user } = useAuth();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const isAdmin = user?.role === "admin";
        const service = isAdmin ? salesService.getAll : salesService.getMySales;
        const response = await service();
        setSales(response.data?.sales || []);
      } catch (err) {
        setError("Failed to fetch sales");
        console.error("Error fetching sales:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredSales(sales);
    } else {
      setFilteredSales(sales.filter((sale) => sale.status === statusFilter));
    }
  }, [sales, statusFilter]);

  const handleStatusFilter = (status: SaleStatus | "all") => {
    setStatusFilter(status);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Ventas</h2>
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate("/sales/new")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("all")}
          >
            Todas las Ventas
          </Button>
          <Button
            variant={statusFilter === "confirmed" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("confirmed")}
          >
            Confirmadas
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("completed")}
          >
            Completadas
          </Button>
          <Button
            variant={statusFilter === "cancelled" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleStatusFilter("cancelled")}
          >
            Canceladas
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredSales.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {statusFilter === "all"
              ? "No sales found"
              : `No ${statusFilter} sales found`}
          </div>
        ) : (
          filteredSales.map((sale) => (
            <Card
              key={sale.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/sales/${sale.id}`)}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <h3 className="text-lg font-medium">
                      {sale.passengerName}
                    </h3>
                    <Badge className={getStatusColor(sale.status)}>
                      {sale.status.charAt(0).toUpperCase() +
                        sale.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">ID de Venta</p>
                      <p className="text-sm font-medium">#{sale.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID de Cliente</p>
                      <p className="text-sm font-medium">{sale.clientId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Creación</p>
                      <p className="text-sm">{formatDate(sale.creationDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Viaje</p>
                      <p className="text-sm">{formatDate(sale.travelDate)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="text-sm capitalize">{sale.saleType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Servicio</p>
                      <p className="text-sm capitalize">{sale.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Región</p>
                      <p className="text-sm capitalize">{sale.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pasajeros</p>
                      <p className="text-sm">{sale.passengerCount}</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 flex flex-col justify-between border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Venta</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(sale.salePrice, sale.currency)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Vendedor</p>
                    <p className="text-sm">{sale.seller?.username}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
