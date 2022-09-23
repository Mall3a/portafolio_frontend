import { observer } from "mobx-react-lite";
import * as React from "react";
import Auctions from "../driver/Auctions";
import Orders from "../common/Orders";

import Products from "../producer/Products";
import Profile from "../common/Profile";
import Reports from "../consultant/Reports";
import OrderRequests from "../client/OrderRequests";
import Vehicles from "../driver/Vehicles";
import AuctionOffers from "../driver/AuctionOffers";

const RenderSelectedMenuOptionContent = observer(({ store, user }) => {
  return (
    <>
      {store.selectedMenuOption === "Reportes" && <Reports user={user} />}
      {store.selectedMenuOption === "Productos" && <Products user={user} />}
      {store.selectedMenuOption === "Subastas" && <Auctions />}
      {store.selectedMenuOption === "Vehículos" && <Vehicles />}
      {store.selectedMenuOption === "Pedidos" && <Orders />}
      {store.selectedMenuOption === "Solicitudes Pedidos" && <OrderRequests />}
      {store.selectedMenuOption === "Perfil" && <Profile user={user} />}
      {store.selectedMenuOption === "Ofertas Subastas" && (
        <AuctionOffers user={user} />
      )}
    </>
  );
});
export default RenderSelectedMenuOptionContent;
