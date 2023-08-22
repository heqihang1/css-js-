import React, {useEffect} from "react";
import {toAbsoluteUrl} from "../../../_metronic/_helpers";
import InvoicePDF from "../../components/InvoicePDF.js"
export function Invoice() {
  return (
    <InvoicePDF isChinese={false} data={{}}></InvoicePDF>
  );
}
