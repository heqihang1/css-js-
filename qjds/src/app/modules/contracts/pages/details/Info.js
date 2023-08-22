import React from "react";
import ContractPDF from "../../../../components/contractPDF";

export default function Info({ productForEdit, isChinese }) {
  return <ContractPDF data={productForEdit} isChinese={isChinese} />;
}
