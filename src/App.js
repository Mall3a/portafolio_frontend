// This is a React Router v6 app
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { AuthProvider } from "./AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default App;
