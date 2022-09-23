import axios from "axios";

const API_URL =
  "https://g15f555dd431949-maipograndebdd.adb.sa-santiago-1.oraclecloudapps.com/ords/Portafolio/";

export const getTransportes = async () => {
  return await axios.get(API_URL + "transporte/");
};

export const getTransportesTransportista = async (id) => {
  return await axios.get(API_URL + "transporte/" + id);
};
