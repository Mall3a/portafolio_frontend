import React, { useState } from "react";
import { login } from "../api/Apis";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";
import Logo from "../images/logo.svg";
// This is a React Router v6 app
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    //Prevent page reload
    e.preventDefault();
    setLoading(true);
    setIsError(false);
    if (user && pass) {
      const response = await login(user, pass);
      const data = response.data;

      if (response.status === 200) {
        if (data.usuario.length === 1) {
          //Usuario no es Administrador
          if (data.usuario[0].rol_id !== 1) {
            const token = data.usuario[0];
            setAuth({
              token,
            });
            navigate("/home");
            localStorage.setItem("token", JSON.stringify(token));
          } else {
            setErrorMessage(
              "Usuario administrador debe ingresar por la aplicación de escritorio"
            );

            setIsError(true);
            setLoading(false);
          }
        } else {
          setErrorMessage("Usario o contraseña incorrecta");
          setIsError(true);
          setLoading(false);
        }
      } else {
        setErrorMessage("Servicio no disponible");
        setIsError(true);
        setLoading(false);
      }
    } else {
      setIsError(true);
      setErrorMessage("Debe ingresar usuario y contraseña");
      setLoading(false);
    }
  };

  return loading ? (
    <Box className={styles.loadingContainer}>
      <CircularProgress />
    </Box>
  ) : (
    <div className={styles.container}>
      <img src={Logo} alt="Maipo Grande Logo" />
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <TextField
          className={styles.userField}
          id="user"
          label="Usuario"
          variant="outlined"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <TextField
          className={styles.passField}
          type="password"
          id="pass"
          label="Contraseña"
          variant="outlined"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        {isError && <div className={styles.errorMessage}>{errorMessage}</div>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={styles.loginButton}
        >
          Inciar Sesión
        </Button>
      </form>
    </div>
  );
};

export default Login;
