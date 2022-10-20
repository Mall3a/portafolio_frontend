import axios from "axios";

const API_URL =
  "https://g15f555dd431949-maipograndebdd.adb.sa-santiago-1.oraclecloudapps.com/ords/Portafolio/";

export const getTransportes = async () => {
  return await axios.get(API_URL + "transporte/");
};

export const getTransportesTransportista = async (id) => {
  return await axios.post(API_URL + "sp_get_transportes_transportista/", {
    in_id_transportista: id,
  });
};

export const addTransporteTransportista = async (
  rut,
  patente,
  capacidad,
  refrigeracion,
  tipoTransporteId
) => {
  return await axios.post(API_URL + "sp_insert_transporte/", {
    in_usuario_id: rut,
    in_patente: patente,
    in_capacidad: capacidad,
    in_refrigeracion: refrigeracion,
    in_tipo_transporte_id: tipoTransporteId,
  });
};

export const updateTransporteTransportista = async (
  idTransporte,
  patente,
  capacidad,
  refrigeracion
) => {
  return await axios.post(API_URL + "sp_update_transporte/", {
    in_id: idTransporte,
    in_patente: patente,
    in_capacidad: capacidad,
    in_refrigeracion: refrigeracion,
    //in_tipo_transporte_id: tipoTransporteId,
  });
};

export const deleteTransporteTransportista = async (idTransporte) => {
  return await axios.post(API_URL + "sp_delete_transporte/", {
    in_id: idTransporte,
  });
};

export const getTipoTransportes = async () => {
  return await axios.post(API_URL + "sp_get_all_tipo_transportes/");
};
