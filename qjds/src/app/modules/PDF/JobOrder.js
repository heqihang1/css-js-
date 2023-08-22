import React from "react";
import {toAbsoluteUrl} from "../../../_metronic/_helpers";
import JobOrderPDF from "../../components/jobOrderPDF.js"
export function JobOrder() {
  return (
    <JobOrderPDF isChinese={false} data={{}}></JobOrderPDF>
  );
}
