import { observer } from "mobx-react-lite";
import * as React from "react";

import Products from "./Producer/Products";
import Profile from "./Profile";

const RenderSelectedMenuOptionContent = observer(({ store, user }) => {
  return (
    <>
      {store.selectedMenuOption === "Productos" && <Products user={user} />}
      {store.selectedMenuOption === "Perfil" && <Profile user={user} />}
    </>
  );
});
export default RenderSelectedMenuOptionContent;
