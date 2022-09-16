// This is a React Router v6 app
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/common/AuthProvider";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import Login from "./components/common/Login";
import Home from "./components/common/Home";

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
