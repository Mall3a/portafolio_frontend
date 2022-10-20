import React, { useEffect, useState } from "react";
import Title from "../common/Title";
import Box from "@mui/material/Box";
import styles from "./DeleteVehicle.module.scss";
import { Alert, Button } from "@mui/material";
import { IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Close, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { deleteProductoProductor } from "../../api/producerApis";
import { deleteTransporteTransportista } from "../../api/driverApis";

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

const DeleteVehicle = ({
  toggleDeleteModal,
  setToggleDeleteModal,
  selectedVehicle,
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

    const response = await deleteTransporteTransportista(selectedVehicle.id);
    const data = response.data;
    if (response.status === 200) {
      if (data.out_mensaje_salida.includes("ELIMINADO")) {
        setSuccess(true);
        setSuccessMessage("Transporte eliminado exitosamente");
      } else {
        setErrorMessage("Ha ocurrido un error al eliminar el Transporte");
        setHasError(true);
      }
      setLoading(false);
    } else {
      setHasError(true);
      setLoading(false);
      setErrorMessage("El servicio para eliminar Transportes ha fallado");
    }
  };

  const handleCloseModal = () => {
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");
    setToggleDeleteModal(false);
  };

  return (
    <Modal open={toggleDeleteModal} disableEscapeKeyDown>
      <Box sx={style}>
        <div className={styles.modalTitleContainer}>
          <Title>Eliminar Transporte</Title>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseModal}
            style={{ alignSelf: "end" }}
          >
            <Close />
          </IconButton>
        </div>
        <div className={styles.deleteContainer}>
          <label> ¿Está seguro que desea eliminar el transporte?</label>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {hasError && errorMessage && (
            <Alert severity="error" onClose={() => setErrorMessage("")}>
              {errorMessage}
            </Alert>
          )}
          <div className={styles.modalButtonsContainer}>
            {loading ? (
              <LoadingButton
                color="secondary"
                loading={loading}
                loadingPosition="start"
                variant="contained"
                startIcon={<Save />}
              >
                Eliminar
              </LoadingButton>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  disabled={successMessage !== ""}
                  onClick={handleOnClickDelete}
                >
                  Eliminar
                </Button>
              </>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteVehicle;
