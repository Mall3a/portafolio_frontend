import { Avatar, FormLabel } from "@mui/material";
import React from "react";
import styles from "./Profile.module.scss";

const Profile = ({ user }) => {
  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        <Avatar
          src={user.foto_perfil}
          sx={{ width: 250, height: 250 }}
        ></Avatar>
      </div>
      <div className={styles.infoContainer}>
        <FormLabel>
          Nombre: {user.nombre} {user.apellido_paterno} {user.apellido_materno}
        </FormLabel>
        <FormLabel>Rut: {user.rut}</FormLabel>

        <FormLabel>ID Rol: {user.rol_id}</FormLabel>
        <FormLabel>Nombre Rol: {user.nombre_rol}</FormLabel>
        <FormLabel>Email: {user.email}</FormLabel>
        <FormLabel>Teléfono: {user.telefono}</FormLabel>
      </div>
    </div>
  );
};

export default Profile;
