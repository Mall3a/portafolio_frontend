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
import { getAllSubastas } from "../../api/driverApis";
import moment from "moment";

const Auctions = ({ user }) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [auctions, setAuctions] = useState([{}]);

  let [selectedAuction, setSelectedAuction] = useState();

  useEffect(() => {
    getAuctions();
  }, []);

  const getAuctions = async () => {
    setLoading(true);
    setHasError(false);
    const response = await getAllSubastas();
    const data = response.data;
    if (response.status === 200) {
      setAuctions(data.subastas);
      setHasError(false);
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
          {auctions.length > 0 ? (
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <React.Fragment>
                <Title>Subastas para transportar pedido</Title>
                <Table size="large">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">ID Subasta</TableCell>
                      <TableCell align="center">ID Pedido</TableCell>
                      <TableCell align="center">Fecha Subasta</TableCell>
                      <TableCell align="center">Precio Inicial</TableCell>
                      <TableCell align="center">Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auctions.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="center">
                          {row.id}
                        </TableCell>

                        <TableCell component="th" scope="row" align="center">
                          {row.pedido_id}
                        </TableCell>

                        <TableCell component="th" scope="row" align="center">
                          {moment(row.fecha).format("MM/DD/YYYY")}
                        </TableCell>

                        <TableCell align="center">{row.precio_piso}</TableCell>
                        <TableCell align="center">
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={() => console.log(row)}
                          >
                            Hacer Oferta
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </React.Fragment>
            </Paper>
          ) : hasError ? (
            <Alert severity="error">
              Ha ocurrido un error al intentar obtener la lista de subastas
            </Alert>
          ) : (
            <Alert severity="info">No hay subastas en el sistema</Alert>
          )}
        </Grid>
      )}
    </>
  );
};

export default Auctions;
