import React, { useEffect, useState } from "react";
import OrderRequestForm from "./OrderRequestForm";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import styles from "./OrderRequests.module.scss";
import Title from "../common/Title";
import {
  getDetalleSolicitudPedido,
  getSolicitudesPedidos,
} from "../../api/clientApis";
import moment from "moment";
import { Close, Search } from "@mui/icons-material";
import Quality from "../common/Quality";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

const OrderRequests = ({ user }) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [showOrderRequestForm, setShowOrderRequestForm] = useState(false);

  const [productosSolicitud, setProductosSolicitud] = useState([]);
  const [loadingProductosSolicitud, setLoadingProductosSolicitud] =
    useState(false);
  const [hasErrorProductosSolicitud, setHasErrorProductosSolicitud] =
    useState(false);
  const [errorMessageProductosSolicitud, setErrorMessageProductosSolicitud] =
    useState("");

  const [toggleProductDetailModal, setToggleProductDetailModal] =
    useState(false);

  const [rejectedReason, setRejectedReason] = useState("false");

  const handleCrearSolicitud = () => {
    setShowOrderRequestForm(true);
  };

  useEffect(() => {
    getClientOrderRequests();
  }, []);

  const getClientOrderRequests = async () => {
    setLoading(true);
    setHasError(false);

    const response = await getSolicitudesPedidos(user.rut);
    const data = response.data;

    if (response.status === 200) {
      setSolicitudes(data.solicitud_pedido_usuario);
      setHasError(false);
      setLoading(false);
    } else {
      setHasError(true);
      setLoading(false);
    }
  };

  const getOrderRequestDetail = async (row) => {
    setLoadingProductosSolicitud(true);
    setHasErrorProductosSolicitud(false);
    setErrorMessageProductosSolicitud("");

    const response = await getDetalleSolicitudPedido(row.id);
    const data = response.data;
    if (response.status === 200) {
      setProductosSolicitud(data.detalles_solicitud_pedido);
      setLoadingProductosSolicitud(false);
    } else {
      setHasErrorProductosSolicitud(true);
      setErrorMessageProductosSolicitud(
        "Error al obtener productos del sistema"
      );
      setLoadingProductosSolicitud(false);
    }
  };

  const handleViewDetail = (row) => {
    if (row.estado === "Rechazada") {
      setRejectedReason(row.nota);
    }
    setToggleProductDetailModal(true);
    getOrderRequestDetail(row);
  };

  const handleCloseModal = () => {
    setRejectedReason("");
    setLoadingProductosSolicitud(true);
    setHasErrorProductosSolicitud(false);
    setErrorMessageProductosSolicitud("");
    setToggleProductDetailModal(false);
  };

  return (
    <>
      {showOrderRequestForm ? (
        <OrderRequestForm
          user={user}
          setShowOrderRequestForm={(e, button) => {
            setShowOrderRequestForm(e);
            if (button === "create") {
              getClientOrderRequests();
            }
          }}
          showOrderRequestForm={showOrderRequestForm}
        />
      ) : (
        <>
          {loading ? (
            <Box className={styles.loadingContainer}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid item xs={12}>
                <div className={styles.buttonContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCrearSolicitud}
                  >
                    Crear Solicitud
                  </Button>
                </div>
                {solicitudes.length > 0 ? (
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <React.Fragment>
                      <Title>Historial Solicitudes</Title>
                      <Table size="large">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Fecha</TableCell>
                            <TableCell align="center">Dirección</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center">Detalle</TableCell>
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
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                              >
                                {moment(row.fecha).format("MM/DD/YYYY")}
                              </TableCell>
                              <TableCell align="center">
                                {row.direccion}
                              </TableCell>
                              <TableCell align="center">
                                {row.estado === "Recibida" && (
                                  <Chip label={row.estado} color="primary" />
                                )}
                                {row.estado === "En curso" && (
                                  <Chip label={row.estado} color="warning" />
                                )}
                                {row.estado === "Rechazada" && (
                                  <Chip label={row.estado} color="error" />
                                )}
                                {row.estado === "Aprobada" && (
                                  <Chip label={row.estado} color="success" />
                                )}
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
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </React.Fragment>
                  </Paper>
                ) : hasError ? (
                  <Alert severity="error">
                    Ha ocurrido un error al intentar obtener la lista de
                    solicitudes
                  </Alert>
                ) : (
                  <Alert severity="info">
                    Cree una solicitud para visualizarla en ésta área
                  </Alert>
                )}
              </Grid>
              {toggleProductDetailModal && (
                <Modal open={toggleProductDetailModal} disableEscapeKeyDown>
                  <Box sx={style}>
                    <div className={styles.modalTitleContainer}>
                      <Title>Detalle de productos de la solicitud</Title>
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
                      <Box
                        className={styles.loadingProductosSolicitudContainer}
                      >
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
                                <TableCell align="right">Imagen</TableCell>
                                <TableCell align="right">Nombre</TableCell>
                                <TableCell align="center">Calidad</TableCell>
                                <TableCell align="right">
                                  Cantidad&nbsp;(kg)
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
                      <Alert severity="info">Solicitud sin productos</Alert>
                    )}
                    {rejectedReason && (
                      <Alert severity="error" style={{ marginTop: 10 }}>
                        {rejectedReason}
                      </Alert>
                    )}
                  </Box>
                </Modal>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default OrderRequests;
