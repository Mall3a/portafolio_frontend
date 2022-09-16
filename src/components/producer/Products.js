import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../common/Title";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { getProductosProductor } from "../../api/Apis";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import styles from "./Products.module.scss";
import { Button } from "@mui/material";
import AddProduct from "./AddProduct";
import { IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Close, DeleteForever, Edit } from "@mui/icons-material";
import Quality from "../common/Quality";
import ManzanaIcon from "../../images/manzana.svg";
import PinaIcon from "../../images/pina.svg";
import PlatanoIcon from "../../images/platano.svg";
import ZanahoriaIcon from "../../images/zanahoria.svg";

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

const Products = ({ user }) => {
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [productos, setProductos] = useState([{}]);
  let [toggleModal, setToggleModal] = useState(false);

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
            onClick={() => setToggleModal(true)}
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
                  <TableCell align="center">Imagen</TableCell>
                  <TableCell align="right">Nombre</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="center">Calidad</TableCell>
                  <TableCell align="right">Cantidad&nbsp;(kg)</TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {row.nombre_producto === "Manzana" && (
                        <img
                          src={ManzanaIcon}
                          style={{ width: "50px", height: "50px" }}
                        ></img>
                      )}
                      {row.nombre_producto === "Zanahoria" && (
                        <img
                          src={ZanahoriaIcon}
                          style={{ width: "50px", height: "50px" }}
                        ></img>
                      )}
                      {row.nombre_producto === "Platano" && (
                        <img
                          src={PlatanoIcon}
                          style={{ width: "50px", height: "50px" }}
                        ></img>
                      )}
                      {row.nombre_producto === "Pina" && (
                        <img
                          src={PinaIcon}
                          style={{ width: "50px", height: "50px" }}
                        ></img>
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      {row.nombre_producto}
                    </TableCell>
                    <TableCell align="right">
                      {Intl.NumberFormat("es-CL", {
                        currency: "CLP",
                        style: "currency",
                      }).format(row.precio)}
                    </TableCell>
                    <TableCell align="right">
                      <Quality value={row.calidad} readOnly />
                    </TableCell>
                    <TableCell align="right">{row.cantidad} kg</TableCell>
                    <TableCell align="right">
                      <IconButton
                        edge="start"
                        color="inherit"
                        //onClick={() => editProduct(id)}
                        style={{ alignSelf: "end", color: "#1976d2" }}
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        edge="start"
                        color="inherit"
                        //onClick={() => deleteProduct(id)}
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
      </Grid>
      <Modal open={toggleModal} disableEscapeKeyDown>
        <Box sx={style}>
          <div className={styles.modalTitleContainer}>
            <Title>Agregar Producto</Title>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setToggleModal(false)}
              style={{ alignSelf: "end" }}
            >
              <Close />
            </IconButton>
          </div>
          <AddProduct rut={user.rut} />
        </Box>
      </Modal>
    </>
  );
};

export default Products;