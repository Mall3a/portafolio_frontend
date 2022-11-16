import axios from "axios";

const API_URL =
  "https://g15f555dd431949-maipograndebdd.adb.sa-santiago-1.oraclecloudapps.com/ords/Portafolio/";

export const login = async (user, password) => {
  return await axios.post(API_URL + "sp_login/", {
    p_rut: user,
    p_pass: password,
  });
};

export const getContratoUsuario = async (rut) => {
  return await axios.post(API_URL + "sp_get_contrato_usuario/", {
    in_rut: rut,
  });
};
