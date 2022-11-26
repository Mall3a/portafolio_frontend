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
import { Alert, Chip, IconButton } from "@mui/material";
import { getPedidosAsignados } from "../../api/driverApis";
import moment from "moment";
import { Edit, Search } from "@mui/icons-material";

const AssignedOrders = ({ user }) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [assignedOrders, setAssignedOrders] = useState([]);

  const format = (numStr) => {
    if (numStr === "") return "";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(numStr);
  };

  useEffect(() => {
    getAssignedOrders();
  }, []);

  const getAssignedOrders = async () => {
    setLoading(true);
    setHasError(false);

    const response = await getPedidosAsignados(user.rut);

    const data = response.data;

    if (response.status === 200) {
      setAssignedOrders(data.ofertas_subastas);
      console.log(data.ofertas_subastas);
      setLoading(false);
    } else {
      setHasError(true);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Box className={styles.loadingContainer}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid item xs={12}>
          {assignedOrders.length > 0 ? (
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <React.Fragment>
                <Title>Pedidos asignados</Title>
                <Table size="large">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">ID Pedido</TableCell>
                      <TableCell align="center">ID Oferta</TableCell>
                      <TableCell align="center">ID Solicitud</TableCell>
                      <TableCell align="center">Valor Total Pedido</TableCell>
                      <TableCell align="center">
                        Total Valor Transporte
                      </TableCell>
                      <TableCell align="center">Estado Pedido</TableCell>
                      <TableCell align="center">Dirección Destino</TableCell>
                      <TableCell align="center">Detalle Pedido</TableCell>
                      <TableCell align="center">Editar Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedOrders.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="center">
                          {row.id_pedido}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {row.oferta_subasta_id}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {row.solicitud_pedido_id}
                        </TableCell>
                        <TableCell align="center">
                          {format(row.total_pedido)}
                        </TableCell>
                        <TableCell align="center">
                          {format(row.valor_subasta_ganadora)}
                        </TableCell>
                        <TableCell align="center">
                          {row.estado_pedido_id === 1 && (
                            <Chip label={row.estado_pedido} color="default" />
                          )}
                          {row.estado_pedido_id === 2 && (
                            <Chip label={row.estado_pedido} color="primary" />
                          )}
                          {row.estado_pedido_id === 3 && (
                            <Chip label={row.estado_pedido} color="warning" />
                          )}
                          {row.estado_pedido_id === 4 && (
                            <Chip label={row.estado_pedido} color="warning" />
                          )}
                          {row.estado_pedido_id === 5 && (
                            <Chip label={row.estado_pedido} color="warning" />
                          )}
                          {row.estado_pedido_id === 6 && (
                            <Chip label={row.estado_pedido} color="info" />
                          )}
                          {row.estado_pedido_id === 7 && (
                            <Chip label={row.estado_pedido} color="success" />
                          )}
                          {row.estado_pedido_id === 8 && (
                            <Chip label={row.estado_pedido} color="error" />
                          )}
                        </TableCell>
                        <TableCell align="center">{row.direccion}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            edge="start"
                            color="inherit"
                            //  onClick={() => handleViewDetail(row)}
                            style={{ alignSelf: "end", color: "#1976d2" }}
                          >
                            <Search />
                          </IconButton>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            edge="start"
                            color="inherit"
                            //  onClick={() => handleUpdateOrderStatus(row)}
                            style={{ alignSelf: "end", color: "#1976d2" }}
                          >
                            <Edit />
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
              Ha ocurrido un error al obtener la lista de pedidos asignados
            </Alert>
          ) : (
            <Alert severity="info">
              Realice una oferta a una subasta y espere a ganar la oferta para
              ver si le es asignado un pedido
            </Alert>
          )}
        </Grid>
      )}
    </>
  );
};

export default AssignedOrders;
