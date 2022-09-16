import React from "react";
import ManzanaIcon from "../../images/manzana.svg";
import PinaIcon from "../../images/pina.svg";
import PlatanoIcon from "../../images/platano.svg";
import ZanahoriaIcon from "../../images/zanahoria.svg";

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

  return (
    <img src={getImageSrc()} style={{ width: "50px", height: "50px" }}></img>
  );
};

export default ProductImage;
