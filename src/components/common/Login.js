import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";
import Logo from "../../images/logos/logo.svg";
// This is a React Router v6 app
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { login } from "../../api/loginApi.js";
import {
  Alert,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import LoginIcon from "@mui/icons-material/Login";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  let [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    //Prevent page reload
    e.preventDefault();
    setLoading(true);
    setHasError(false);
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

            setHasError(true);
            setLoading(false);
          }
        } else {
          setErrorMessage("Usuario o contraseña incorrecta");
          setHasError(true);
          setLoading(false);
        }
      } else {
        setErrorMessage("Servicio no disponible");
        setHasError(true);
        setLoading(false);
      }
    } else {
      setHasError(true);
      setErrorMessage("Debe ingresar usuario y contraseña");
      setLoading(false);
    }
  };

  return (
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
        <FormControl variant="outlined" className={styles.passField}>
          <InputLabel htmlFor="outlined-adornment-password">
            Contraseña
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPass ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  style={{ marginRight: "-5px" }}
                  aria-label="toggle password visibility"
                  onClick={() => setShowPass(!showPass)}
                  edge="end"
                >
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Contraseña"
          />
        </FormControl>

        {loading ? (
          <LoadingButton
            color="secondary"
            loading={loading}
            loadingPosition="start"
            variant="contained"
            startIcon={<LoginIcon />}
            className={styles.loginButton}
          >
            Inciar Sesión
          </LoadingButton>
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.loginButton}
            disabled={!pass || !user}
          >
            Inciar Sesión
          </Button>
        )}
        {errorMessage && (
          <Alert severity="error" onClose={() => setErrorMessage("")}>
            {errorMessage}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default Login;
