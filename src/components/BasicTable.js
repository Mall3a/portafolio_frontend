import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getProductosProductor } from "../api/LoginApi";
import React, { useEffect, useState } from "react";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function BasicTable(props) {
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  let [productos, setProductos] = useState([{}]);

  useEffect(() => {
    getProducerProducts();
  }, []);

  useEffect(() => {
    console.log(productos);
  }, [productos]);

  const getProducerProducts = async () => {
    setLoading(true);
    setIsError(false);

    const response = await getProductosProductor(props.user.rut);
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

  return (
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
  );
}
