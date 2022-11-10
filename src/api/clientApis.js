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

export const getToken = async () => {
  return await axios.get(
    "https://www.universal-tutorial.com/api/getaccesstoken",
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-token":
          "u7NjDdiDzxbqKn_1WnjnJr14GLTF0ScvqVtQxKVXmf8e9pWqIWFJ2pqnwgdMTibD70Q",
        "user-email": "con.mallea@duocuc.cl",
      },
    }
  );
};

export const getCountries = async (token) => {
  return await axios.get("https://www.universal-tutorial.com/api/countries/", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const getCountriesStates = async (token, pais) => {
  return await axios.get(
    `https://www.universal-tutorial.com/api/states/${pais}`,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
};
export const getStatesCities = async (token, estado) => {
  return await axios.get(
    `https://www.universal-tutorial.com/api/cities/${estado}`,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
};
export const getSolicitudesPedidos = async (rut) => {
  return await axios.post(API_URL + "sp_get_solicitud_pedido_usuario/", {
    in_rut: rut,
  });
};

export const insertSolicitudPedido = async (rut, direccion, detalle) => {
  const object = {
    solicitud: {
      usuario_id: rut,
      direccion: direccion,
      detalle_productos: detalle,
    },
  };

  return await axios.post(API_URL + "sp_insert_solicitud_y_detalle/", {
    in_objeto_json: JSON.stringify(object),
  });
};

export const getDetalleSolicitudPedido = async (id) => {
  return await axios.post(API_URL + "sp_get_detalle_solicitud_pedido/", {
    in_id_solicitud_pedido: id,
  });
};
