import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { Layout } from "./components/layout/layout";
import { LoginPage } from "./pages/login";
import { DashboardPage } from "./pages/dashboard";
import { SalesListPage } from "./pages/sales/sales-list";
import { NewSalePage } from "./pages/sales/new-sale";
import { SaleDetailPage } from "./pages/sales/sale-detail";
import { SaleEditPage } from "./pages/sales/sale-edit";
import { ClientsListPage } from "./pages/clients/clients-list";
import { NewClientPage } from "./pages/clients/new-client";
import { EditClientPage } from "./pages/clients/edit-client";
import { SuppliersListPage } from "./pages/suppliers/suppliers-list";
import { NewSupplierPage } from "./pages/suppliers/new-supplier";
import { EditSupplierPage } from "./pages/suppliers/edit-supplier";
import { OperatorsListPage } from "./pages/operators/operators-list";
import { NewOperatorPage } from "./pages/operators/new-operator";
import { EditOperatorPage } from "./pages/operators/edit-operator";
import { ClassificationsListPage } from "./pages/classifications/classifications-list";
import { NewClassificationPage } from "./pages/classifications/new-classification";
import { EditClassificationPage } from "./pages/classifications/edit-classification";
import { PaymentsListPage } from "./pages/payments/payments-list";
import { InvoicesListPage } from "./pages/invoices/invoices-list";
import {
  SupplierPaymentsPage,
  SupplierDetailPage,
  NewPaymentPage,
} from "./pages/supplier-payments";
import { PassengersListPage } from "./pages/passengers/passengers-list";
import { NewPassengerPage } from "./pages/passengers/new-passenger";
import { EditPassengerPage } from "./pages/passengers/edit-passenger";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sales" element={<SalesListPage />} />
            <Route path="/sales/new" element={<NewSalePage />} />
            <Route path="/sales/:id" element={<SaleDetailPage />} />
            <Route path="/sales/:id/edit" element={<SaleEditPage />} />
            <Route path="/clients" element={<ClientsListPage />} />
            <Route path="/clients/new" element={<NewClientPage />} />
            <Route path="/clients/:id/edit" element={<EditClientPage />} />
            <Route path="/passengers" element={<PassengersListPage />} />
            <Route path="/passengers/new" element={<NewPassengerPage />} />
            <Route
              path="/passengers/:id/edit"
              element={<EditPassengerPage />}
            />
            <Route path="/suppliers" element={<SuppliersListPage />} />
            <Route path="/suppliers/new" element={<NewSupplierPage />} />
            <Route path="/suppliers/:id/edit" element={<EditSupplierPage />} />
            <Route path="/operators" element={<OperatorsListPage />} />
            <Route path="/operators/new" element={<NewOperatorPage />} />
            <Route path="/operators/:id/edit" element={<EditOperatorPage />} />
            <Route
              path="/classifications"
              element={<ClassificationsListPage />}
            />
            <Route
              path="/classifications/new"
              element={<NewClassificationPage />}
            />
            <Route
              path="/classifications/:id/edit"
              element={<EditClassificationPage />}
            />
            <Route path="/payments" element={<PaymentsListPage />} />
            <Route path="/invoices" element={<InvoicesListPage />} />
            <Route
              path="/supplier-payments"
              element={<SupplierPaymentsPage />}
            />
            <Route path="/supplier-payments/new" element={<NewPaymentPage />} />
            <Route
              path="/supplier-payments/supplier/:supplierId"
              element={<SupplierDetailPage />}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
