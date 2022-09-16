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
} from "@mui/material";
import styles from "./AddProduct.module.scss";
import { mockProducts } from "../../api/MockData";
import Quality from "../common/Quality";

const AddProduct = ({ rut }) => {
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [precio, setPrecio] = useState(1);
  let [calidad, setCalidad] = useState(3);
  let [cantidad, setCantidad] = useState(1);
  let [productos, setProductos] = useState([{}]);
  let [selectedProductId, setSelectedProductId] = useState(1);

  useEffect(() => {
    //TODO: borrar variables al abrir modal
    setIsError(false);
    getProducts();
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
      setLoading(false);
    } else {
      /** TODO: poner mensaje personalizado error de servicio */
      setIsError(true);
      setLoading(false);
    }
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsError(false);

    const response = await addProductosProductor(
      Math.random(1000),
      //TODO arreglar id autoncrementable
      selectedProductId,
      precio,
      calidad,
      cantidad,
      rut
    );
    const data = response.data;
    if (response.status === 200) {
      if (data.out_mensaje_salida === "PRODUCTO CREADO CORRECTAMENTE") {
        //TODO: cerrar modal y mostrar mensaje exito
      } else {
        setIsError(true);
      }
      setLoading(false);
    } else {
      /** TODO: poner mensaje personalizado error de servicio */
      setIsError(true);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSelectedProductId(e.target.value);
  };

  return loading ? (
    <Box className={styles.loadingContainer}>
      <CircularProgress />
    </Box>
  ) : (
    <form onSubmit={handleAgregarProducto}>
      <div className={styles.formContainer}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Productos</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
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
        <Quality value={calidad} onChange={(e) => setCalidad(e)} />
        <TextField
          inputProps={{ min: 1 }}
          type="number"
          label="Cantidad"
          variant="outlined"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        {isError && (
          <div className={styles.errorMessage}>Error al agregar producto</div>
        )}
      </div>
      <div className={styles.buttonsContainer}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={styles.addProductButton}
        >
          Agregar
        </Button>
      </div>
    </form>
  );
};

export default AddProduct;
