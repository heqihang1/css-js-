import React from "react";

export const PriceColumnFormatter = (cellContent, row) => (
  <>${ parseFloat(row?.total).toFixed(2) }</>
);
