import { Star, StarBorder } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "./Quality.module.scss";

const Quality = ({ value, onChange, readOnly }) => {
  let [quality, setQuality] = useState(value);

  useEffect(() => {
    if (!readOnly) onChange(quality);
  }, [readOnly, onChange, quality]);

  return (
    <div>
      {!readOnly && <label>Calidad:</label>}
      <div className={styles.container}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => !readOnly && setQuality(1)}
          style={{ alignSelf: "end" }}
        >
          {quality >= 1 ? <Star /> : <StarBorder />}
        </IconButton>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => !readOnly && setQuality(2)}
          style={{ alignSelf: "end" }}
        >
          {quality >= 2 ? <Star /> : <StarBorder />}
        </IconButton>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => !readOnly && setQuality(3)}
          style={{ alignSelf: "end" }}
        >
          {quality >= 3 ? <Star /> : <StarBorder />}
        </IconButton>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => !readOnly && setQuality(4)}
          style={{ alignSelf: "end" }}
        >
          {quality >= 4 ? <Star /> : <StarBorder />}
        </IconButton>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => !readOnly && setQuality(5)}
          style={{ alignSelf: "end" }}
        >
          {quality >= 5 ? <Star /> : <StarBorder />}
        </IconButton>
      </div>
    </div>
  );
};

export default Quality;
