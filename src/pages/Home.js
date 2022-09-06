import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    setAuth(null);
    navigate("/login");
    localStorage.clear();
  };

  return (
    <>
      <h2>Home</h2>

      {auth && <div>Autenticado como {auth.token.nombre}</div>}

      {auth && (
        <Button variant="contained" color="primary" onClick={handleLogOut}>
          Cerrar Sesión
        </Button>
      )}
    </>
  );
};

export default Home;
