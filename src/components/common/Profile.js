import { Avatar, FormLabel } from "@mui/material";
import React from "react";
import Title from "./Title";
import styles from "./Profile.module.scss";
import ProducerImg from "../../images/producer2.png";
import DriverImg from "../../images/driver3.jpg";
import ConsultantImg from "../../images/consultant.png";

const Profile = ({ user }) => {
  const setProfileImg = () => {
    let src = null;
    if (user.nombre_rol === "Productor") {
      src = ProducerImg;
    }
    if (user.nombre_rol === "Transportista") {
      src = DriverImg;
    }
    if (user.nombre_rol === "Consultor") {
      src = ConsultantImg;
    }
    return src;
  };
  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        <Avatar src={setProfileImg()} sx={{ width: 250, height: 250 }}></Avatar>
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
