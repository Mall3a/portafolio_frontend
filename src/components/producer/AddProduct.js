import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { addProductosProductor } from "../../api/producerApis.js";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Alert,
  InputAdornment,
  OutlinedInput,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./AddProduct.module.scss";
import { mockProducts } from "../../api/MockData";
import Quality from "../common/Quality";
import { Save } from "@mui/icons-material";
import { NumberFormatBase } from "react-number-format";
import Modal from "@mui/material/Modal";
import { Close } from "@mui/icons-material";
import Title from "../common/Title";

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

const AddProduct = ({
  rut,
  onSuccess,
  toggleAddProductModal,
  setToggleAddProductModal,
}) => {
  /** Formato variable precio:
   * 
    formattedValue: "$1",
    value: 1,
    floatValue: 1,
   */
  let [precio, setPrecio] = useState({});
  let [calidad, setCalidad] = useState(3);
  let [cantidad, setCantidad] = useState();
  let [productos, setProductos] = useState([{}]);
  let [selectedProductId, setSelectedProductId] = useState(1);
  let [errorMessage, setErrorMessage] = useState("");
  let [successMessage, setSuccessMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingInsertProduct, setLoadingInsertProduct] = useState(false);

  useEffect(() => {
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");

    getProducts();

    return () => {
      setHasError(false);
      setSuccess(false);
      setErrorMessage("");
      setSuccessMessage("");
    };
  }, []);

  const getProducts = async () => {
    //get productos
    //TODO: obtener productos de servicio
    const response = mockProducts;

    //const response = await getProductos();
    //const data = response.data;
    if (response.status === 200) {
      //llenar select
      setProductos(response.data.productos);
      setLoadingProducts(false);
    } else {
      setHasError(true);
      setErrorMessage("Error al obtener productos del sistema");
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (success) {
      onSuccess();
      setSuccess(false);
    }
  }, [onSuccess, success]);

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    setLoadingInsertProduct(true);
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");

    if (precio && cantidad) {
      if (precio.value >= 1 && cantidad >= 1) {
        const response = await addProductosProductor(
          selectedProductId,
          precio.value,
          calidad,
          cantidad,
          rut
        );
        const data = response.data;
        if (response.status === 200) {
          if (data.out_mensaje_salida === "PRODUCTO CREADO CORRECTAMENTE") {
            setSuccess(true);
            setSuccessMessage("Producto agregado exitosamente");
          } else {
            setErrorMessage("Ha ocurrido un error al agregar el producto");
            setHasError(true);
          }
          setLoadingInsertProduct(false);
        } else {
          setHasError(true);
          setLoadingInsertProduct(false);
          setErrorMessage("El servicio para agregar productos ha fallado");
        }
      } else {
        setHasError(true);
        setLoadingInsertProduct(false);
        setErrorMessage("Precio y cantidad debe ser mayor a 1");
      }
    } else {
      setHasError(true);
      setLoadingInsertProduct(false);
      setErrorMessage("Debe ingresar precio y cantidad");
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSelectedProductId(e.target.value);
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
    <Modal open={toggleAddProductModal} disableEscapeKeyDown>
      <Box sx={style}>
        <div className={styles.modalTitleContainer}>
          <Title>Agregar Producto</Title>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              setToggleAddProductModal(false);
            }}
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
            <div className={styles.formContainer}>
              <FormControl fullWidth>
                <InputLabel>Productos</InputLabel>
                <Select
                  value={selectedProductId}
                  label="Productos"
                  onChange={handleChange}
                >
                  {productos.map((producto, index) => {
                    return (
                      <MenuItem key={index} value={producto.id}>
                        {producto.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <NumberFormatBase
                style={{ width: "200px" }}
                format={format}
                value={precio.formattedValue}
                customInput={TextField}
                prefix="$"
                label="Precio"
                onValueChange={(values) => {
                  setPrecio(values);
                }}
              />
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
              <Alert severity="success" onClose={() => setSuccessMessage("")}>
                {successMessage}
              </Alert>
            )}
            {hasError && errorMessage && (
              <Alert severity="error" onClose={() => setErrorMessage("")}>
                {errorMessage}
              </Alert>
            )}
            <div className={styles.buttonsContainer}>
              {loadingInsertProduct ? (
                <LoadingButton
                  color="secondary"
                  loading={loadingInsertProduct}
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
                  disabled={!precio.value || !cantidad}
                >
                  Agregar
                </Button>
              )}
            </div>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default AddProduct;
