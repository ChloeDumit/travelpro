import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { Layout } from './components/layout/layout';
import { LoginPage } from './pages/login';
import { DashboardPage } from './pages/dashboard';
import { SalesListPage } from './pages/sales/sales-list';
import { SaleDetailPage } from './pages/sales/sale-detail';
import { NewSalePage } from './pages/sales/new-sale';
import { InvoicesListPage } from './pages/invoices/invoices-list';
import { PaymentsListPage } from './pages/payments/payments-list';

// Protected route component
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
                <Layout userRole="admin" />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard\" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="sales" element={<SalesListPage />} />
            <Route path="sales/:id" element={<SaleDetailPage />} />
            <Route path="sales/new" element={<NewSalePage />} />
            <Route path="invoices" element={<InvoicesListPage />} />
            <Route path="payments" element={<PaymentsListPage />} />
            <Route path="*" element={<Navigate to="/dashboard\" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;