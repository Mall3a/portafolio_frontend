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
import { Alert } from "@mui/material";

import { CheckSharp, CloseSharp } from "@mui/icons-material";
import { getOfertasSubastas } from "../../api/driverApis";
import moment from "moment";

const AssignedOrders = ({ user }) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [auctionsOffers, setAuctionsOffers] = useState([]);

  const format = (numStr) => {
    if (numStr === "") return "";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(numStr);
  };

  useEffect(() => {
    //getActionOffers();
  }, []);

  const getActionOffers = async () => {
    setLoading(true);
    setHasError(false);

    const response = await getOfertasSubastas(user.rut);

    const data = response.data;

    if (response.status === 200) {
      if (data.ofertas_subasta.length > 0) {
        setAuctionsOffers(data.ofertas_subasta);
      } else {
        setAuctionsOffers(data.ofertas_subasta);
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
      {loading ? (
        <Box className={styles.loadingContainer}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid item xs={12}>
          {auctionsOffers.length > 0 ? (
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <React.Fragment>
                <Title>Ofertas realizadas a subastas</Title>
                <Table size="large">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Fecha Oferta</TableCell>
                      <TableCell align="center">ID Oferta</TableCell>
                      <TableCell align="center">ID Subasta</TableCell>
                      <TableCell align="center">Fecha Subasta</TableCell>
                      <TableCell align="center">Monto ofertado</TableCell>
                      <TableCell align="center">Precio Inicial</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auctionsOffers.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="center">
                          {moment(row.fecha_oferta).format("MM/DD/YYYY")}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {row.oferta_subasta_id}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {row.subasta_id}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {moment(row.fecha_inicio_subasta).format(
                            "MM/DD/YYYY"
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {format(row.monto_ofertado)}
                        </TableCell>
                        <TableCell align="center">
                          {format(row.precio_piso)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </React.Fragment>
            </Paper>
          ) : hasError ? (
            <Alert severity="error">
              Ha ocurrido un error al intentar obtener la lista de ofertas de
              subastas
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
