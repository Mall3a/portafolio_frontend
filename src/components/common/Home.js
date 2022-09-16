import React from "react";
import { Store } from "../../store/Store";
import Layout from "./Layout";

const Home = () => {
  return (
    <>
      <Layout store={Store} />
    </>
  );
};

export default Home;
