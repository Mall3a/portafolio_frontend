import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  addTransporteTransportista,
  getTipoTransportes,
} from "../../api/driverApis";
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Alert,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./AddVehicle.module.scss";
import { Save } from "@mui/icons-material";
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

const AddVehicle = ({ rut, onSuccess, toggleAddModal, setToggleAddModal }) => {
  let [patente, setPatente] = useState("");
  let [capacidad, setCapacidad] = useState();
  let [refrigeracion, setRefrigeracion] = useState(false);
  let [tipoTransportes, setTipoTransportes] = useState([{}]);
  let [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState(1);
  let [errorMessage, setErrorMessage] = useState("");
  let [successMessage, setSuccessMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingTipoTransportes, setLoadingTipoTransportes] = useState(false);
  const [loadingInsert, setLoadingInsert] = useState(false);

  useEffect(() => {
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");

    loadTipoTransportes();

    return () => {
      setHasError(false);
      setSuccess(false);
      setErrorMessage("");
      setSuccessMessage("");
    };
  }, []);

  const loadTipoTransportes = async () => {
    setLoadingTipoTransportes(true);
    setHasError(false);
    setErrorMessage("");

    const response = await getTipoTransportes();
    const data = response.data;

    if (response.status === 200) {
      setTipoTransportes(data.tipo_transportes);
      setLoadingTipoTransportes(false);
    } else {
      setHasError(true);
      setErrorMessage("Error al obtener tipo de transportes del sistema");
      setLoadingTipoTransportes(false);
    }
  };

  useEffect(() => {
    if (success) {
      onSuccess();
      setSuccess(false);
    }
  }, [onSuccess, success]);

  const handleAgregarTransporte = async (e) => {
    e.preventDefault();
    setLoadingInsert(true);
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");

    if (patente && capacidad > 0) {
      const response = await addTransporteTransportista(
        rut,
        patente,
        capacidad,
        refrigeracion ? 1 : 0,
        selectedVehicleTypeId
      );

      const data = response.data;
      if (response.status === 200) {
        if (data.out_mensaje_salida === "TRANSPORTE CREADO CORRECTAMENTE") {
          setSuccess(true);
          setSuccessMessage("Transporte agregado exitosamente");
        } else {
          setErrorMessage("Ha ocurrido un error al agregar el transporte");
          setHasError(true);
        }
        setLoadingInsert(false);
      } else {
        setHasError(true);
        setLoadingInsert(false);
        setErrorMessage("El servicio para agregar transportes ha fallado");
      }
    } else {
      setHasError(true);
      setLoadingInsert(false);
      setErrorMessage("Debe ingresar patente y capacidad");
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSelectedVehicleTypeId(e.target.value);
  };

  const handleCloseModal = () => {
    setHasError(false);
    setSuccess(false);
    setErrorMessage("");
    setSuccessMessage("");

    setPatente("");
    setCapacidad();
    setRefrigeracion(false);

    setToggleAddModal(false);
  };

  return (
    <Modal open={toggleAddModal} disableEscapeKeyDown>
      <Box sx={style}>
        <div className={styles.modalTitleContainer}>
          <Title>Agregar Transporte</Title>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseModal}
            style={{ alignSelf: "end" }}
          >
            <Close />
          </IconButton>
        </div>

        {loadingTipoTransportes ? (
          <Box className={styles.loadingContainer}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleAgregarTransporte}>
            <div className={styles.formContainer}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Transportes</InputLabel>
                <Select
                  value={selectedVehicleTypeId}
                  label="Tipo de Transportes"
                  onChange={handleChange}
                >
                  {tipoTransportes.map((transporte, index) => {
                    return (
                      <MenuItem key={index} value={transporte.id}>
                        {transporte.descripcion}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <TextField
                id="patente"
                label="Patente"
                variant="outlined"
                value={patente}
                onChange={(e) => setPatente(e.target.value)}
              ></TextField>

              <FormControl variant="outlined" style={{ width: "200px" }}>
                <InputLabel>Capacidad</InputLabel>
                <OutlinedInput
                  type="number"
                  value={capacidad}
                  onChange={(e) => setCapacidad(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">T</InputAdornment>
                  }
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
              {loadingInsert ? (
                <LoadingButton
                  color="secondary"
                  loading={loadingInsert}
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
                  className={styles.addButton}
                  disabled={
                    errorMessage ===
                    "Error al obtener tipoTransportes del sistema"
                  }
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

export default AddVehicle;
