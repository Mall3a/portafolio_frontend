import React from "react";
import OrderRequestForm from "./OrderRequestForm";

const OrderRequests = ({ user }) => {
  return (
    <>
      <OrderRequestForm user={user}></OrderRequestForm>
    </>
  );
};

export default OrderRequests;
