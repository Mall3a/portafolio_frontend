import axios from "axios";

const API_URL =
  "https://g15f555dd431949-maipograndebdd.adb.sa-santiago-1.oraclecloudapps.com/ords/Portafolio/";

const positionstack_api_key = "3d2324097dc8df61bf00236057627481";

export const validateAddress = async (direccion) => {
  return await axios.get(
    "http://api.positionstack.com/v1/forward?access_key=" +
      positionstack_api_key +
      "&query=" +
      direccion
  );
};

export const getSolicitudesPedidos = async (rut) => {
  return await axios.post(API_URL + "sp_get_solicitud_pedido_usuario/", {
    in_rut: rut,
  });
};
