import React from "react";

export const PriceColumnFormatter = (cellContent, row) => (
  <>${row?.amount?.toFixed(2)}</>
);
