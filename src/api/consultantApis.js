import axios from "axios";

const API_URL =
  "https://g15f555dd431949-maipograndebdd.adb.sa-santiago-1.oraclecloudapps.com/ords/Portafolio/";

export const getAllPedidos = async () => {
  return await axios.post(API_URL + "sp_get_all_pedidos/", {});
};

export const getAllSoldProducts = async () => {
  return await axios.post(
    API_URL + "sp_get_all_producto_productor_vendido/",
    {}
  );
};
