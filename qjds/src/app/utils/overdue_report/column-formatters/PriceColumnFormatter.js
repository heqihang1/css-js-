import React from "react";
import { formateAmount } from '../../../utils/utils'

export const PriceColumnFormatter = (cellContent, row) => (
  <>{formateAmount(row?.amount - row?.paid_amount)}</>
);
