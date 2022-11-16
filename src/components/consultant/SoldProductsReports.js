import React, { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Stack } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { data } from "../../api/MockData";
import { getAllSoldProducts } from "../../api/consultantApis";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";

const SoldProductsReports = () => {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [productosVendidos, setProductosVendidos] = useState([]);

  const getProductosVendidos = async () => {
    setLoading(true);
    setHasError(false);

    const response = await getAllSoldProducts();
    const data = response.data;
    if (response.status === 200) {
      if (data.productos_vendidos && data.productos_vendidos.length > 0) {
        setProductosVendidos(data.productos_vendidos);
        setHasError(false);
        setLoading(false);
      } else {
        setHasError(true);
        setLoading(false);
        setErrorMsg("No se ha encontrado productos_vendidos en el sistema");
      }
    } else {
      setHasError(true);
      setLoading(false);
      setErrorMsg(
        "El servicio para obtener información de productos_vendidos ha fallado"
      );
    }
  };

  useEffect(() => {
    getProductosVendidos();
  }, []);

  const precioMaximo = useMemo(
    () =>
      productosVendidos.reduce((acc, curr) => Math.max(acc, curr.precio), 0),
    [productosVendidos]
  );

  const columns = useMemo(
    () => [
      {
        header: "ID Producto",
        accessorKey: "producto_id",
        enableGrouping: false, //don't let this column be grouped
      },
      {
        header: "Nombre producto",
        accessorKey: "nombre_producto",
      },
      {
        header: "Calidad Producto",
        accessorKey: "calidad",
      },
      {
        header: "Cantidad Producto",
        accessorKey: "cantidad",
      },
      {
        header: "Precio",
        accessorKey: "precio",
        aggregationFn: "mean",
        //required to render an aggregated cell, show the average salary in the group
        AggregatedCell: ({ cell, table }) => (
          <>
            Promedio por{" "}
            {table.getColumn(cell.row.groupingColumnId ?? "").columnDef.header}:{" "}
            <Box sx={{ color: "success.main", fontWeight: "bold" }}>
              {cell.getValue()?.toLocaleString?.("es-CL", {
                style: "currency",
                currency: "CLP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Box>
          </>
        ),
        //customize normal cell render on normal non-aggregated rows
        Cell: ({ cell }) => (
          <>
            {cell.getValue()?.toLocaleString?.("es-CL", {
              style: "currency",
              currency: "CLP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </>
        ),
        Footer: () => (
          <Stack>
            Precio máximo
            <Box color="warning.main">
              {Math.round(precioMaximo)?.toLocaleString?.("es-CL", {
                style: "currency",
                currency: "CLP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Box>
          </Stack>
        ),
      },
      {
        header: "RUT Productor",
        accessorKey: "productor_rut",
      },
    ],
    [precioMaximo]
  );
  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(productosVendidos);
  };

  return loading ? (
    <CircularProgress />
  ) : (
    <MaterialReactTable
      columns={columns}
      data={productosVendidos}
      enableGrouping
      enableStickyHeader
      enableStickyFooter
      initialState={{
        density: "compact",
        expanded: true, //expand all groups by default
        grouping: [], //an array of columns to group by by default (can be multiple)
        pagination: { pageIndex: 0, pageSize: 20 },
        sorting: [{ id: "calidad", desc: false }], //sort by state by default
      }}
      muiToolbarAlertBannerChipProps={{ color: "primary" }}
      muiTableContainerProps={{ sx: { maxHeight: 700 } }}
      enableRowSelection
      positionToolbarAlertBanner="bottom"
      renderTopToolbarCustomActions={({ table }) => (
        <Box
          sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
        >
          <Button
            color="primary"
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
            onClick={handleExportData}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Exportar Todo
          </Button>
          <Button
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            //export all rows, including from the next page, (still respects filtering and sorting)
            onClick={() =>
              handleExportRows(table.getPrePaginationRowModel().rows)
            }
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Exportar todas las filas
          </Button>
          <Button
            disabled={table.getRowModel().rows.length === 0}
            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Exportar las filas de la página
          </Button>
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Exportar filas seleccionadas
          </Button>
        </Box>
      )}
    />
  );
};

export default SoldProductsReports;
