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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./UpdateVehicle.module.scss";
import Quality from "../common/Quality";
import { Save } from "@mui/icons-material";
import { NumberFormatBase } from "react-number-format";
import Modal from "@mui/material/Modal";
import { Close } from "@mui/icons-material";
import Title from "../common/Title";
import { updateTransporteTransportista } from "../../api/driverApis.js";

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

const UpdateVehicle = ({
  onSuccess,
  toggleUpdateModal,
  setToggleUpdateModal,
  selectedVehicle,
}) => {
  let [patente, setPatente] = useState(selectedVehicle.patente);
  let [capacidad, setCapacidad] = useState(selectedVehicle.capacidad);
  let [refrigeracion, setRefrigeracion] = useState(
    selectedVehicle.refrigeracion == 0 ? false : true
  );

  let [errorMessage, setErrorMessage] = useState("");
  let [successMessage, setSuccessMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");
    console.log(selectedVehicle);
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

  const handleEditar = async (e) => {
    e.preventDefault();
    setLoadingEdit(true);
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");

    if (patente && capacidad) {
      if (capacidad >= 1) {
        const response = await updateTransporteTransportista(
          selectedVehicle.id,
          patente,
          capacidad,
          refrigeracion ? 1 : 0
          //selectedVehicleTypeId
        );
        const data = response.data;
        if (response.status === 200) {
          if (data.out_mensaje_salida.includes("MODIFICADO")) {
            setSuccess(true);
            setSuccessMessage("Transporte editado exitosamente");
          } else {
            setErrorMessage("Ha ocurrido un error al editar el transporte");
            setHasError(true);
          }
          setLoadingEdit(false);
        } else {
          setHasError(true);
          setLoadingEdit(false);
          setErrorMessage("El servicio para editar transportes ha fallado");
        }
      } else {
        setHasError(true);
        setLoadingEdit(false);
        setErrorMessage("Capacidad debe ser mayor a 1");
      }
    } else {
      setHasError(true);
      setLoadingEdit(false);
      setErrorMessage("Debe ingresar patente y capacidad");
    }
  };

  const handleCloseModal = () => {
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");
    setPatente("");
    setCapacidad();
    setRefrigeracion(false);
    setToggleUpdateModal(false);
  };

  return (
    <Modal open={toggleUpdateModal} disableEscapeKeyDown>
      <Box sx={style}>
        <div className={styles.modalTitleContainer}>
          <Title>Editar Transporte</Title>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseModal}
            style={{ alignSelf: "end" }}
          >
            <Close />
          </IconButton>
        </div>

        <form onSubmit={handleEditar}>
          <div className={styles.formContainer}>
            <TextField
              disabled={true}
              label="Transporte"
              value={selectedVehicle.patente}
            ></TextField>

            <TextField
              disabled={true}
              label="Transporte"
              value={selectedVehicle.nombre_tipo_transporte}
            ></TextField>
            <FormControl variant="outlined" style={{ width: "200px" }}>
              <InputLabel>Capacidad</InputLabel>
              <OutlinedInput
                type="number"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                endAdornment={<InputAdornment position="end">T</InputAdornment>}
                //inputProps={{ min: 1, max: 999 }}
                label="Capacidad"
              />
            </FormControl>

            <FormControlLabel
              labelPlacement="end"
              control={
                <Switch
                  variant="outlined"
                  checked={refrigeracion}
                  onChange={(e) => {
                    setRefrigeracion(e.target.checked);
                  }}
                />
              }
              label="Refrigeración"
            />
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
            {loadingEdit ? (
              <LoadingButton
                color="secondary"
                loading={loadingEdit}
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
                className={styles.updateButton}
                disabled={!capacidad || !patente}
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

export default UpdateVehicle;
