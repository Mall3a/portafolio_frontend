import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { updateProductoProductor } from "../../api/producerApis.js";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  TextField,
  Alert,
  InputAdornment,
  OutlinedInput,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./UpdateProduct.module.scss";
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

const UpdateProduct = ({
  onSuccess,
  toggleUpdateProductModal,
  setToggleUpdateProductModal,
  selectedProduct,
}) => {
  let [precio, setPrecio] = useState({});
  let [calidad, setCalidad] = useState(3);
  let [cantidad, setCantidad] = useState();
  let [errorMessage, setErrorMessage] = useState("");
  let [successMessage, setSuccessMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingInsertProduct, setLoadingInsertProduct] = useState(false);

  useEffect(() => {
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");

    return () => {
      setHasError(false);
      setSuccess(false);
      setErrorMessage("");
      setSuccessMessage("");
    };
  }, []);

  useEffect(() => {
    if (success) {
      onSuccess();
      setSuccess(false);
    }
  }, [onSuccess, success]);

  const handleEditarProducto = async (e) => {
    e.preventDefault();
    setLoadingInsertProduct(true);
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");

    if (precio && cantidad) {
      if (precio.value >= 1 && cantidad >= 1) {
        const response = await updateProductoProductor(
          selectedProduct.id,
          precio.value,
          calidad,
          cantidad
        );
        const data = response.data;
        if (response.status === 200) {
          if (data.out_mensaje_salida.includes("MODIFICADO")) {
            setSuccess(true);
            setSuccessMessage("Producto editado exitosamente");
          } else {
            setErrorMessage("Ha ocurrido un error al editar el producto");
            setHasError(true);
          }
          setLoadingInsertProduct(false);
        } else {
          setHasError(true);
          setLoadingInsertProduct(false);
          setErrorMessage("El servicio para editar productos ha fallado");
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

  const format = (numStr) => {
    if (numStr === "") return "";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(numStr);
  };
  const handleCloseModal = () => {
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");
    setPrecio({ formattedValue: "", value: null, floatValue: null });
    setCantidad(null);
    setToggleUpdateProductModal(false);
  };

  return (
    <Modal open={toggleUpdateProductModal} disableEscapeKeyDown>
      <Box sx={style}>
        <div className={styles.modalTitleContainer}>
          <Title>Editar Producto</Title>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseModal}
            style={{ alignSelf: "end" }}
          >
            <Close />
          </IconButton>
        </div>

        <form onSubmit={handleEditarProducto}>
          <div className={styles.formContainer}>
            <TextField
              disabled={true}
              label="Producto"
              value={selectedProduct.name}
            ></TextField>
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
                Editar
              </LoadingButton>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={styles.updateProductButton}
                disabled={!precio.value || !cantidad}
              >
                Editar
              </Button>
            )}
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateProduct;
