import React from "react";

export const ColorColumnFormatter = (cellContent, row) => (
  <div
    style={{ backgroundColor: row.color, width: "15px", height: "15px" }}
  ></div>
);
