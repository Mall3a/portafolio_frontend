import axios from "axios";

const API_URL =
  "https://g15f555dd431949-maipograndebdd.adb.sa-santiago-1.oraclecloudapps.com/ords/dev/";

export const login = async (user, password) => {
  return await axios.post(API_URL + "sp_login/", {
    p_rut: user,
    p_pass: password,
  });
};

export const getProductosProductor = async (id) => {
  return await axios.post(API_URL + "sp_get_productos_productor/", {
    in_id_productor: id,
  });
};

export const addProductosProductor = async (
  id,
  idProducto,
  precio,
  calidad,
  cantidad,
  rut
) => {
  return await axios.post(API_URL + "sp_insert_producto_productor/", {
    in_id: id,
    in_id_producto: idProducto,
    in_precio: precio,
    in_calidad: calidad,
    in_cantidad: cantidad,
    productor_rut: rut,
  });
};
