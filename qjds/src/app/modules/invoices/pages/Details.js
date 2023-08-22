/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router-dom";
// import * as actions from "../../quotes/_redux/quotes/quotesActions";
import * as invoiceActions from "../../invoices/_redux/invoice/invoiceActions";
import { Card } from "../../../../_metronic/_partials/controls";
import Info from "./details/Info";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import Actions from "./details/Actions";
import SuccessErrorAlert from "../../../components/SuccessErrorAlert";
import {
  approveInvoice,
  rejectInvoice,
} from "../../invoices/_redux/invoice/invoiceCrud";
import { API_URL } from "../../../API_URL";
// import ConfirmModal from "../../quotes/pages/ConfirmModal";

// const initProduct = {
//   quotation_no: "",
//   createdAt: "",
//   customer_id: {},
//   places: [],
//   contact_person: {},
//   payment_term_id: {},
//   status: "",
//   customer_office_worker: "",
//   services: [],
//   remark_id: {},
// };
// console.log("initProduct", initProduct);

export function Details({
  match: {
    params: { id },
  },
}) {
  const history = useHistory();
  const [actionsLoading, setActionsLoading] = useState(false);
  const [productForEdit, setProductForEdit] = useState("");
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });
  const [isChinese, setIsChenese] = useState(false);
  const [generatePDFLoader, setGeneratePDFLoader] = useState(false);
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false)
  const [editPDFLoader, setEditPDFLoader] = useState(false)
  const [isContain, setIsContain] = useState(false)

  // const fmtToHump = (value) => {
  //   return value.replace(/(?<!PayMe\s:\s)MasterClean\sHygiene\sSolution\sLimited/g,
  //     (_, letter) => 'MasterClean Carpet Systems Limited')
  // }

  function getInvoiceDetails() {
    setActionsLoading(true);
    dispatch(invoiceActions.fetchInvoice(id)).then((res) => {
      setProductForEdit(res.data);
      setActionsLoading(false);
      // 包含该字符便能设置更改
      if (res.data?.payment_term_id?.payment_method_content
        .indexOf('MasterClean Hygiene Solution Limited') != -1) {
        setIsContain(true)
      }

    });
  }

  useEffect(() => {
    getInvoiceDetails();
  }, [id]);

  let [showProgress, setShowProgress] = React.useState(false);
  const approveThisInvoice = async () => {
    setShowProgress(true);
    await approveInvoice(productForEdit._id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Invoice approved successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
          setShowProgress(false);
          history.push("/invoices/payments-pending");
        }, 3000);
      })
      .catch((err) => {
        setShowProgress(false);
        console.log(err);
      });
  };

  const rejectThisInvoice = async () => {
    setShowProgress(true);
    await rejectInvoice(productForEdit._id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Invoice rejected successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
          setShowProgress(false);
          history.push("/invoices/all");
        }, 3000);
      })
      .catch((err) => {
        setShowProgress(false);
        console.log(err);
      });
  };

  // function getTotal(services) {
  //   let total = 0;
  //   for (let service of services) {
  //     total +=
  //       service.feet *
  //       Number(service?.price || 0) *
  //       ((100 - Number(service.discount)) / 100);
  //   }
  //   return total.toFixed(2);
  // }

  // let confirmInvoice = (id) => {
  //   let quote = {
  //     ...productForEdit,
  //     amount: getTotal(productForEdit.services),
  //   };
  //   setInvoiceConfirm(quote);
  //   setIsConfirmDialogOpen(true);
  // };

  // const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  // const [invoiceConfirm, setInvoiceConfirm] = React.useState({});

  const downloadClickPDF = (isChina) => {
    setGeneratePDFLoader(true);
    setIsChenese(isChina);
    // setTimeout(() => {
    //   window.print();
    // }, 10);
    pdfChange(isChina)
  };

  const oldCompanyNamePDFChange = (date) => {
    // editBool && isEdit时则下载变更后 pdf
    const obj = JSON.parse(JSON.stringify(date))
    setIsEdit(true)
    setEditPDFLoader(true)
    pdfChange(obj.bool, obj.editBool)
  }

  const pdfChange = (isChina, editBool) => {
    setTimeout(() => {
      // if (document.getElementById("url_form")) {
      //   document.getElementById("url_form").submit();
      // }
      //window.print();
      const htmlInfo = document.getElementById("invoice-pdf-component")

      let post_data = {
        html: htmlInfo
          ? editBool && isContain
            ? (htmlInfo.innerHTML).replace(/(?<!PayMe\s:\s)MasterClean\sHygiene\sSolution\sLimited/g,
              (_, letter) => 'MasterClean Carpet Systems Limited')
            : htmlInfo.innerHTML
          : "",
        url: `${window.location.origin}/pdf/invoice`,
        invoice_no: productForEdit.invoice_no,
        is_chinese: isChina,
      };
      const params = {
        ...post_data,
        html: editBool && isContain && post_data.html.indexOf('PayMe : MasterClean Hygiene Solution Ltd') !== -1
          ? post_data.html.replace(/([1-9].\sPayMe\s|PayMe\s):\sMasterClean\sHygiene\sSolution(\sLtd\.|\sLtd)/g, (_, letter) => '')
          : post_data.html
      }
      axios
        .post(API_URL + "/pdf/invoice", params, {
          responseType: "blob", // VERY IMPORTANT
          headers: { Accept: "application/pdf" },
        })
        .then((res) => {
          console.log(res.data);
          var downloadLink = document.createElement("a");
          downloadLink.target = "_blank";
          downloadLink.download = `${productForEdit.invoice_no}.pdf`;
          // convert downloaded data to a Blob
          var blob = new Blob([res.data], { type: "application/pdf" });
          // create an object URL from the Blob
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);
          // set object URL as the anchor's href
          downloadLink.href = downloadUrl;
          // append the anchor to document body
          document.body.append(downloadLink);
          // fire a click event on the anchor
          downloadLink.click();
          // cleanup: remove element and revoke object URL
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(downloadUrl);
          setGeneratePDFLoader(false);
          setEditPDFLoader(false)
          setIsEdit(false)
        });
    }, 500);
  }


  useEffect(() => {
    if (document.getElementsByClassName("container").length > 0) {
      document
        .getElementsByClassName("container")[0]
        .setAttribute("class", "container-fluid");
    }
  }, []);

  return (
    <>
      {isSuccess.success !== 0 && (
        <SuccessErrorAlert isSuccess={isSuccess} setisSuccess={setisSuccess} />
      )}
      {showProgress && <ModalProgressBar />}
      <Card>{actionsLoading && <ModalProgressBar />}</Card>
      <div className="row">
        <div className="col-lg-7">
          {productForEdit ? (
            <Info
              productForEdit={productForEdit}
              isChinese={isChinese}
              downloadClickPDF={downloadClickPDF}
              isEdit={isEdit}
            />
          ) : (
            ""
          )}
        </div>
        <div className="col-lg-5">
          {productForEdit ? (
            <Actions
              reloadInvoice={getInvoiceDetails}
              isChinese={isChinese}
              setIsChenese={downloadClickPDF}
              isEdit={isEdit}
              setIsEdit={oldCompanyNamePDFChange}
              editPDFLoader={editPDFLoader}
              productForEdit={productForEdit}
              approveInvoice={approveThisInvoice}
              rejectInvoice={rejectThisInvoice}
              generatePDFLoader={generatePDFLoader}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
