import React from "react";
import QotationPDF from "../../../../components/quotationPDF";

export default function Info({ productForEdit, isChinese }) {
  return <QotationPDF data={productForEdit} isChinese={isChinese} />;
}
