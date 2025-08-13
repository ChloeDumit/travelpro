import React, { useEffect, useState } from "react";
import {
  BarChart,
  DollarSign,
  Users,
  Package,
  Calendar,
  TrendingUp,
  CreditCard,
  Plus,
  FileText,
  UserPlus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Shield,
  UserCheck,
  PieChart,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { salesService } from "../lib/services/sales";
import { useAuth } from "../contexts/auth-context";

interface SalesStats {
  totalSales: number;
  salesCount: number;
  salesByStatus: {
    draft?: number;
    confirmed?: number;
    completed?: number;
    cancelled?: number;
  };
}

interface SalesStatsByType {
  salesBySaleType: {
    [key: string]: {
      count: number;
      totalCost: number;
    };
  };
  salesByServiceType: {
    [key: string]: {
      count: number;
      totalCost: number;
    };
  };
  salesByRegion: {
    [key: string]: {
      count: number;
      totalCost: number;
    };
  };
}

interface UpcomingDeparture {
  id: string;
  passengerName: string;
  travelDate: string;
  region: string;
  serviceType: string;
  client: {
    name: string;
  };
}

export function DashboardPage() {
  const { user } = useAuth();
  const [totalSales, setTotalSales] = useState(0);
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [salesStatsByType, setSalesStatsByType] =
    useState<SalesStatsByType | null>(null);
  const [upcomingDepartures, setUpcomingDepartures] = useState<
    UpcomingDeparture[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === "admin";
  const isSales = user?.role === "sales";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [totalSalesData, statsData, statsByTypeData, departuresData] =
          await Promise.all([
            salesService.getTotalSales(),
            salesService.getSalesStats(),
            salesService.getSalesStatsByType(),
            salesService.getUpcomingDepartures(),
          ]);

        console.log("totalSales", totalSalesData);
        console.log("salesStats", statsData);
        console.log("salesStatsByType", statsByTypeData);
        console.log("upcomingDepartures", departuresData);

        setTotalSales(totalSalesData || 0);
        setSalesStats(statsData);
        setSalesStatsByType(statsByTypeData);
        setUpcomingDepartures(departuresData.departures || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getActiveBookings = () => {
    if (!salesStats) return 0;
    return (
      (salesStats.salesByStatus.confirmed || 0) +
      (salesStats.salesByStatus.completed || 0)
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
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "new-sale":
        window.location.href = "/sales/new";
        break;
      case "new-client":
        window.location.href = "/clients/new";
        break;
      case "view-sales":
        window.location.href = "/sales";
        break;
      case "view-clients":
        window.location.href = "/clients";
        break;
      case "manage-users":
        window.location.href = "/users";
        break;
      case "reports":
        window.location.href = "/reports";
        break;
      default:
        break;
    }
  };

  const getWelcomeMessage = () => {
    console.log(user);
    if (isAdmin) {
      return `¡Bienvenido de vuelta, ${user?.username}! Aquí tienes una vista completa de tu negocio.`;
    } else if (isSales) {
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
      },
      {
        action: "new-client",
        icon: <UserPlus className="h-8 w-8 text-green-600 mb-2" />,
        label: "Agregar Cliente",
        color: "text-green-600",
      },
      {
        action: "view-sales",
        icon: <FileText className="h-8 w-8 text-purple-600 mb-2" />,
        label: "Ver Ventas",
        color: "text-purple-600",
      },
    ];

    if (isAdmin) {
      return [
        ...baseActions,
        {
          action: "view-clients",
          icon: <Users className="h-8 w-8 text-orange-600 mb-2" />,
          label: "Gestionar Clientes",
          color: "text-orange-600",
        },
        {
          action: "manage-users",
          icon: <Shield className="h-8 w-8 text-red-600 mb-2" />,
          label: "Gestionar Usuarios",
          color: "text-red-600",
        },
        {
          action: "reports",
          icon: <PieChart className="h-8 w-8 text-indigo-600 mb-2" />,
          label: "Reportes",
          color: "text-indigo-600",
        },
      ];
    }

    return [
      ...baseActions,
      {
        action: "view-clients",
        icon: <Users className="h-8 w-8 text-orange-600 mb-2" />,
        label: "Ver Clientes",
        color: "text-orange-600",
      },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getWelcomeMessage()}
          </h1>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <Button
              onClick={() => handleQuickAction("new-sale")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Venta
            </Button>
          )}
          {isAdmin && (
            <Button
              onClick={() => handleQuickAction("new-client")}
              variant="outline"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          )}
          {isSales && (
            <Button
              onClick={() => handleQuickAction("new-sale")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Venta
            </Button>
          )}
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
                onClick={() => handleQuickAction(action.action)}
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {isAdmin ? "Ingresos Totales" : "Mis ingresos"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">Cargando...</div>
            ) : error ? (
              <div className="text-2xl font-bold text-red-500">Error</div>
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalSales, "USD")}
              </div>
            )}
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              {isAdmin ? "Ingresos totales" : "Mis ingresos totales"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {isAdmin ? "Reservas Activas" : "Mis Reservas"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">Cargando...</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {getActiveBookings()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {salesStats?.salesByStatus.confirmed || 0} confirmadas,{" "}
                  {salesStats?.salesByStatus.completed || 0} completadas
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {isAdmin ? "Total de Ventas" : "Mis Ventas"}
            </CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">Cargando...</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-purple-600">
                  {salesStats?.salesCount || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {isAdmin ? "Total de ventas" : "Mis ventas totales"}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {isAdmin ? "Ventas Pendientes" : "Mis Pendientes"}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">Cargando...</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-600">
                  {salesStats?.salesByStatus.draft || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {isAdmin
                    ? "Ventas en borrador esperando confirmación"
                    : "Mis ventas en borrador"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin-specific section */}
      {isAdmin && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Panel de Administración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <UserCheck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Gestión de Usuarios
                </p>
                <p className="text-xs text-gray-500">
                  Administrar roles y permisos
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <PieChart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Reportes Avanzados
                </p>
                <p className="text-xs text-gray-500">
                  Análisis detallado de ventas
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Métricas del Sistema
                </p>
                <p className="text-xs text-gray-500">
                  Rendimiento y estadísticas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sales-specific section */}
      {isSales && (
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
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Status Overview */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-blue-600" />
              Estado de Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesStats ? (
                [
                  {
                    name: "Borrador",
                    count: salesStats.salesByStatus.draft || 0,
                    status: "draft",
                    color: "bg-gray-500",
                  },
                  {
                    name: "Confirmada",
                    count: salesStats.salesByStatus.confirmed || 0,
                    status: "confirmed",
                    color: "bg-blue-500",
                  },
                  {
                    name: "Completada",
                    count: salesStats.salesByStatus.completed || 0,
                    status: "completed",
                    color: "bg-green-500",
                  },
                  {
                    name: "Cancelada",
                    count: salesStats.salesByStatus.cancelled || 0,
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
                        {salesStats.salesCount > 0
                          ? Math.round(
                              (status.count / salesStats.salesCount) * 100
                            )
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Cargando...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Departures */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Próximas Salidas
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAction("view-sales")}
                className="text-xs"
              >
                Ver Todas <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDepartures.length > 0 ? (
                upcomingDepartures.slice(0, 5).map((trip, i) => {
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
                  {loading ? "Cargando..." : "No hay próximas salidas"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Service Type */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-purple-600" />
              Servicios Principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {salesStatsByType ? (
                Object.entries(salesStatsByType.salesByServiceType)
                  .sort(([, a], [, b]) => b.count - a.count)
                  .slice(0, 5)
                  .map(([type, data], i) => {
                    const totalCount = Object.values(
                      salesStatsByType.salesByServiceType
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

                    // Translate service types
                    const getServiceTypeLabel = (type: string) => {
                      const translations: { [key: string]: string } = {
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
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{percentage}% del total</span>
                          <span>{formatCurrency(data.totalCost, "USD")}</span>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Cargando...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales by Region */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              Ventas por Región
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {salesStatsByType ? (
                Object.entries(salesStatsByType.salesByRegion)
                  .sort(([, a], [, b]) => b.count - a.count)
                  .map(([region, data], i) => {
                    const totalCount = Object.values(
                      salesStatsByType.salesByRegion
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

                    // Translate regions
                    const getRegionLabel = (region: string) => {
                      const translations: { [key: string]: string } = {
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
                  })
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Cargando...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Type */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-teal-600" />
              Ventas por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {salesStatsByType ? (
                Object.entries(salesStatsByType.salesBySaleType)
                  .sort(([, a], [, b]) => b.count - a.count)
                  .map(([type, data], i) => {
                    const totalCount = Object.values(
                      salesStatsByType.salesBySaleType
                    ).reduce((sum, item) => sum + item.count, 0);
                    const percentage =
                      totalCount > 0
                        ? Math.round((data.count / totalCount) * 100)
                        : 0;
                    const colors = [
                      "bg-teal-500",
                      "bg-cyan-500",
                      "bg-emerald-500",
                      "bg-sky-500",
                    ];

                    // Translate sale types
                    const getSaleTypeLabel = (type: string) => {
                      const translations: { [key: string]: string } = {
                        individual: "Individual",
                        corporate: "Corporativo",
                        sports: "Deportes",
                        group: "Grupo",
                      };
                      return translations[type] || type;
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
                              {getSaleTypeLabel(type).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {getSaleTypeLabel(type)}
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
                  })
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Cargando...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
