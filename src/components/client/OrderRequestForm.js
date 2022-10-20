import { Button, Card, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import styles from "./OrderRequestForm.module.scss";
import moment from "moment";
import Title from "../common/Title";

const OrderRequestForm = ({ user }) => {
  const { nombre, apellido_paterno, apellido_materno, rut } = user;
  const fechaActual = moment(new Date()).format("MM/DD/YYYY");
  const apellidos = apellido_paterno + " " + apellido_materno;

  const [direccion, setDireccion] = useState("");

  const handleAddProduct = (product) => {};
  return (
    <Card className={styles.container} sx={{ minWidth: 275 }}>
      <Title>Nueva Solicitud Pedido</Title>
      <form>
        <div className={styles.formContainer}>
          <TextField
            disabled={true}
            id="nombre"
            variant="outlined"
            value={nombre}
          ></TextField>
          <TextField
            disabled={true}
            id="apellidos"
            variant="outlined"
            value={apellidos}
          ></TextField>
          <TextField
            disabled={true}
            id="rut"
            variant="outlined"
            value={rut}
          ></TextField>
          <TextField
            disabled={true}
            id="fecha"
            variant="outlined"
            value={fechaActual}
          ></TextField>
          <TextField
            style={{ width: 500 }}
            id="direccion"
            label="Direccion"
            variant="outlined"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          ></TextField>
        </div>
        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Agregar Producto
        </Button>
      </form>
    </Card>
  );
};

export default OrderRequestForm;
