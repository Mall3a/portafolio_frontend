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
import {
  AccountCircle,
  AttachMoney,
  CarRental,
  DirectionsBus,
  Money,
  RequestPage,
} from "@mui/icons-material";
import AuctionIcon from "../../images/icons/auction.svg";
import ProductIcon from "../../images/icons/fruit-product.svg";

const RenderMenuOptions = observer(({ store, user }) => {
  const clientMenu = (
    <React.Fragment>
      <ListItemButton
        onClick={() => store.setSelectedMenuOption("Solicitudes Pedidos")}
        selected={store.selectedMenuOption === "Solicitudes Pedidos"}
      >
        <ListItemIcon>
          <RequestPage />
        </ListItemIcon>
        <ListItemText primary="Solicitudes Pedidos" />
      </ListItemButton>
      <ListItemButton
        onClick={() => store.setSelectedMenuOption("Pedidos")}
        selected={store.selectedMenuOption === "Pedidos"}
      >
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Pedidos" />
      </ListItemButton>
    </React.Fragment>
  );

  const producerMenu = (
    <React.Fragment>
      <ListItemButton
        onClick={() => store.setSelectedMenuOption("Productos")}
        selected={store.selectedMenuOption === "Productos"}
      >
        <ListItemIcon>
          <img
            src={ProductIcon}
            style={{
              width: "20px",
              height: "20px",
              opacity: "0.5",
            }}
          ></img>
        </ListItemIcon>
        <ListItemText primary="Productos" />
      </ListItemButton>
    </React.Fragment>
  );
  const driverMenu = (
    <React.Fragment>
      <ListItemButton
        onClick={() => store.setSelectedMenuOption("Subastas")}
        selected={store.selectedMenuOption === "Subastas"}
      >
        <ListItemIcon>
          <img
            src={AuctionIcon}
            style={{
              width: "30px",
              height: "25px",
              opacity: "0.5",
            }}
          ></img>
        </ListItemIcon>
        <ListItemText primary="Subastas" />
      </ListItemButton>
      <ListItemButton
        onClick={() => store.setSelectedMenuOption("Ofertas Subastas")}
        selected={store.selectedMenuOption === "Ofertas Subastas"}
      >
        <ListItemIcon>
          <AttachMoney />
        </ListItemIcon>
        <ListItemText primary="Ofertas Subastas" />
      </ListItemButton>

      <ListItemButton
        onClick={() => store.setSelectedMenuOption("Pedidos Asignados")}
        selected={store.selectedMenuOption === "Pedidos Asignados"}
      >
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Pedidos Asignados" />
      </ListItemButton>
      <ListItemButton
        onClick={() => store.setSelectedMenuOption("Transportes")}
        selected={store.selectedMenuOption === "Transportes"}
      >
        <ListItemIcon>
          <DirectionsBus></DirectionsBus>
        </ListItemIcon>
        <ListItemText primary="Transportes" />
      </ListItemButton>
    </React.Fragment>
  );

  const consultantMenu = (
    <React.Fragment>
      <ListItemButton
        onClick={() => store.setSelectedMenuOption("Reportes de Productos")}
        selected={store.selectedMenuOption === "Reportes de Productos"}
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reportes de Productos" />
      </ListItemButton>
      <ListItemButton
        onClick={() => store.setSelectedMenuOption("Reportes de Pedidos")}
        selected={store.selectedMenuOption === "Reportes de Pedidos"}
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reportes de Pedidos" />
      </ListItemButton>
    </React.Fragment>
  );
  const commonMenu = (
    <React.Fragment>
      <ListItemButton
        onClick={() => store.setSelectedMenuOption("Perfil")}
        selected={store.selectedMenuOption === "Perfil"}
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        <ListItemText primary="Perfil" />
      </ListItemButton>
    </React.Fragment>
  );
  return (
    <>
      {user.rol_id === 2 && consultantMenu}
      {user.rol_id === 3 && driverMenu}
      {user.rol_id === 4 && producerMenu}
      {user.rol_id === 5 && clientMenu}
      {user.rol_id === 6 && clientMenu}
      <Divider sx={{ my: 1 }} />
      {commonMenu}
    </>
  );
});

export default RenderMenuOptions;
