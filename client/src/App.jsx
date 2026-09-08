import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/routing/ProtectedRoute";
import PublicOnlyRoute from "./components/routing/PublicOnlyRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import EventsPage from "./pages/customer/EventsPage";
import MyBookingsPage from "./pages/customer/MyBookingsPage";
import OrganizerDashboardPage from "./pages/organizer/OrganizerDashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/events" replace />} />

      <Route path="/events" element={<EventsPage />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizer/events"
        element={
          <ProtectedRoute allowedRoles={["ORGANIZER"]}>
            <OrganizerDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route path="*" element={<Navigate to="/events" replace />} />
    </Routes>
  );
}
