import { FormLabel } from "@mui/material";
import React from "react";
import Title from "./Title";
import styles from "./Profile.module.scss";

const Profile = ({ user }) => {
  return (
    <div className={styles.container}>
      <Title>Usuario</Title>
      <FormLabel>Rut: {user.rut}</FormLabel>
      <FormLabel>Nombre: {user.nombre}</FormLabel>
      <FormLabel>Apellido Paterno: {user.apellido_paterno}</FormLabel>
      <FormLabel>Apellido Materno: {user.apellido_materno}</FormLabel>
      <FormLabel>ID Rol: {user.rol_id}</FormLabel>
      <FormLabel>Nombre Rol: {user.nombre_rol}</FormLabel>
      <FormLabel>Email: {user.email}</FormLabel>
      <FormLabel>Teléfono: {user.telefono}</FormLabel>
    </div>
  );
};

export default Profile;
