import React from "react";
import ResponsiveDrawer from "./ResponsiveDrawer";

const Layout = ({ children }) => {
  return (
    <>
      <ResponsiveDrawer>
        <main>{children}</main>
      </ResponsiveDrawer>
    </>
  );
};

export default Layout;
