import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../common/Title";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import styles from "./Vehicles.module.scss";
import { Alert, Button } from "@mui/material";
import { IconButton } from "@mui/material";
import {
  DeleteForever,
  Edit,
  CheckSharp,
  CloseSharp,
} from "@mui/icons-material";
import { getTransportesTransportista } from "../../api/driverApis";
import FurgonImg from "../../images/furgon.jpg";

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

const Vehicles = ({ user }) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [vehicles, setVehicles] = useState([{}]);
  let [toggleAddModal, setToggleAddModal] = useState(false);
  let [toggleDeleteModal, setToggleDeleteModal] = useState(false);
  let [toggleUpdateModal, setToggleUpdateModal] = useState(false);
  let [selectedVehicle, setSelectedVehicle] = useState({
    id: null,
    name: "",
  });

  useEffect(() => {
    getDriverVehicles();
  }, []);

  const getDriverVehicles = async () => {
    setLoading(true);
    setHasError(false);

    const response = await getTransportesTransportista(user.rut);

    const data = response.data;
    console.log(data);

    if (response.status === 200) {
      if (data.transportes.length > 0) {
        setVehicles(data.transportes);
      } else {
        setVehicles(data.transportes);
        setHasError(false);
      }
      setLoading(false);
    } else {
      setHasError(true);
      setLoading(false);
    }
  };
  /* 
  const handleDeleteProduct = ({ id, nombre_producto }) => {
    setToggleDeleteProductModal(true);
    setSelectedProduct({ id: id, name: nombre_producto });
  };

  const handleUpdateProduct = ({ id, nombre_producto }) => {
    setToggleUpdateProductModal(true);
    setSelectedProduct({ id: id, name: nombre_producto });
  };

  const handleAddProduct = () => {
    setToggleAddProductModal(true);
  };
 */
  return (
    <>
      {loading ? (
        <Box className={styles.loadingContainer}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid item xs={12}>
          <div className={styles.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              //onClick={handleAddProduct}
            >
              Agregar
            </Button>
          </div>
          {vehicles.length > 0 ? (
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <React.Fragment>
                <Title>Transportes</Title>
                <Table size="large">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Imagen</TableCell>
                      <TableCell align="right">Patente</TableCell>
                      <TableCell align="right">Capacidad&nbsp;(T)</TableCell>
                      <TableCell align="center">Refrigeración</TableCell>
                      <TableCell align="right">Tipo Transporte</TableCell>
                      <TableCell align="right">Editar</TableCell>
                      <TableCell align="right">Eliminar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicles.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="center">
                          {row.nombre_tipo_transporte === "Furgón" && (
                            <img
                              style={{ width: "200px" }}
                              src={FurgonImg}
                            ></img>
                          )}
                        </TableCell>
                        <TableCell component="th" scope="row" align="right">
                          {row.patente}
                        </TableCell>

                        <TableCell component="th" scope="row" align="right">
                          {row.capacidad} T
                        </TableCell>

                        <TableCell component="th" scope="row" align="center">
                          {row.refrigeracion == 1 ? (
                            <CheckSharp style={{ color: "green" }} />
                          ) : (
                            <CloseSharp style={{ color: "red" }}></CloseSharp>
                          )}
                        </TableCell>

                        <TableCell align="center">
                          {row.nombre_tipo_transporte}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            edge="start"
                            color="inherit"
                            //onClick={() => handleUpdateProduct(row)}
                            style={{ alignSelf: "end", color: "#1976d2" }}
                          >
                            <Edit />
                          </IconButton>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            edge="start"
                            color="inherit"
                            //onClick={() => handleDeleteProduct(row)}
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
          ) : hasError ? (
            <Alert severity="error">
              Ha ocurrido un error al intentar obtener la lista de transportes
            </Alert>
          ) : (
            <Alert severity="info">
              Agregue un transporte para visualizarlo en ésta área
            </Alert>
          )}
        </Grid>
      )}
      {/* 
      <AddProduct
        rut={user.rut}
        onSuccess={() => {
          getProducerVehicles();
        }}
        toggleAddProductModal={toggleAddProductModal}
        setToggleAddProductModal={setToggleAddProductModal}
      />
           <DeleteProduct
        onSuccess={() => {
          getProducerVehicles();
        }}
        id={selectedProduct && selectedProduct.id}
        toggleDeleteProductModal={toggleDeleteProductModal}
        setToggleDeleteProductModal={setToggleDeleteProductModal}
      />
      <UpdateProduct
        onSuccess={() => {
          getProducerVehicles();
        }}
        selectedProduct={selectedProduct && selectedProduct}
        toggleUpdateProductModal={toggleUpdateProductModal}
        setToggleUpdateProductModal={setToggleUpdateProductModal}
      /> */}
    </>
  );
};

export default Vehicles;
