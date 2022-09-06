import React from "react";
import AuthContext from "../AuthProvider";

export const useAuth = () => {
  return React.useContext(AuthContext);
};
