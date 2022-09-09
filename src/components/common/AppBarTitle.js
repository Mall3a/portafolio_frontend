import React from "react";
import Typography from "@mui/material/Typography";

const AppBarTitle = ({ title }) => {
  return (
    <Typography
      component="h1"
      variant="h6"
      color="inherit"
      noWrap
      sx={{ flexGrow: 1 }}
    >
      {title}
    </Typography>
  );
};

export default AppBarTitle;
