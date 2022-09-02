import React from "react";
import { login } from "../api/LoginApi";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import styles from "./Login.module.scss";

const Login = () => {
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleOnClick = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <form className={styles.loginForm} onSubmit={handleOnClick}>
        <TextField
          className={styles.userField}
          id="user"
          label="Usuario"
          variant="outlined"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <TextField
          className={styles.passwordField}
          id="password"
          label="Contraseña"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={styles.loginButton}
        >
          Inciar Sesión
        </Button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Login;
