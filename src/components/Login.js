import React, { useState } from "react";
import { login } from "../api/LoginApi";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";
import Logo from "../images/logo.svg";

const Login = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className={styles.errorMessage}>{errorMessages.message}</div>
    );

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

  const errors = {
    user: "Usuario Incorrecto",
    pass: "Contraseña Incorrecta",
  };

  const handleSubmit = (e) => {
    //Prevent page reload
    e.preventDefault();
    setErrorMessages({});
    setIsSubmitted(false);

    // Find user login info
    const userData = database.find((u) => u.username === user);

    // Compare user info
    if (userData) {
      if (userData.password !== pass) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        setIsSubmitted(true);
      }
    } else {
      // Username not found
      setErrorMessages({ name: "user", message: errors.user });
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
        {renderErrorMessage("user")}
        <TextField
          className={styles.passField}
          id="pass"
          label="Contraseña"
          variant="outlined"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        {renderErrorMessage("pass")}
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
