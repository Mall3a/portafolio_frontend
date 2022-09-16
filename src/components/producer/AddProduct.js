import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { addProductosProductor } from "../../api/Apis";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./AddProduct.module.scss";
import { mockProducts } from "../../api/MockData";
import Quality from "../common/Quality";
import { Save } from "@mui/icons-material";

const AddProduct = ({ rut, onSuccess }) => {
  const [hasError, setHasError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingInsertProduct, setLoadingInsertProduct] = useState(false);

  let [precio, setPrecio] = useState(1);
  let [calidad, setCalidad] = useState(3);
  let [cantidad, setCantidad] = useState(1);
  let [productos, setProductos] = useState([{}]);
  let [selectedProductId, setSelectedProductId] = useState(1);

  useEffect(() => {
    setHasError(false);
    setSuccess(false);
    getProducts();

    return () => {
      setHasError(false);
      setSuccess(false);
    };
  }, []);

  const getProducts = async () => {
    //get productos
    //TODO obtener productos de servicio
    const response = mockProducts;

    //const response = await getProductos();
    //const data = response.data;
    if (response.status === 200) {
      //llenar select
      setProductos(response.data.productos);
      setLoadingProducts(false);
    } else {
      /** TODO: poner mensaje personalizado error de servicio */
      setHasError(true);
      setLoadingProducts(false);
    }
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    setLoadingInsertProduct(true);
    setHasError(false);
    setSuccess(false);

    const response = await addProductosProductor(
      Math.random(1000),
      //TODO: arreglar id autoncrementable
      selectedProductId,
      precio,
      calidad,
      cantidad,
      rut
    );
    const data = response.data;
    if (response.status === 200) {
      if (data.out_mensaje_salida === "PRODUCTO CREADO CORRECTAMENTE") {
        setSuccess(true);
        //TODO: actualizar tabla y cerrar modal
        onSuccess(success);
      } else {
        /** TODO: poner mensaje personalizado error al insertar */
        setHasError(true);
      }
      setLoadingInsertProduct(false);
    } else {
      /** TODO: poner mensaje personalizado error de servicio */
      setHasError(true);
      setLoadingInsertProduct(false);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSelectedProductId(e.target.value);
  };

  return loadingProducts ? (
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
        <TextField
          inputProps={{ min: 1 }}
          type="number"
          label="Precio"
          variant="outlined"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <TextField
          inputProps={{ min: 1 }}
          type="number"
          label="Cantidad"
          variant="outlined"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <Quality value={calidad} onChange={(e) => setCalidad(e)} />
      </div>
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
          >
            Agregar
          </Button>
        )}
      </div>
      {success && (
        <Alert severity="success">Producto agregado exitosamente</Alert>
      )}

      {hasError && (
        <Alert severity="error">
          Ha ocurrido un error al agregar el producto
        </Alert>
      )}
    </form>
  );
};

export default AddProduct;
