import { useEffect } from "react";
import {
  BarChart,
  DollarSign,
  Users,
  Package,
  Calendar,
  TrendingUp,
  Plus,
  FileText,
  UserPlus,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { LoadingState } from "../components/ui/loading-spinner";
import { ErrorState } from "../components/ui/error-state";
import { salesService } from "../lib/services/sales.service";
import { useAuthState } from "../hooks/useAuthState";
import { useAsyncOperation } from "../hooks/useAsyncOperation";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../lib/utils";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAdmin, isSales } = useAuthState();

  const totalSalesOp = useAsyncOperation(salesService.getTotal);
  const statsOp = useAsyncOperation(salesService.getStats);
  const statsByTypeOp = useAsyncOperation(salesService.getStatsByType);
  const departuresOp = useAsyncOperation(salesService.getUpcomingDepartures);

  useEffect(() => {
    const loadDashboardData = async () => {
      await Promise.all([
        totalSalesOp.execute(),
        statsOp.execute(),
        statsByTypeOp.execute(),
        departuresOp.execute(),
      ]);
    };

    loadDashboardData();
  }, []);

  const isLoading =
    totalSalesOp.loading ||
    statsOp.loading ||
    statsByTypeOp.loading ||
    departuresOp.loading;
  const hasError =
    totalSalesOp.error ||
    statsOp.error ||
    statsByTypeOp.error ||
    departuresOp.error;

  const getActiveBookings = (): number => {
    if (!statsOp.data) return 0;
    return (
      (statsOp.data.salesByStatus.confirmed || 0) +
      (statsOp.data.salesByStatus.completed || 0)
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4 text-gray-500" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getWelcomeMessage = (): string => {
    if (isAdmin()) {
      return `¡Bienvenido de vuelta, ${user?.username}! Aquí tienes una vista completa de tu negocio.`;
    } else if (isSales()) {
      return `¡Bienvenido de vuelta, ${user?.username}! Aquí están tus ventas y actividades.`;
    }
    return "¡Bienvenido de vuelta! Aquí está lo que está pasando con tu negocio.";
  };

  const getQuickActions = () => {
    const baseActions = [
      {
        action: "new-sale",
        icon: <Plus className="h-8 w-8 text-blue-600 mb-2" />,
        label: "Crear Venta",
        color: "text-blue-600",
        onClick: () => navigate("/sales/new"),
      },
      {
        action: "new-client",
        icon: <UserPlus className="h-8 w-8 text-green-600 mb-2" />,
        label: "Agregar Cliente",
        color: "text-green-600",
        onClick: () => navigate("/clients/new"),
      },
      {
        action: "view-sales",
        icon: <FileText className="h-8 w-8 text-purple-600 mb-2" />,
        label: "Ver Ventas",
        color: "text-purple-600",
        onClick: () => navigate("/sales"),
      },
      {
        action: "view-clients",
        icon: <Users className="h-8 w-8 text-orange-600 mb-2" />,
        label: isAdmin() ? "Gestionar Clientes" : "Ver Clientes",
        color: "text-orange-600",
        onClick: () => navigate("/clients"),
      },
    ];

    return baseActions;
  };

  if (isLoading) {
    return <LoadingState message="Cargando dashboard..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        error={hasError}
        onRetry={() => {
          totalSalesOp.execute();
          statsOp.execute();
          statsByTypeOp.execute();
          departuresOp.execute();
        }}
        title="Error al cargar dashboard"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">{getWelcomeMessage()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getQuickActions().map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-100"
              >
                <div className={`h-8 w-8 mb-2 ${action.color}`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {isAdmin() ? "Ingresos Totales" : "Mis Ingresos"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalSalesOp.data?.total || 0, "USD")}
            </div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              {isAdmin() ? "Ingresos totales" : "Mis ingresos totales"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {isAdmin() ? "Reservas Activas" : "Mis Reservas"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getActiveBookings()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {statsOp.data?.salesByStatus.confirmed || 0} confirmadas,{" "}
              {statsOp.data?.salesByStatus.completed || 0} liquidadas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {isAdmin() ? "Total de Ventas" : "Mis Ventas"}
            </CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {statsOp.data?.salesCount || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isAdmin() ? "Total de ventas" : "Mis ventas totales"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Activity for Sales Users */}
      {isSales() && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Mi Actividad de Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Rendimiento</p>
                <p className="text-xs text-gray-500">Tus métricas de ventas</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Próximas Salidas
                </p>
                <p className="text-xs text-gray-500">
                  Tus reservas confirmadas
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Historial</p>
                <p className="text-xs text-gray-500">Todas tus ventas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Status Overview */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-blue-600" />
              Estado de Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsOp.data ? (
                [
                  {
                    name: "Confirmada",
                    count: statsOp.data.salesByStatus.confirmed || 0,
                    status: "confirmed",
                    color: "bg-blue-500",
                  },
                  {
                    name: "Completada",
                    count: statsOp.data.salesByStatus.completed || 0,
                    status: "completed",
                    color: "bg-green-500",
                  },
                  {
                    name: "Cancelada",
                    count: statsOp.data.salesByStatus.cancelled || 0,
                    status: "cancelled",
                    color: "bg-red-500",
                  },
                ].map((status, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-8 w-8 rounded-full ${status.color} flex items-center justify-center`}
                      >
                        {getStatusIcon(status.status)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {status.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {status.count} ventas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {status.count}
                      </p>
                      <p className="text-xs text-gray-500">
                        {statsOp.data?.salesCount && statsOp.data.salesCount > 0
                          ? Math.round(
                              (status.count / statsOp.data.salesCount) * 100
                            )
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <LoadingState message="Cargando estadísticas..." />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Departures */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Próximas Salidas
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/sales")}
                className="text-xs"
              >
                Ver Todas <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departuresOp.data?.departures &&
              departuresOp.data.departures.length > 0 ? (
                departuresOp.data.departures.slice(0, 5).map((trip, i) => {
                  const travelDate = new Date(trip.travelDate);
                  const formattedDate = travelDate.toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={i}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {trip.passengerName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {trip.region} • {trip.serviceType}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {formattedDate}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No hay próximas salidas
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Types and Regions */}
      {statsByTypeOp.data && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Services */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-purple-600" />
                Servicios Principales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(statsByTypeOp.data.salesByServiceType)
                  .sort(([, a], [, b]) => b.count - a.count)
                  .slice(0, 5)
                  .map(([type, data], i) => {
                    const totalCount = Object.values(
                      statsByTypeOp.data!.salesByServiceType
                    ).reduce((sum, item) => sum + item.count, 0);
                    const percentage =
                      totalCount > 0
                        ? Math.round((data.count / totalCount) * 100)
                        : 0;
                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-purple-500",
                      "bg-orange-500",
                      "bg-red-500",
                    ];

                    const getServiceTypeLabel = (type: string) => {
                      const translations: Record<string, string> = {
                        flight: "Vuelo",
                        hotel: "Hotel",
                        package: "Paquete",
                        transfer: "Traslado",
                        excursion: "Excursión",
                        insurance: "Seguro",
                        other: "Otro",
                      };
                      return translations[type] || type;
                    };

                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">
                            {getServiceTypeLabel(type)}
                          </div>
                          <div className="font-bold">{data.count}</div>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              colors[i % colors.length]
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{percentage}% del total</span>
                          <span>{formatCurrency(data.totalCost, "USD")}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Regions */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                Ventas por Región
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(statsByTypeOp.data.salesByRegion)
                  .sort(([, a], [, b]) => b.count - a.count)
                  .map(([region, data], i) => {
                    const totalCount = Object.values(
                      statsByTypeOp.data!.salesByRegion
                    ).reduce((sum, item) => sum + item.count, 0);
                    const percentage =
                      totalCount > 0
                        ? Math.round((data.count / totalCount) * 100)
                        : 0;
                    const colors = [
                      "bg-indigo-500",
                      "bg-pink-500",
                      "bg-yellow-500",
                    ];

                    const getRegionLabel = (region: string) => {
                      const translations: Record<string, string> = {
                        national: "Nacional",
                        international: "Internacional",
                        regional: "Regional",
                      };
                      return translations[region] || region;
                    };

                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`h-6 w-6 rounded-full ${
                              colors[i % colors.length]
                            } flex items-center justify-center`}
                          >
                            <span className="text-xs text-white font-bold">
                              {getRegionLabel(region).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {getRegionLabel(region)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {data.count} ventas
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{percentage}%</p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(data.totalCost, "USD")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
