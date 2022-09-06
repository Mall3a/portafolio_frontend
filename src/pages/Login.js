import React, { useState } from "react";
import { login } from "../api/LoginApi";
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

  const handleSubmit = async (e) => {
    //Prevent page reload
    e.preventDefault();
    setLoading(true);
    setIsError(false);

    const response = await login(user, pass);
    const data = response.data;

    if (response.status === 200) {
      if (data.usuario.length > 0) {
        const token = data.usuario;
        setAuth(token);
        if (auth) navigate("/home");
      } else {
        setIsError(true);
      }
      setLoading(false);
    } else {
      setIsError(true);
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
        {isError && (
          <div className={styles.errorMessage}>
            Usuario o Contraseña Incorrecta
          </div>
        )}
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
