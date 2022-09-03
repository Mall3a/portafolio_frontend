import React, { useState } from "react";
//import { login } from "../api/LoginApi";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";
import Logo from "../images/logo.svg";

const Login = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // User Login info
  const database = [
    {
      username: "user1",
      password: "pass1",
    },
    {
      username: "user2",
      password: "pass2",
    },
  ];

  const handleSubmit = (e) => {
    //Prevent page reload
    e.preventDefault();
    //Clean states
    setIsSubmitted(false);
    setErrorMessage(false);

    // Find user login info
    const userData = database.find((u) => u.username === user);

    // Compare user info
    if (userData) {
      if (userData.password !== pass) {
        // Invalid password
        setErrorMessage(true);
      } else {
        setIsSubmitted(true);
      }
    } else {
      // Username not found
      setErrorMessage(true);
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
        <TextField
          className={styles.passField}
          type="password"
          id="pass"
          label="Contraseña"
          variant="outlined"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        {errorMessage && (
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
      {isSubmitted && <div>Usuario logeado exitosamente</div>}
    </div>
  );
};

export default Login;
