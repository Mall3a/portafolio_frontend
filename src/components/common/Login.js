import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";
import Logo from "../../images/logos/logo.svg";
// This is a React Router v6 app
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getContratoUsuario, login } from "../../api/loginApi.js";
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
import moment from "moment";

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
          //Usuario es Administrador
          if (data.usuario[0].rol_id !== 1) {
            //Validar contrato vigente del usuario
            const responseContrato = await getContratoUsuario(user);
            const dataContrato = responseContrato.data;
            if (responseContrato.status === 200) {
              if (dataContrato.contrato && dataContrato.contrato.length > 0) {
                const contrato = dataContrato.contrato[0];
                //validar contrato vigente para productores
                if (data.usuario[0].rol_id === 4) {
                  if (moment().diff(contrato.fecha_fin, "days") < 0) {
                    const token = data.usuario[0];
                    setAuth({
                      token,
                    });
                    navigate("/home");
                    localStorage.setItem("token", JSON.stringify(token));
                    setHasError(false);
                    setLoading(false);
                  } else {
                    setHasError(true);
                    setLoading(false);
                    setErrorMessage(
                      "Su contrato no está vigente. Contáctese con el administrador para renovar su contrato"
                    );
                  }
                } else {
                  //no es necesario validar información de contrato ya que no es productor
                  const token = data.usuario[0];
                  setAuth({
                    token,
                  });
                  navigate("/home");
                  localStorage.setItem("token", JSON.stringify(token));
                  setHasError(false);
                  setLoading(false);
                }
              } else {
                setHasError(true);
                setLoading(false);
                setErrorMessage(
                  "No se ha encontrado información de contrato del usuario"
                );
              }
            } else {
              setHasError(true);
              setLoading(false);
              setErrorMessage(
                "El servicio para obtener información de contrato del usuario ha fallado"
              );
            }
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
        {hasError && errorMessage && (
          <Alert severity="error" onClose={() => setErrorMessage("")}>
            {errorMessage}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default Login;
