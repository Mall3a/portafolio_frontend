import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Divider from "@mui/material/Divider";
import { observer } from "mobx-react-lite";

const RenderMenuOptions = observer(({ store, user }) => {
  const producerMenu = (
    <React.Fragment>
      <ListItemButton onClick={() => store.setSelectedMenuOption("Productos")}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Productos" />
      </ListItemButton>
    </React.Fragment>
  );
  const driverMenu = (
    <React.Fragment>
      <ListItemButton onClick={() => store.setSelectedMenuOption("Subastas")}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Subastas" />
      </ListItemButton>
      <ListItemButton onClick={() => store.setSelectedMenuOption("Pedidos")}>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Pedidos" />
      </ListItemButton>
    </React.Fragment>
  );

  const consultantMenu = (
    <React.Fragment>
      <ListItemButton onClick={() => store.setSelectedMenuOption("Reportes")}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reportes" />
      </ListItemButton>
    </React.Fragment>
  );
  const commonMenu = (
    <React.Fragment>
      <ListItemButton onClick={() => store.setSelectedMenuOption("Perfil")}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Perfil" />
      </ListItemButton>
    </React.Fragment>
  );
  return (
    <>
      {user.rol_id === 3 && driverMenu}
      {user.rol_id === 4 && producerMenu}
      <Divider sx={{ my: 1 }} />
      {commonMenu}
    </>
  );
});

export default RenderMenuOptions;
