import React, { useState } from "react";
import OrderRequestForm from "./OrderRequestForm";
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
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

const OrderRequests = ({ user }) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [showOrderRequestForm, setShowOrderRequestForm] = useState(false);

  const handleCrearSolicitud = () => {
    setShowOrderRequestForm(true);
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
                          <TableCell align="right">Patente</TableCell>
                          <TableCell align="right">
                            Capacidad&nbsp;(T)
                          </TableCell>
                          <TableCell align="right">Tipo Transporte</TableCell>
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
                            <TableCell component="th" scope="row" align="right">
                              {row.patente}
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                              {row.capacidad} T
                            </TableCell>
                            <TableCell align="center">
                              {row.nombre_tipo_transporte}
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
