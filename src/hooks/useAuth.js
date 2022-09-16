import React from "react";
import AuthContext from "../components/common/AuthProvider";

export const useAuth = () => {
  return React.useContext(AuthContext);
};
