import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import styles from "./Orders.module.scss";
import Title from "../common/Title";
import {
  getDetallesPedidoUsuario,
  getPedidosUsuario,
  updateEstadoPedido,
} from "../../api/clientApis";
import moment from "moment";
import { Close, Edit, Save, Search } from "@mui/icons-material";
import Quality from "../common/Quality";
import { LoadingButton } from "@mui/lab";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

const styleEditStatusModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

const Orders = ({ user }) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);

  const [productosSolicitud, setProductosSolicitud] = useState([]);
  const [loadingProductosSolicitud, setLoadingProductosSolicitud] =
    useState(false);
  const [hasErrorProductosSolicitud, setHasErrorProductosSolicitud] =
    useState(false);
  const [errorMessageProductosSolicitud, setErrorMessageProductosSolicitud] =
    useState("");

  const [toggleProductDetailModal, setToggleProductDetailModal] =
    useState(false);

  const [estadosPedido, setEstadosPedido] = useState([
    {
      id: 6,
      label: "Recibido",
    },
    {
      id: 8,
      label: "Cancelado",
    },
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusId, setOrderStatusId] = useState(6);
  const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false);
  const [hasErrorUpdateStatus, setHasErrorUpdateStatus] = useState(false);
  const [errorMessageUpdateStatus, setErrorMessageUpdateStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [toggleUpdateOrderStatusModal, setToggleUpdateOrderStatusModal] =
    useState(false);

  const [rejectedReason, setRejectedReason] = useState("");

  useEffect(() => {
    getClientOrders();
  }, []);

  const getClientOrders = async () => {
    setLoading(true);
    setHasError(false);

    const response = await getPedidosUsuario(user.rut);
    const data = response.data;

    if (response.status === 200) {
      setSolicitudes(data.pedido_usuario);
      setHasError(false);
      setLoading(false);
    } else {
      setHasError(true);
      setLoading(false);
    }
  };

  const getOrderDetail = async (row) => {
    setLoadingProductosSolicitud(true);
    setHasErrorProductosSolicitud(false);
    setErrorMessageProductosSolicitud("");

    const response = await getDetallesPedidoUsuario(row.pedido_id);
    const data = response.data;
    if (response.status === 200) {
      setProductosSolicitud(data.detalles_pedido);
      setLoadingProductosSolicitud(false);
    } else {
      setHasErrorProductosSolicitud(true);
      setErrorMessageProductosSolicitud(
        "Error al obtener productos del sistema"
      );
      setLoadingProductosSolicitud(false);
    }
  };

  const updateOrderStatus = async (e) => {
    //Prevent page reload
    e.preventDefault();
    setLoadingUpdateStatus(true);
    setHasErrorUpdateStatus(false);
    setErrorMessageUpdateStatus("");
    setSuccessMessage("");
    const response = await updateEstadoPedido(selectedOrder, orderStatusId);
    const data = response.data;

    if (response.status === 200) {
      setLoadingUpdateStatus(false);
      setHasErrorUpdateStatus(false);
      setErrorMessageUpdateStatus("");
      setSuccessMessage("Estado modificado exitosamente");
    } else {
      setLoadingUpdateStatus(false);
      setHasErrorUpdateStatus(true);
      setErrorMessageUpdateStatus("Error al editar el estado del pedido");
    }
  };

  const handleUpdateOrderStatus = (row) => {
    setSelectedOrder(row.pedido_id);
    setToggleUpdateOrderStatusModal(true);
  };

  const handleCloseUpdateOrderStatusModal = () => {
    setToggleUpdateOrderStatusModal(false);
    setHasErrorUpdateStatus(false);
    setErrorMessageUpdateStatus("");
    setSelectedOrder(null);
    setSuccessMessage("");
    getClientOrders();
  };

  const handleChange = (e) => {
    e.preventDefault();
    setOrderStatusId(e.target.value);
  };

  const handleViewDetail = (row) => {
    if (row.estado === "Rechazada") {
      setRejectedReason(row.nota);
    }
    setToggleProductDetailModal(true);
    getOrderDetail(row);
  };

  const handleCloseModal = () => {
    setRejectedReason("");
    setLoadingProductosSolicitud(true);
    setHasErrorProductosSolicitud(false);
    setErrorMessageProductosSolicitud("");
    setToggleProductDetailModal(false);
  };

  const format = (numStr) => {
    if (numStr === "") return "";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(numStr);
  };

  return (
    <>
      {loading ? (
        <Box className={styles.loadingContainer}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid item xs={12}>
            {solicitudes.length > 0 ? (
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <React.Fragment>
                  <Title>Historial Pedidos</Title>
                  <Table size="large">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">ID Solicitud</TableCell>
                        <TableCell align="center">Fecha Solicitud</TableCell>
                        <TableCell align="center">ID Pedido</TableCell>
                        <TableCell align="center">Fecha Pedido</TableCell>
                        <TableCell align="center">Dirección Destino</TableCell>
                        <TableCell align="center">Estado Pedido</TableCell>
                        <TableCell align="center">
                          Transportista Asignado
                        </TableCell>
                        <TableCell align="center">Valor Total Pedido</TableCell>
                        <TableCell align="center">Detalle Pedido</TableCell>
                        <TableCell align="center">Editar Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {solicitudes.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell align="center">
                            {row.solicitud_id}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {moment(row.fecha_solicitud).format("MM/DD/YYYY")}
                          </TableCell>
                          <TableCell align="center">{row.pedido_id}</TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {moment(row.fecha_pedido).format("MM/DD/YYYY")}
                          </TableCell>
                          <TableCell align="center">{row.direccion}</TableCell>
                          <TableCell align="center">
                            {row.estado_pedido_id === 1 && (
                              <Chip label={row.estado_pedido} color="default" />
                            )}
                            {row.estado_pedido_id === 2 && (
                              <Chip label={row.estado_pedido} color="primary" />
                            )}
                            {row.estado_pedido_id === 3 && (
                              <Chip label={row.estado_pedido} color="warning" />
                            )}
                            {row.estado_pedido_id === 4 && (
                              <Chip label={row.estado_pedido} color="warning" />
                            )}
                            {row.estado_pedido_id === 5 && (
                              <Chip label={row.estado_pedido} color="warning" />
                            )}
                            {row.estado_pedido_id === 6 && (
                              <Chip label={row.estado_pedido} color="info" />
                            )}
                            {row.estado_pedido_id === 7 && (
                              <Chip label={row.estado_pedido} color="success" />
                            )}
                            {row.estado_pedido_id === 8 && (
                              <Chip label={row.estado_pedido} color="error" />
                            )}
                          </TableCell>

                          <TableCell align="center">
                            {row.oferta_subasta_id === null &&
                              "Asignación Pendiente"}
                          </TableCell>
                          <TableCell align="right">
                            {format(row.total)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              edge="start"
                              color="inherit"
                              onClick={() => handleViewDetail(row)}
                              style={{ alignSelf: "end", color: "#1976d2" }}
                            >
                              <Search />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              edge="start"
                              color="inherit"
                              onClick={() => handleUpdateOrderStatus(row)}
                              style={{ alignSelf: "end", color: "#1976d2" }}
                            >
                              <Edit />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </React.Fragment>
              </Paper>
            ) : hasError ? (
              <Alert severity="error">
                Ha ocurrido un error al intentar obtener la lista de pedidos
              </Alert>
            ) : (
              <Alert severity="info">
                Usted no tiene pedidos aprobados en sistema
              </Alert>
            )}
          </Grid>
          {toggleProductDetailModal && (
            <Modal open={toggleProductDetailModal} disableEscapeKeyDown>
              <Box sx={style}>
                <div className={styles.modalTitleContainer}>
                  <Title>Detalle de productos del Pedido</Title>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleCloseModal}
                    style={{ alignSelf: "end" }}
                  >
                    <Close />
                  </IconButton>
                </div>

                {loadingProductosSolicitud ? (
                  <Box className={styles.loadingProductosSolicitudContainer}>
                    <CircularProgress />
                  </Box>
                ) : productosSolicitud.length > 0 ? (
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <React.Fragment>
                      <Table size="large">
                        <TableHead>
                          <TableRow>
                            <TableCell align="right">Productor</TableCell>
                            <TableCell align="right">Imagen</TableCell>
                            <TableCell align="right">Nombre</TableCell>
                            <TableCell align="center">Calidad</TableCell>
                            <TableCell align="right">
                              Cantidad&nbsp;(kg)
                            </TableCell>
                            <TableCell align="center">Precio</TableCell>
                            <TableCell align="center">Total</TableCell>
                            <TableCell align="center">% Comisión</TableCell>
                            <TableCell align="center">Comisión</TableCell>
                            <TableCell align="center">
                              Total con Comisión
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productosSolicitud.map((row, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                              >
                                {row.productor_rut}
                              </TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                align="right"
                              >
                                <img
                                  src={row.imagen}
                                  style={{ width: 50, height: 50 }}
                                  alt="fruit"
                                />
                              </TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                align="right"
                              >
                                {row.nombre_producto}
                              </TableCell>
                              <TableCell align="right">
                                <Quality value={row.calidad} readOnly />
                              </TableCell>
                              <TableCell align="right">
                                {row.cantidad} kg
                              </TableCell>
                              <TableCell align="right">
                                {format(row.precio)}
                              </TableCell>
                              <TableCell align="right">
                                {format(row.total_sin_ganancia)}
                              </TableCell>
                              <TableCell align="right">
                                {Number(row.porcentaje_ganancia).toLocaleString(
                                  undefined,
                                  {
                                    style: "percent",
                                    minimumFractionDigits: 0,
                                  }
                                )}
                              </TableCell>
                              <TableCell align="right">
                                {format(row.ganancia)}
                              </TableCell>
                              <TableCell align="right">
                                {format(row.total)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </React.Fragment>
                  </Paper>
                ) : hasErrorProductosSolicitud ? (
                  <Alert severity="error">
                    {errorMessageProductosSolicitud}
                  </Alert>
                ) : (
                  <Alert severity="info">Pedido sin productos</Alert>
                )}
                {rejectedReason && (
                  <Alert severity="error" style={{ marginTop: 10 }}>
                    {rejectedReason}
                  </Alert>
                )}
              </Box>
            </Modal>
          )}
          {toggleUpdateOrderStatusModal && (
            <Modal open={toggleUpdateOrderStatusModal} disableEscapeKeyDown>
              <Box sx={styleEditStatusModal}>
                <div className={styles.modalTitleContainer}>
                  <Title>Editar Estado del Pedido</Title>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleCloseUpdateOrderStatusModal}
                    style={{ alignSelf: "end" }}
                  >
                    <Close />
                  </IconButton>
                </div>

                <form onSubmit={updateOrderStatus}>
                  <FormControl fullWidth>
                    <InputLabel>Estados</InputLabel>
                    <Select
                      value={orderStatusId}
                      label="Productos"
                      onChange={handleChange}
                      style={{ width: 200 }}
                    >
                      {estadosPedido.map((estado, index) => {
                        return (
                          <MenuItem key={index} value={estado.id}>
                            {estado.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <div className={styles.messagesContainer}>
                    {hasErrorUpdateStatus && errorMessageUpdateStatus && (
                      <Alert
                        severity="error"
                        onClose={() => setErrorMessageUpdateStatus("")}
                      >
                        {errorMessageUpdateStatus}
                      </Alert>
                    )}
                    {successMessage && (
                      <Alert
                        severity="success"
                        onClose={() => setSuccessMessage("")}
                      >
                        {successMessage}
                      </Alert>
                    )}
                  </div>
                  <div className={styles.buttonsContainer}>
                    {loadingUpdateStatus ? (
                      <LoadingButton
                        color="secondary"
                        loading={loadingUpdateStatus}
                        loadingPosition="start"
                        variant="contained"
                        startIcon={<Save />}
                      >
                        Agregar
                      </LoadingButton>
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={styles.addProductButton}
                        disabled={!orderStatusId}
                      >
                        Editar estado
                      </Button>
                    )}
                  </div>
                </form>
              </Box>
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default Orders;
