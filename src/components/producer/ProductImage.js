import { Avatar } from "@mui/material";
import React from "react";
import ManzanaIcon from "../../images/fruits/manzana.svg";
import PinaIcon from "../../images/fruits/pina.svg";
import PlatanoIcon from "../../images/fruits/platano.svg";
import ZanahoriaIcon from "../../images/fruits/zanahoria.svg";

const ProductImage = ({ productName }) => {
  const getImageSrc = () => {
    let src = "";

    switch (productName) {
      case "Manzana":
        src = ManzanaIcon;
        break;
      case "Zanahoria":
        src = ZanahoriaIcon;
        break;
      case "Platano":
        src = PlatanoIcon;
        break;
      case "Pina":
        src = PinaIcon;
        break;

      default:
        break;
    }
    return src;
  };

  return <img src={getImageSrc()} style={{ width: 50, height: 50 }} />;
  //<Avatar src={getImageSrc()} sx={{ width: 56, height: 56 }} />;
};

export default ProductImage;
