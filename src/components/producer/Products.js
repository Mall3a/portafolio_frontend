import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../common/Title";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { getProductosProductor } from "../../api/producerApis.js";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import styles from "./Products.module.scss";
import { Alert, Button } from "@mui/material";
import AddProduct from "./AddProduct";
import { IconButton } from "@mui/material";
import { DeleteForever, Edit } from "@mui/icons-material";
import Quality from "../common/Quality";
import DeleteProduct from "./DeleteProduct";
import UpdateProduct from "./UpdateProduct";

const Products = ({ user }) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [productos, setProductos] = useState([{}]);
  let [toggleAddProductModal, setToggleAddProductModal] = useState(false);
  let [toggleDeleteProductModal, setToggleDeleteProductModal] = useState(false);
  let [toggleUpdateProductModal, setToggleUpdateProductModal] = useState(false);
  let [selectedProduct, setSelectedProduct] = useState({
    id: null,
    image: "",
    name: "",
    price: 0,
    quality: 0,
    quantity: 0,
  });

  useEffect(() => {
    getProducerProducts();
  }, []);

  const getProducerProducts = async () => {
    setLoading(true);
    setHasError(false);

    const response = await getProductosProductor(user.rut);
    const data = response.data;

    if (response.status === 200) {
      if (data.productos.length > 0) {
        setProductos(data.productos);
      } else {
        setProductos(data.productos);
        setHasError(false);
      }
      setLoading(false);
    } else {
      setHasError(true);
      setLoading(false);
    }
  };

  const handleDeleteProduct = ({ id, nombre_producto }) => {
    setToggleDeleteProductModal(true);
    setSelectedProduct({ id: id, name: nombre_producto });
  };

  const handleUpdateProduct = ({
    id,
    imagen,
    nombre_producto,
    precio,
    cantidad,
    calidad,
  }) => {
    console.log("update product");
    setToggleUpdateProductModal(true);
    setSelectedProduct({
      id: id,
      image: imagen,
      name: nombre_producto,
      price: precio,
      quantity: cantidad,
      quality: calidad,
    });
  };

  const handleAddProduct = () => {
    setToggleAddProductModal(true);
  };

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
              onClick={handleAddProduct}
            >
              Agregar
            </Button>
          </div>
          {productos.length > 0 ? (
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
                      <TableCell align="right">Editar</TableCell>
                      <TableCell align="right">Eliminar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productos.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="center">
                          <img
                            src={row.imagen}
                            style={{ width: 50, height: 50 }}
                            alt="fruit"
                          />
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
                            onClick={() => handleUpdateProduct(row)}
                            style={{ alignSelf: "end", color: "#1976d2" }}
                          >
                            <Edit />
                          </IconButton>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => handleDeleteProduct(row)}
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
              Ha ocurrido un error al intentar obtener la lista de productos
            </Alert>
          ) : (
            <Alert severity="info">
              Agregue un producto para visualizarlo en ??sta ??rea
            </Alert>
          )}
        </Grid>
      )}
      {toggleAddProductModal && (
        <AddProduct
          rut={user.rut}
          onSuccess={() => {
            getProducerProducts();
          }}
          toggleAddProductModal={toggleAddProductModal}
          setToggleAddProductModal={setToggleAddProductModal}
        />
      )}
      {toggleDeleteProductModal && (
        <DeleteProduct
          onSuccess={() => {
            getProducerProducts();
          }}
          id={selectedProduct && selectedProduct.id}
          toggleDeleteProductModal={toggleDeleteProductModal}
          setToggleDeleteProductModal={setToggleDeleteProductModal}
        />
      )}
      {toggleUpdateProductModal && (
        <UpdateProduct
          onSuccess={() => {
            getProducerProducts();
          }}
          selectedProduct={selectedProduct && selectedProduct}
          toggleUpdateProductModal={toggleUpdateProductModal}
          setToggleUpdateProductModal={setToggleUpdateProductModal}
        />
      )}
    </>
  );
};

export default Products;
