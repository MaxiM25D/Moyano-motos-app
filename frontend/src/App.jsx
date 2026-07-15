import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import Clients from "./pages/Clients/Clients.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Motorcycles from "./pages/Motorcycles/Motorcycles.jsx";
import Sales from "./pages/Sales/Sales.jsx";
import Installments from "./pages/Installments/Installments.jsx";
import Receipts from "./pages/Receipts/Receipts.jsx";
import Reports from "./pages/Reports/Reports.jsx";
import Users from "./pages/Users/Users.jsx";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clients />} />
        <Route path="motos" element={<Motorcycles />} />
        <Route path="ventas" element={<Sales />} />
        <Route path="cuotas" element={<Installments />} />
        <Route path="recibos" element={<Receipts />} />
        <Route path="reportes" element={<ProtectedRoute roles={["ADMIN", "COLLECTOR"]}><Reports /></ProtectedRoute>} />
        <Route path="usuarios" element={<ProtectedRoute roles={["ADMIN"]}><Users /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
