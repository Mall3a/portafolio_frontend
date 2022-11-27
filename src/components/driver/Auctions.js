import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../common/Title";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import styles from "./Auctions.module.scss";
import { Alert, Button, Chip, Modal, TextField } from "@mui/material";
import { IconButton } from "@mui/material";
import {
  DeleteForever,
  Edit,
  CheckSharp,
  CloseSharp,
  Search,
  Close,
  AttachMoney,
  Save,
} from "@mui/icons-material";
import { getAllSubastas, insertOfertaSubasta } from "../../api/driverApis";
import moment from "moment";
import { getDetallesPedidoUsuario } from "../../api/clientApis";
import Quality from "../common/Quality";
import { NumberFormatBase } from "react-number-format";
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

const styleMakeOfferModal = {
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
const format = (numStr) => {
  if (numStr === "") return "";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(numStr);
};

const Auctions = ({ user }) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [auctions, setAuctions] = useState([{}]);

  let [selectedAuction, setSelectedAuction] = useState();
  const [productosSolicitud, setProductosSolicitud] = useState([]);
  const [loadingProductosSolicitud, setLoadingProductosSolicitud] =
    useState(false);
  const [hasErrorProductosSolicitud, setHasErrorProductosSolicitud] =
    useState(false);
  const [errorMessageProductosSolicitud, setErrorMessageProductosSolicitud] =
    useState("");

  const [toggleProductDetailModal, setToggleProductDetailModal] =
    useState(false);

  const [toggleMakeOfferModal, setToggleMakeOfferModal] = useState(false);
  const [loadingMakeOffer, setLoadingMakeOffer] = useState(false);

  let [precio, setPrecio] = useState({
    value: selectedAuction ? selectedAuction.precio_piso : 0,
    formattedValue: selectedAuction
      ? format(selectedAuction.precio_piso)
      : format(0),
    floatValue: null,
  });

  const [makeOfferHasError, setMakeOfferHasError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getAuctions();
  }, []);

  const getAuctions = async () => {
    setLoading(true);
    setHasError(false);
    const response = await getAllSubastas();
    const data = response.data;
    if (response.status === 200) {
      setAuctions(data.subastas);
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

  const handleViewDetail = (row) => {
    setToggleProductDetailModal(true);
    getOrderDetail(row);
  };
  const handleMakeOffer = (row) => {
    setToggleMakeOfferModal(true);
    setSelectedAuction(row);
  };

  const handleCloseModal = () => {
    setLoadingProductosSolicitud(true);
    setHasErrorProductosSolicitud(false);
    setErrorMessageProductosSolicitud("");
    setToggleProductDetailModal(false);
  };

  const handleCloseMakeOfferModal = () => {
    setToggleMakeOfferModal(false);
    setSelectedAuction(null);
    setPrecio({
      value: 0,
      formattedValue: format(0),
      floatValue: null,
    });
    setMakeOfferHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const makeOffer = async (e) => {
    e.preventDefault();
    setLoadingMakeOffer(true);
    setMakeOfferHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");

    if (precio) {
      if (precio.value < selectedAuction.precio_piso) {
        const response = await insertOfertaSubasta(
          user.rut,
          selectedAuction.id,
          precio.value
        );
        const data = response.data;
        if (response.status === 200) {
          if (
            data.out_mensaje_salida.includes(
              "OFERTA SUBASTA CREADA CORRECTAMENTE"
            )
          ) {
            setSuccess(true);
            setSuccessMessage("Oferta creada exitosamente");
          } else {
            setErrorMessage(
              "Ha ocurrido un error al realizar la oferta de subasta"
            );
            setMakeOfferHasError(true);
          }
          setLoadingMakeOffer(false);
        } else {
          setMakeOfferHasError(true);
          setLoadingMakeOffer(false);
          setErrorMessage("El servicio para editar transportes ha fallado");
        }
      } else {
        setMakeOfferHasError(true);
        setLoadingMakeOffer(false);
        setErrorMessage(
          "Precio debe ser menor al precio inicial de la subasta"
        );
      }
    } else {
      setMakeOfferHasError(true);
      setLoadingMakeOffer(false);
      setErrorMessage("Debe ingresar valor de oferta");
    }
  };

  return (
    <>
      {loading ? (
        <Box className={styles.loadingContainer}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {" "}
          <Grid item xs={12}>
            {auctions.length > 0 ? (
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <React.Fragment>
                  <Title>Subastas para transportar pedido</Title>
                  <Table size="large">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">ID Subasta</TableCell>
                        <TableCell align="center">Fecha Subasta</TableCell>
                        <TableCell align="center">Precio Inicial</TableCell>
                        <TableCell align="center">ID Oferta Ganadora</TableCell>
                        <TableCell align="center">ID Pedido</TableCell>
                        <TableCell align="center">Fecha Pedido</TableCell>
                        <TableCell align="center">Estado Pedido</TableCell>
                        <TableCell align="center">Total Pedido</TableCell>
                        <TableCell align="center">Detalle Pedido</TableCell>
                        <TableCell align="center">Acción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {auctions.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row" align="center">
                            {row.id}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {" "}
                            {moment(row.fecha).format("MM/DD/YYYY")}
                          </TableCell>
                          <TableCell align="right">
                            {format(row.precio_piso)}
                          </TableCell>
                          <TableCell align="center">
                            {row.oferta_subasta_id === null
                              ? "Asignación Pendiente"
                              : row.oferta_subasta_id}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {row.pedido_id}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {moment(row.fecha_pedido).format("MM/DD/YYYY")}
                          </TableCell>
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
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={() => handleMakeOffer(row)}
                              startIcon={<AttachMoney />}
                              disabled={row.oferta_subasta_id != null}
                            >
                              Hacer Oferta
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </React.Fragment>
              </Paper>
            ) : hasError ? (
              <Alert severity="error">
                Ha ocurrido un error al intentar obtener la lista de subastas
              </Alert>
            ) : (
              <Alert severity="info">No hay subastas en el sistema</Alert>
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
              </Box>
            </Modal>
          )}
          {toggleMakeOfferModal && (
            <Modal open={toggleMakeOfferModal} disableEscapeKeyDown>
              <Box sx={styleMakeOfferModal}>
                <div className={styles.modalTitleContainer}>
                  <Title>Hacer Oferta Subasta</Title>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleCloseMakeOfferModal}
                    style={{ alignSelf: "end" }}
                  >
                    <Close />
                  </IconButton>
                </div>
                <form onSubmit={makeOffer}>
                  <div className={styles.textFieldsContainer}>
                    <TextField
                      disabled={true}
                      label="ID Subasta"
                      value={selectedAuction.id}
                    ></TextField>
                    <TextField
                      disabled={true}
                      label="Fecha Subasta"
                      value={moment(selectedAuction.fecha).format("MM/DD/YYYY")}
                    ></TextField>
                    <NumberFormatBase
                      style={{ width: "200px" }}
                      format={format}
                      value={selectedAuction.precio_piso}
                      customInput={TextField}
                      prefix="$"
                      label="Precio Inicial"
                      disabled={true}
                    />
                    <NumberFormatBase
                      style={{ width: "200px" }}
                      format={format}
                      value={precio.formattedValue}
                      customInput={TextField}
                      prefix="$"
                      label="Valor Oferta"
                      onValueChange={(values) => {
                        setPrecio(values);
                      }}
                    />
                  </div>
                  {success && successMessage && (
                    <Alert
                      severity="success"
                      onClose={() => setSuccessMessage("")}
                    >
                      {successMessage}
                    </Alert>
                  )}
                  {makeOfferHasError && errorMessage && (
                    <Alert severity="error" onClose={() => setErrorMessage("")}>
                      {errorMessage}
                    </Alert>
                  )}
                  <div className={styles.buttonsContainer}>
                    {loadingMakeOffer ? (
                      <LoadingButton
                        color="secondary"
                        loading={loadingMakeOffer}
                        loadingPosition="start"
                        variant="contained"
                        startIcon={<Save />}
                      >
                        Hacer Oferta
                      </LoadingButton>
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={styles.updateButton}
                        disabled={!precio.value}
                      >
                        Hacer Oferta
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

export default Auctions;
