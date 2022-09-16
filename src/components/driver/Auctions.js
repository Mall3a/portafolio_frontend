import React, { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { personData } from "../../api/MockData";

const Auctions = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name.firstName", //access nested data with dot notation
        header: "First Name",
      },
      {
        accessorKey: "name.lastName",
        header: "Last Name",
      },
      {
        accessorKey: "address", //normal accessorKey
        header: "Address",
      },
      {
        accessorKey: "city",
        header: "City",
      },
      {
        accessorKey: "state",
        header: "State",
      },
    ],
    []
  );

  return <MaterialReactTable columns={columns} data={personData} />;
};

export default Auctions;
