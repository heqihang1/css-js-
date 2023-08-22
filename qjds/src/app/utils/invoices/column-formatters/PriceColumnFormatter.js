import React from "react";
import { formateAmount } from "../../../utils/utils";

export const PriceColumnFormatter = (cellContent, row) => (
  <>${row.amount?.toFixed(2)}</>
);
