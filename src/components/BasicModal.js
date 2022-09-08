import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { addProductosProductor } from "../api/LoginApi";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
} from "@mui/material";
import styles from "./BasicModal.module.scss";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ open, handleClose, rut }) {
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [precio, setPrecio] = useState(1);
  let [calidad, setCalidad] = useState(1);
  let [cantidad, setCantidad] = useState(1);
  let [productos, setProductos] = useState([{}]);
  let [selectedProductId, setSelectedProductId] = useState(1);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    //get productos
    const response = {
      data: {
        productos: [
          {
            id: 1,
            nombre: "Zanahoria",
            descripcion: "",
            imagen: "",
          },
        ],
      },
      status: 200,
    };

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
  const handleAgregar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsError(false);

    const response = await addProductosProductor(
      12, //TODO arreglar id autoncrementable
      selectedProductId,
      precio,
      calidad,
      cantidad,
      rut
    );
    const data = response.data;
    if (response.status === 200) {
      if (data.out_mensaje_salida === "PRODUCTO CREADO CORRECTAMENTE") {
        handleClose("modified");
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
    console.log(e.target.value);
    setSelectedProductId(e.target.value);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleAgregar} className={styles.formContainer}>
            {loading ? (
              <Box className={styles.loadingContainer}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Productos
                  </InputLabel>
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
                <TextField
                  inputProps={{ min: 1, max: 5 }}
                  type="number"
                  label="Calidad"
                  variant="outlined"
                  value={calidad}
                  onChange={(e) => setCalidad(e.target.value)}
                />
                <TextField
                  inputProps={{ min: 1 }}
                  type="number"
                  label="Cantidad"
                  variant="outlined"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
                {isError && (
                  <div className={styles.errorMessage}>
                    Error al agregar producto
                  </div>
                )}
                <Button type="submit" variant="contained" color="primary">
                  Agregar
                </Button>
              </>
            )}
            <></>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
