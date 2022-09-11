import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../../common/Title";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { getProductosProductor } from "../../../api/Apis";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import styles from "./Products.module.scss";
import { Button } from "@mui/material";
import AddProductModal from "./AddProductModal";

export default function Products({ user }) {
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

  return loading ? (
    <Box className={styles.loadingContainer}>
      <CircularProgress />
    </Box>
  ) : (
    <>
      <Grid item xs={12}>
        <div className={styles.container}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
          >
            Agregar
          </Button>
        </div>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <React.Fragment>
            <Title>Productos</Title>
            <Table size="large">
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
                    <TableCell align="right">
                      {Intl.NumberFormat("es-CL", {
                        currency: "CLP",
                        style: "currency",
                      }).format(row.precio)}
                    </TableCell>
                    <TableCell align="right">{row.calidad}</TableCell>
                    <TableCell align="right">{row.cantidad} kg</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </React.Fragment>
        </Paper>
      </Grid>
      <AddProductModal
        open={open}
        rut={user.rut}
        handleClose={(e) => handleClose(e)}
      ></AddProductModal>
    </>
  );
}
