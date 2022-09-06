import React from "react";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { auth } = useAuth();

  return (
    <>
      <h2>Home (Protected)</h2>

      <div>Authenticated as {auth.nombre}</div>

      {auth && <button type="button">Sign Out</button>}
    </>
  );
};

export default Home;
