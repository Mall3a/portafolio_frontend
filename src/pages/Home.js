import React from "react";
import Layout from "../components/HomeContent/Layout";
import { Store } from "../store/Store";

const Home = () => {
  return (
    <>
      <Layout store={Store} />
    </>
  );
};

export default Home;
