import React from "react";
import { formateAmount } from '../../utils'

export const PriceColumnFormatter = (cellContent, row) => (
  <>{formateAmount(cellContent)}</>
);
