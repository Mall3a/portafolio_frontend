import React, { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Stack } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { data } from "../../api/MockData";
import { getAllPedidos } from "../../api/consultantApis";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pedidos, setPedidos] = useState([]);

  const getAllOrders = async () => {
    setLoading(true);
    setHasError(false);

    const response = await getAllPedidos();
    const data = response.data;
    if (response.status === 200) {
      if (data.pedidos.length > 0) {
        setPedidos(data.pedidos);
        setHasError(false);
        setLoading(false);
      } else {
        setHasError(true);
        setLoading(false);
        setErrorMsg("No se ha encontrado pedidos en el sistema");
      }
    } else {
      setHasError(true);
      setLoading(false);
      setErrorMsg("El servicio para obtener información de pedidos ha fallado");
    }
  };

  useEffect(() => {
    getAllOrders();
    console.log(pedidos);
  }, []);

  const averageSalary = useMemo(
    () => data.reduce((acc, curr) => acc + curr.salary, 0) / data.length,
    []
  );

  const maxTotal = useMemo(
    () => data.reduce((acc, curr) => Math.max(acc, curr.total), 0),
    []
  );

  const columns = useMemo(
    () => [
      {
        header: "ID Pedido",
        accessorKey: "pedido_id",
        enableGrouping: false, //don't let this column be grouped
      },
      /** 
      {
        header: "ID Solicitud",
        accessorKey: "solicitud_id",
      },
       */
      {
        header: "ID Oferta Subasta",
        accessorKey: "oferta_subasta_id",
      },
      {
        header: "Fecha Pedido",
        accessorKey: "fecha_pedido",
      },
      /**
       {
        header: "Fecha solicitud",
        accessorKey: "fecha_solicitud",
      }
      */ {
        header: "Estado Pedido",
        accessorKey: "estado_pedido",
      },

      {
        header: "Total Pedido",
        accessorKey: "total",
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
            Total Promedio:
            <Box color="warning.main">
              {averageSalary?.toLocaleString?.("es-CL", {
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
        header: "Rut Cliente",
        accessorKey: "usuario_id",
      },

      {
        header: "Dirección Destino",
        accessorKey: "direccion",
      },
    ],
    [maxTotal]
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
    csvExporter.generateCsv(data);
  };

  return loading ? (
    <CircularProgress />
  ) : (
    <MaterialReactTable
      columns={columns}
      data={pedidos}
      enableGrouping
      enableStickyHeader
      enableStickyFooter
      initialState={{
        density: "compact",
        expanded: true, //expand all groups by default
        grouping: [], //an array of columns to group by by default (can be multiple)
        pagination: { pageIndex: 0, pageSize: 20 },
        sorting: [{ id: "total", desc: false }], //sort by state by default
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
            Export All Data
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
            Export All Rows
          </Button>
          <Button
            disabled={table.getRowModel().rows.length === 0}
            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export Page Rows
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
            Export Selected Rows
          </Button>
        </Box>
      )}
    />
  );
};

export default Reports;
