import axios from "axios";

const API_URL =
  "https://g15f555dd431949-maipograndebdd.adb.sa-santiago-1.oraclecloudapps.com/ords/Portafolio/";

export const getProductos = async () => {
  return await axios.post(API_URL + "sp_get_all_productos/", );
};

export const getProductosProductor = async (id) => {
  return await axios.post(API_URL + "sp_get_productos_productor/", {
    in_id_productor: id,
  });
};

export const addProductoProductor = async (
  idProducto,
  precio,
  calidad,
  cantidad,
  rut
) => {
  return await axios.post(API_URL + "sp_insert_producto_productor/", {
    in_id_producto: idProducto,
    in_precio: precio,
    in_calidad: calidad,
    in_cantidad: cantidad,
    productor_rut: rut,
  });
};

export const updateProductoProductor = async (
  idProductoProductor,
  precio,
  calidad,
  cantidad
) => {
  return await axios.post(API_URL + "sp_update_producto_productor/", {
  in_id_pp: idProductoProductor,
  in_precio: precio,
  in_calidad: calidad,
  in_cantidad: cantidad
  });
};

export const deleteProductoProductor = async (
  idProductoProductor
) => {
  return await axios.post(API_URL + "sp_delete_producto_productor/", {
  in_id_pp: idProductoProductor
  });
};




