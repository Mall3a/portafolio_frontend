import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getProductosProductor } from "../api/LoginApi";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import styles from "./BasicTable.module.scss";
import { Button, Modal } from "@mui/material";
import BasicModal from "./BasicModal";

export default function BasicTable({ user }) {
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [productos, setProductos] = useState([{}]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (e) => {
    setOpen(false);
    if (e === "modified") getProducerProducts();
  };

  useEffect(() => {
    getProducerProducts();
  }, []);

  useEffect(() => {
    console.log(productos);
  }, [productos]);

  const getProducerProducts = async () => {
    setLoading(true);
    setIsError(false);

    const response = await getProductosProductor(user.rut);
    const data = response.data;

    if (response.status === 200) {
      if (data.productos.length > 0) {
        setProductos(data.productos);
      } else {
        /** TODO: poner mensaje personalizado no tiene productos */
        setIsError(true);
      }
      setLoading(false);
    } else {
      /** TODO: poner mensaje personalizado error de servicio */
      setIsError(true);
      setLoading(false);
    }
  };

  const handleAgregar = () => {
    handleOpen();
  };

  return loading ? (
    <Box className={styles.loadingContainer}>
      <CircularProgress />
    </Box>
  ) : (
    <div className={styles.container}>
      <Button variant="contained" color="primary" onClick={handleAgregar}>
        Agregar
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre Producto</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Calidad&nbsp;(1-5)</TableCell>
              <TableCell align="right">Cantidad&nbsp;(kg)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.nombre_producto}
                </TableCell>
                <TableCell align="right">{row.precio}</TableCell>
                <TableCell align="right">{row.calidad}</TableCell>
                <TableCell align="right">{row.cantidad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {
        <BasicModal
          open={open}
          rut={user.rut}
          handleClose={(e) => handleClose(e)}
        ></BasicModal>
      }
    </div>
  );
}
