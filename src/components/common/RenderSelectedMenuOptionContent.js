import { observer } from "mobx-react-lite";
import * as React from "react";
import Auctions from "../driver/Auctions";
import Orders from "../common/Orders";

import Products from "../producer/Products";
import Profile from "../common/Profile";

const RenderSelectedMenuOptionContent = observer(({ store, user }) => {
  return (
    <>
      {store.selectedMenuOption === "Productos" && <Products user={user} />}
      {store.selectedMenuOption === "Subastas" && <Auctions />}
      {store.selectedMenuOption === "Pedidos" && <Orders />}
      {store.selectedMenuOption === "Perfil" && <Profile user={user} />}
    </>
  );
});
export default RenderSelectedMenuOptionContent;
