import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import React, { useEffect, useState } from "react";
import styles from "./OrderRequestForm.module.scss";
import moment from "moment";
import Title from "../common/Title";

import Quality from "../common/Quality";
import { Close, DeleteForever, Edit } from "@mui/icons-material";
import { getProductos } from "../../api/producerApis";
import {
  getCountries,
  getCountriesStates,
  getStatesCities,
  getToken,
  insertSolicitudPedido,
  validateAddress,
} from "../../api/clientApis";
import { color } from "@mui/system";
import { countries } from "../../api/MockData";
import { LoadingButton } from "@mui/lab";

const style = {
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
const OrderRequestForm = ({
  user,
  setShowOrderRequestForm,
  showOrderRequestForm,
}) => {
  const { nombre, apellido_paterno, apellido_materno, rut } = user;
  const fechaActual = moment(new Date()).format("MM/DD/YYYY");
  const apellidos = apellido_paterno + " " + apellido_materno;

  const [hasError, setHasError] = useState(false);
  const [addressHasError, setAddressHasError] = useState(false);
  let [addressErrorMessage, setAddressErrorMessage] = useState("");
  let [completeAddress, setCompleteAddress] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState("");

  const [pais, setPais] = useState("");
  const [productosCliente, setProductosCliente] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(false);
  let [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  let [successMessage, setSuccessMessage] = useState("");
  let [productos, setProductos] = useState([{}]);

  let [calidad, setCalidad] = useState(3);
  let [cantidad, setCantidad] = useState();

  let [toggleAddProductModal, setToggleAddProductModal] = useState(false);
  let [toggleDeleteProductModal, setToggleDeleteProductModal] = useState(false);
  let [toggleUpdateProductModal, setToggleUpdateProductModal] = useState(false);
  let [selectedProductId, setSelectedProductId] = useState(1);

  let [orderRequestLoading, setOrderRequestLoading] = useState(false);
  let [orderRequestHasError, setOrderRequestHasError] = useState(false);
  let [orderRequestErrorMessage, setOrderRequestErrorMessage] = useState(false);
  let [addressToken, setAddressToken] = useState("");

  let [paises, setPaises] = useState([]);
  let [estados, setEstados] = useState([]);
  let [ciudades, setCiudades] = useState([]);

  const handleAddProduct = () => {
    setToggleAddProductModal(true);
  };

  const validarDireccion = async (address) => {
    setAddressHasError(false);
    setAddressErrorMessage("");

    const response = await validateAddress(address);
    const { data } = response.data;
    if (response.status === 200) {
      if (data.length === 1) {
        setAddressHasError(false);
        setAddressErrorMessage("");
      } else {
        setAddressHasError(true);
        setAddressErrorMessage(
          "La dirección no existe o retorna más de una coincidencia"
        );
      }
    } else {
      setAddressHasError(true);
      setAddressErrorMessage("Error en servicio para validar dirección");
    }
  };
  useEffect(() => {
    setCompleteAddress(`${direccion}, ${ciudad}, ${estado}, ${pais}`);
  }, [direccion, ciudad, estado, pais]);

  const handleCloseModal = () => {
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");
    setCantidad(null);
    setCalidad(3);
    setToggleAddProductModal(false);
  };

  const getProducts = async () => {
    setLoadingProducts(true);
    setHasError(false);
    setErrorMessage("");

    const response = await getProductos();
    const data = response.data;
    if (response.status === 200) {
      setProductos(data.productos);
      setLoadingProducts(false);
    } else {
      setHasError(true);
      setErrorMessage("Error al obtener productos del sistema");
      setLoadingProducts(false);
    }
  };

  const handleAgregarProducto = (e) => {
    e.preventDefault();

    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");

    if (cantidad) {
      if (cantidad >= 1) {
        const productoCliente = {
          id: productosCliente.length + 1,
          imagen: productos.find(
            (producto) => producto.id === selectedProductId
          ).imagen,
          calidad: calidad,
          cantidad: cantidad,
          nombre_producto: productos.find(
            (producto) => producto.id === selectedProductId
          ).nombre_producto,
          idProducto: productos.find(
            (producto) => producto.id === selectedProductId
          ).id,
        };
        setProductosCliente([...productosCliente, productoCliente]);
        setSuccess(true);
        setSuccessMessage("Producto agregado exitosamente");
      } else {
        setHasError(true);
        setErrorMessage("cantidad debe ser mayor a 1");
      }
    } else {
      setHasError(true);
      setErrorMessage("Debe ingresar cantidad");
    }
  };

  const handleDeleteProduct = (row) => {
    const filteredProducts = productosCliente.filter(
      (producto) => !(producto === row)
    );

    setProductosCliente(filteredProducts);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSelectedProductId(e.target.value);
  };

  const getAddressToken = async () => {
    const token = await getToken();
    setAddressToken(token.data.auth_token);
  };

  const getPaises = async () => {
    const countries = await getCountries(addressToken);
    setPaises(countries.data);
  };

  const getEstados = async () => {
    const states = await getCountriesStates(addressToken, pais);
    setEstados(states.data);
  };

  const getCiudades = async () => {
    const ciudades = await getStatesCities(addressToken, estado);
    setCiudades(ciudades.data);
  };

  useEffect(() => {
    if (estado) getCiudades();
  }, [estado, addressToken]);

  useEffect(() => {
    if (pais) getEstados();
  }, [pais, addressToken]);

  useEffect(() => {
    getAddressToken();
    getProducts();
  }, []);

  useEffect(() => {
    getPaises();
  }, [addressToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderRequestLoading(true);
    setOrderRequestHasError(false);
    setOrderRequestErrorMessage("");
    const detalle = productosCliente.map((producto) => {
      return {
        producto_id: producto.idProducto,
        calidad: producto.calidad,
        cantidad: producto.cantidad,
      };
    });

    if (
      detalle.length > 0 &&
      direccion &&
      ciudad &&
      estado &&
      pais &&
      completeAddress &&
      rut
    ) {
      //validarDireccion(completeAddress);
      if (!addressHasError) {
        const response = await insertSolicitudPedido(
          rut,
          completeAddress,
          detalle
        );

        if (response.status === 200) {
          //trigger order requests
          setShowOrderRequestForm(false, "create");
          setOrderRequestLoading(true);
          setOrderRequestHasError(false);
          setOrderRequestErrorMessage("");
        } else {
          //fallo del servicio
          setOrderRequestLoading(false);
          setOrderRequestHasError(true);
          setOrderRequestErrorMessage("fallo del servicio");
        }
      }
    } else {
      //debe ingresar los valores
      setOrderRequestLoading(false);
      setOrderRequestHasError(true);
      setOrderRequestErrorMessage("debe ingresar los valores de los inputs");
    }
  };

  return (
    <Card className={styles.container} sx={{ minWidth: 275 }}>
      <Title>Nueva Solicitud Pedido</Title>

      <div className={styles.formContainer}>
        <TextField
          disabled={true}
          id="nombre"
          variant="outlined"
          value={nombre}
        ></TextField>
        <TextField
          disabled={true}
          id="apellidos"
          variant="outlined"
          value={apellidos}
        ></TextField>
        <TextField
          disabled={true}
          id="rut"
          variant="outlined"
          value={rut}
        ></TextField>
        <TextField
          disabled={true}
          id="fecha"
          variant="outlined"
          value={fechaActual}
        ></TextField>
        <Autocomplete
          onChange={(e, option) =>
            option?.country_name ? setPais(option.country_name) : setPais("")
          }
          id="autocomplete-pais"
          sx={{ width: 300 }}
          options={paises}
          autoHighlight
          getOptionLabel={(option) => option.country_name}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <img
                loading="lazy"
                width="20"
                src={`https://flagcdn.com/w20/${option.country_short_name.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w40/${option.country_short_name.toLowerCase()}.png 2x`}
                alt=""
              />
              {option.country_name} ({option.country_short_name})
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Pais"
              value={pais}
              // onChange={(e) => setPais(e.target.value)}
              inputProps={{
                ...params.inputProps,
                autoComplete: "autocomplete-pais", // disable autocomplete and autofill
              }}
            />
          )}
        />
        <Autocomplete
          onChange={(e, option) =>
            option?.state_name ? setEstado(option.state_name) : setEstado("")
          }
          id="autocomplete-estado"
          sx={{ width: 300 }}
          options={estados}
          autoHighlight
          getOptionLabel={(option) => option.state_name}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              {option.state_name}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Estado, Provincia o Departamento"
              value={estado}
              inputProps={{
                ...params.inputProps,
                autoComplete: "autocomplete-estado", // disable autocomplete and autofill
              }}
            />
          )}
        />
        <Autocomplete
          onChange={(e, option) =>
            option?.city_name ? setCiudad(option.city_name) : setCiudad("")
          }
          id="autocomplete-ciudad"
          sx={{ width: 300 }}
          options={ciudades}
          autoHighlight
          getOptionLabel={(option) => option.city_name}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              {option.city_name}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Ciudad"
              value={ciudad}
              inputProps={{
                ...params.inputProps,
                autoComplete: "autocomplete-ciudad", // disable autocomplete and autofill
              }}
            />
          )}
        />
        <TextField
          style={{ width: 500 }}
          id="direccion"
          label="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
      </div>
      <div className={styles.addressMessageContainers}>
        {addressHasError && (
          <Alert severity="error">{addressErrorMessage}</Alert>
        )}
      </div>
      <div>
        <Grid item xs={12} className={styles.productTableContainer}>
          <div className={styles.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProduct}
            >
              Agregar Producto
            </Button>
          </div>
          {productosCliente.length > 0 ? (
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <React.Fragment>
                <Title>Productos</Title>
                <Table size="large">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Imagen</TableCell>
                      <TableCell align="right">Nombre</TableCell>
                      <TableCell align="center">Calidad</TableCell>
                      <TableCell align="right">Cantidad&nbsp;(kg)</TableCell>

                      <TableCell align="right">Eliminar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productosCliente.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="right">
                          <img
                            src={row.imagen}
                            alt="fruit"
                            style={{ width: 50, height: 50 }}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" align="right">
                          {row.nombre_producto}
                        </TableCell>

                        <TableCell align="right">
                          <Quality value={row.calidad} readOnly />
                        </TableCell>
                        <TableCell align="right">{row.cantidad} kg</TableCell>

                        <TableCell align="right">
                          <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => handleDeleteProduct(row)}
                            style={{ alignSelf: "end", color: "#d42c2c" }}
                          >
                            <DeleteForever />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </React.Fragment>
            </Paper>
          ) : (
            <Alert severity="info">
              Agregue un producto para visualizarlo en ésta área
            </Alert>
          )}
        </Grid>

        {toggleAddProductModal && (
          <Modal open={toggleAddProductModal} disableEscapeKeyDown>
            <Box sx={style}>
              <div className={styles.modalTitleContainer}>
                <Title>Agregar Producto</Title>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseModal}
                  style={{ alignSelf: "end" }}
                >
                  <Close />
                </IconButton>
              </div>

              {loadingProducts ? (
                <Box className={styles.loadingContainer}>
                  <CircularProgress />
                </Box>
              ) : (
                <form onSubmit={handleAgregarProducto}>
                  <div className={styles.modalFormContainer}>
                    <FormControl fullWidth>
                      <InputLabel>Productos</InputLabel>
                      <Select
                        value={selectedProductId}
                        label="Productos"
                        onChange={handleChange}
                      >
                        {productos.map((producto) => {
                          return (
                            <MenuItem key={producto.id} value={producto.id}>
                              {producto.nombre_producto}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>

                    <FormControl variant="outlined" style={{ width: "200px" }}>
                      <InputLabel>Cantidad</InputLabel>
                      <OutlinedInput
                        type="number"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        endAdornment={
                          <InputAdornment position="end">kg</InputAdornment>
                        }
                        //inputProps={{ min: 1, max: 999 }}
                        label="Cantidad"
                      />
                    </FormControl>
                    <Quality value={calidad} onChange={(e) => setCalidad(e)} />
                  </div>
                  {successMessage && (
                    <Alert
                      severity="success"
                      onClose={() => setSuccessMessage("")}
                    >
                      {successMessage}
                    </Alert>
                  )}
                  {hasError && errorMessage && (
                    <Alert severity="error" onClose={() => setErrorMessage("")}>
                      {errorMessage}
                    </Alert>
                  )}
                  <div className={styles.modalButtonsContainer}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={styles.addProductButton}
                      disabled={
                        !cantidad ||
                        errorMessage ===
                          "Error al obtener productos del sistema"
                      }
                    >
                      Agregar
                    </Button>
                  </div>
                </form>
              )}
            </Box>
          </Modal>
        )}
      </div>

      <div className={styles.buttonsContainer}>
        <Button
          variant="contained"
          color="error"
          onClick={() => setShowOrderRequestForm(false, "cancel")}
        >
          Cancelar Solicitud
        </Button>

        {orderRequestLoading ? (
          <LoadingButton
            color="secondary"
            loading={orderRequestLoading}
            loadingPosition="start"
            variant="contained"
            startIcon={<LoginIcon />}
            className={styles.loginButton}
          >
            Creando Solicitud
          </LoadingButton>
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={
              !direccion ||
              !ciudad ||
              !estado ||
              !pais ||
              addressHasError ||
              productosCliente.length < 1
            }
          >
            Crear Solicitud
          </Button>
        )}

        {orderRequestHasError && orderRequestErrorMessage && (
          <Alert
            severity="error"
            onClose={() => setOrderRequestErrorMessage("")}
          >
            {orderRequestErrorMessage}
          </Alert>
        )}
      </div>
    </Card>
  );
};

export default OrderRequestForm;
