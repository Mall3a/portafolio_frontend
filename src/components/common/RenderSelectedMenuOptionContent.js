import { observer } from "mobx-react-lite";
import * as React from "react";
import Auctions from "../driver/Auctions";
import Orders from "../client/Orders";

import Products from "../producer/Products";
import Profile from "../common/Profile";

import OrderRequests from "../client/OrderRequests";
import Vehicles from "../driver/Vehicles";
import AuctionOffers from "../driver/AuctionOffers";
import OrdersReports from "../consultant/OrdersReports";
import SoldProductsReports from "../consultant/SoldProductsReports";

const RenderSelectedMenuOptionContent = observer(({ store, user }) => {
  return (
    <>
      {store.selectedMenuOption === "Reportes de Pedidos" && (
        <OrdersReports user={user} />
      )}
      {store.selectedMenuOption === "Reportes de Productos" && (
        <SoldProductsReports user={user} />
      )}
      {store.selectedMenuOption === "Productos" && <Products user={user} />}
      {store.selectedMenuOption === "Subastas" && <Auctions user={user} />}
      {store.selectedMenuOption === "Transportes" && <Vehicles user={user} />}
      {store.selectedMenuOption === "Pedidos" && <Orders user={user} />}
      {store.selectedMenuOption === "Solicitudes Pedidos" && (
        <OrderRequests user={user} />
      )}
      {store.selectedMenuOption === "Perfil" && <Profile user={user} />}
      {store.selectedMenuOption === "Ofertas Subastas" && (
        <AuctionOffers user={user} />
      )}
    </>
  );
});
export default RenderSelectedMenuOptionContent;
