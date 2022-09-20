import React, { useEffect, useState } from "react";
import Title from "../common/Title";
import Box from "@mui/material/Box";
import styles from "./Products.module.scss";
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Close } from "@mui/icons-material";

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

const DeleteProduct = ({
  toggleDeleteProductModal,
  setToggleDeleteProductModal,
  id,
  onSuccess,
}) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  let [errorMessage, setErrorMessage] = useState("");
  let [successMessage, setSuccessMessage] = useState("");
  const [hasError, setHasError] = useState(false);

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

  const handleOnClickDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");

    /*  const response = await deleteProduct(id);
    const data = response.data;
    if (response.status === 200) {
      if (data.out_mensaje_salida === "PRODUCTO ELIMINADO CORRECTAMENTE") {
        setSuccess(true);
        setSuccessMessage("Producto eliminado exitosamente");
      } else {
        setErrorMessage("Ha ocurrido un error al eliminar el producto");
        setHasError(true);
      }
      setLoading(false);
    } else {
      setHasError(true);
      setLoading(false);
      setErrorMessage("El servicio para eliminar productos ha fallado");
    } */
    // setToggleDeleteProductModal(false);
  };

  return (
    <Modal open={toggleDeleteProductModal} disableEscapeKeyDown>
      <Box sx={style}>
        <div className={styles.modalTitleContainer}>
          <Title>Eliminar Producto</Title>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              setToggleDeleteProductModal(false);
            }}
            style={{ alignSelf: "end" }}
          >
            <Close />
          </IconButton>
        </div>
        <div className={styles.deleteContainer}>
          <label> ¿Está seguro que desea eliminar el producto?</label>{" "}
          <div className={styles.modalButtonsContainer}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => {
                setToggleDeleteProductModal(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleOnClickDelete}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteProduct;
