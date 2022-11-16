import { Avatar, Chip, CircularProgress, FormLabel } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getContratoUsuario } from "../../api/loginApi";
import styles from "./Profile.module.scss";

const Profile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [contrato, setContrato] = useState([]);

  const getUserContract = async () => {
    setLoading(true);
    setHasError(false);

    const response = await getContratoUsuario(user.rut);
    const data = response.data;
    if (response.status === 200) {
      if (data.contrato.length > 0) {
        setContrato(data.contrato[0]);
        setHasError(false);
        setLoading(false);
      } else {
        setHasError(true);
        setLoading(false);
        setErrorMsg("No se ha encontrado información de contrato");
      }
    } else {
      setHasError(true);
      setLoading(false);
      setErrorMsg(
        "El servicio para obtener información de contrato ha fallado"
      );
    }
  };

  useEffect(() => {
    getUserContract();
  }, []);

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

        {user.rol_id === 4 &&
          (loading ? (
            <>
              <CircularProgress />
            </>
          ) : hasError ? (
            <label style={{ color: "red" }}>{errorMsg}</label>
          ) : (
            <>
              <FormLabel>
                Fecha Inicio Contrato:
                {moment(contrato.fecha_inicio).format("MM/DD/YYYY")}
              </FormLabel>
              <FormLabel>
                Fecha Fin Contrato:
                {moment(contrato.fecha_fin).format("MM/DD/YYYY")}
              </FormLabel>

              {moment().diff(contrato.fecha_fin, "days") < 0 ? (
                <Chip color="success" label="Contrato vigente"></Chip>
              ) : (
                <Chip color="error" label="Contrato no vigente"></Chip>
              )}
            </>
          ))}
      </div>
    </div>
  );
};

export default Profile;
