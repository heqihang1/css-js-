import React from "react";
import {toAbsoluteUrl} from "../../../_metronic/_helpers";
import ContractPDF from "../../components/contractPDF"
export function Contracts() {
  return (
    <ContractPDF isChinese={false} data={{
      contract_no: "",
      contract_amount: "",
      issueDate:"",
      create_date: "",
      customer_id: "",
      places: [],
      contact_person: "",
      payment_term_id: "",
      customer_office_worker: "",
      services: [],
      remark_desc: ""
    }}></ContractPDF>
  );
}
