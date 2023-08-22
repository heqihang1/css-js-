import React from "react";
import {toAbsoluteUrl} from "../../../_metronic/_helpers";
import QuotationPDF from "../../components/quotationPDF"
export function Quotations() {
  return (
    <QuotationPDF isChinese={false} data={{
      quotation_no: "",
      amount: "",
      issueDate:"",
      create_date: "",
      customer_id: "",
      places: [],
      contact_person: "",
      payment_term_id: "",
      customer_office_worker: "",
      services: [],
      remark_desc: ""
    }}></QuotationPDF>
  );
}
