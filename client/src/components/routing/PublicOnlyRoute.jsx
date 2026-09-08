import { Navigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return children;
  }

  const destination =
    user?.role === "ORGANIZER" ? "/organizer/events" : "/events";

  return <Navigate to={destination} replace />;
}
