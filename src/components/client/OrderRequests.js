import React, { useEffect, useState } from "react";
import OrderRequestForm from "./OrderRequestForm";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import styles from "./OrderRequests.module.scss";
import Title from "../common/Title";
import { getSolicitudesPedidos } from "../../api/clientApis";
import moment from "moment";
import { PanoramaFishEye, Search, Visibility } from "@mui/icons-material";

const OrderRequests = ({ user }) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [showOrderRequestForm, setShowOrderRequestForm] = useState(false);

  const handleCrearSolicitud = () => {
    setShowOrderRequestForm(true);
  };

  useEffect(() => {
    getClientOrderRequests();
  }, []);

  const getClientOrderRequests = async () => {
    setLoading(true);
    setHasError(false);

    const response = await getSolicitudesPedidos(user.rut);
    const data = response.data;

    if (response.status === 200) {
      if (data.solicitud_pedido_usuario.length > 0) {
        setSolicitudes(data.solicitud_pedido_usuario);
      } else {
        setSolicitudes(data.solicitud_pedido_usuario);
        setHasError(false);
      }
      setLoading(false);
    } else {
      setHasError(true);
      setLoading(false);
    }
  };
  return (
    <>
      {showOrderRequestForm ? (
        <OrderRequestForm
          user={user}
          setShowOrderRequestForm={(e) => setShowOrderRequestForm(e)}
          showOrderRequestForm={showOrderRequestForm}
        />
      ) : (
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
                  onClick={handleCrearSolicitud}
                >
                  Crear Solicitud
                </Button>
              </div>
              {solicitudes.length > 0 ? (
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <React.Fragment>
                    <Title>Historial Solicitudes</Title>
                    <Table size="large">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Fecha</TableCell>
                          <TableCell align="center">Dirección</TableCell>
                          <TableCell align="center">Estado</TableCell>
                          <TableCell align="center">Detalle</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {solicitudes.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {moment(row.fecha).format("MM/DD/YYYY")}
                            </TableCell>
                            <TableCell align="center">
                              {row.direccion}
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={row.estado} color="warning" />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                edge="start"
                                color="inherit"
                                //onClick={() => handleDeleteProduct(row)}
                                style={{ alignSelf: "end", color: "#1976d2" }}
                              >
                                <Search />
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
                  Ha ocurrido un error al intentar obtener la lista de
                  solicitudes
                </Alert>
              ) : (
                <Alert severity="info">
                  Cree una solicitud para visualizarla en ésta área
                </Alert>
              )}
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default OrderRequests;
