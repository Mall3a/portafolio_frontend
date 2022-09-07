import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Toolbar from "@mui/material/Toolbar";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LogoHorizontal from "../../images/logo_h.svg";
import styles from "./ResponsiveDrawer.module.scss";

const drawerWidth = 240;

const ResponsiveDrawer = observer(({ window }) => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    setAuth(null);
    navigate("/login");
    localStorage.clear();
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  let [verPedidosTransportista, setVerPedidosTransportista] = useState(false);
  let [verSubastas, setVerSubastas] = useState(false);
  let [renderMenuOptionContent, setRenderMenuOptionContent] = useState(
    <>Seleccione una de las opciones de menú para comenzar</>
  );

  useEffect(() => {
    if (verPedidosTransportista) {
      setRenderMenuOptionContent(<>Pedidos Asignados</>);
    }
    if (verSubastas) {
      setRenderMenuOptionContent(<>Subastas Publicadas</>);
    }

    //limpiar variables
    setVerPedidosTransportista(false);
    setVerSubastas(false);
  }, [verPedidosTransportista, verSubastas]);

  const menuTransportista = (
    <List>
      <ListItem
        disablePadding
        //selected={verSubastas}
        onClick={() => setVerSubastas(true)}
      >
        <ListItemButton>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Ver Subastas" />
        </ListItemButton>
      </ListItem>
      <ListItem
        disablePadding
        //selected={verPedidosTransportista}
        onClick={() => setVerPedidosTransportista(true)}
      >
        <ListItemButton>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Ver Pedidos" />
        </ListItemButton>
      </ListItem>
    </List>
  );

  const drawer = (
    <div>
      <Toolbar>
        <img
          className={styles.logoHorizontal}
          src={LogoHorizontal}
          alt="Maipo Grande Logo"
        />
      </Toolbar>
      <Divider />
      {auth.token.rol_id === 3 && menuTransportista}
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {auth && (
            <div>
              Bienvenido {auth.token.nombre} {auth.token.apellido_paterno} -{" "}
              {auth.token.nombre_rol}
            </div>
          )}
          {auth && (
            <IconButton color="inherit" onClick={handleLogOut}>
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {renderMenuOptionContent}
      </Box>
    </Box>
  );
});

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
