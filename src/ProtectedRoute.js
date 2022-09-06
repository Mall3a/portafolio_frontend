import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};
