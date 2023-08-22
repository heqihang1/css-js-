/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../_redux/quotes/quotesActions";
import { Card } from "../../../../_metronic/_partials/controls";
import Info from "./details/Info";
import SuccessErrorAlert from "./../../../components/SuccessErrorAlert";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import Actions from "./details/Actions";
import { quoteStatuses } from "../partials/statuses";
import { approvequotation, rejectquotation, approveSpecialEdit, rejectSpecialEdit } from "../_redux/quotes/quotesCrud";
import ConfirmModal from "./ConfirmModal";
import { API_URL } from "../../../API_URL";
import axios from "axios";

const initProduct = {
  quotation_no: "",
  createdAt: "",
  customer_id: {},
  places: [],
  contact_person: {},
  payment_term_id: {},
  status: "",
  customer_office_worker: "",
  services: [],
  remark_id: {},
};

export function Details({
  match: {
    params: { id },
  },
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [quoteConfirm, setQuoteConfirm] = useState({});
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });
  const [isChinese, setIsChenese] = useState(false);
  const [generatePDFLoader, setGeneratePDFLoader] = useState(false);

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const { actionsLoading, productForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.quotations.actionsLoading,
      productForEdit: state.quotations.quotationForEdit,
    }),
    shallowEqual
  );
  const approveThisQuote = async () => {
    await approvequotation(productForEdit._id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Quatation approved successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 3000);
        dispatch(actions.fetchquotation(id));
      })
      .catch((err) => {
        let myerr = err.response.data.message;
        setisSuccess({
          success: 1,
          message: myerr || "An unknown error occured",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 5000);
      });
  };

  //reject quote
  const rejectThisQuote = async () => {
    await rejectquotation(productForEdit._id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Quatation rejected successfully",
        });

        setTimeout(() => {
          history.push("/quotes/all"); // GO BACK TO QUOTATION LIST
        }, 1000);
      })
      .catch((err) => {
        let myerr = err.response.data.message;
        setisSuccess({
          success: 1,
          message: myerr || "An unknown error occured",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 5000);
      });
  };
  
  let approveThisSpecialEdit = async () => {
    await approveSpecialEdit(productForEdit._id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Quotation approved successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 3000);
        dispatch(actions.fetchquotation(id));
      })
      .catch((err) => {
        let myerr = err.response.data.message;
        setisSuccess({
          success: 1,
          message: myerr || "An unknown error occured",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 5000);
      });
  };

  let rejectThisSpecialEdit = async () => {
    await rejectSpecialEdit(productForEdit._id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Quotation rejected successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 3000);
        dispatch(actions.fetchquotation(id));
      })
      .catch((err) => {
        let myerr = err.response.data.message;
        setisSuccess({
          success: 1,
          message: myerr || "An unknown error occured",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 5000);
      });
  };

  function getTotal(services) {
    let total = 0;
    for (let service of services) {
      total +=
        service.feet *
        Number(service?.price || 0) *
        ((100 - Number(service.discount)) / 100);
    }
    return total.toFixed(2);
  }

  let confirmQuote = (id) => {
    let quote = {
      ...productForEdit,
    };
    setQuoteConfirm(quote);
    setIsConfirmDialogOpen(true);
  };

  useEffect(() => {
    dispatch(actions.fetchquotation(id));
  }, [id, dispatch]);

  const downloadClickPDF = (isChina) => {
    setGeneratePDFLoader(true);
    setIsChenese(isChina);
    setTimeout(() => {
      if (document.getElementById("url_form")) {
        document.getElementById("url_form").submit();
      }
      //window.print();
      let post_data = {
        html: document.getElementById("quotation-pdf-component")
          ? document.getElementById("quotation-pdf-component").innerHTML
          : "",
        url: `${window.location.origin}/pdf/quotation`,
        quotation_no: productForEdit.quotation_no,
        is_chinese: isChina,
      };
      axios
        .post(API_URL + "/pdf/quotation", post_data, {
          responseType: "blob", // VERY IMPORTANT
          headers: { Accept: "application/pdf" },
        })
        .then((res) => {
          console.log(res.data);
          var downloadLink = document.createElement("a");
          downloadLink.target = "_blank";
          downloadLink.download = `${productForEdit.quotation_no}.pdf`;
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
        });
    }, 500);
  };

  useEffect(() => {
    if (document.getElementsByClassName("container").length > 0) {
      document
        .getElementsByClassName("container")[0]
        .setAttribute("class", "container-fluid");
    }
  }, []);

  function refreshPage() {
    dispatch(actions.fetchquotation(id));
  }

  return (
    <>
      {isSuccess.success !== 0 && (
        <SuccessErrorAlert isSuccess={isSuccess} setisSuccess={setisSuccess} />
      )}
      <ConfirmModal
        show={isConfirmDialogOpen}
        doc={quoteConfirm}
        onHide={() => setIsConfirmDialogOpen(false)}
      />

      <Card>{actionsLoading && <ModalProgressBar />}</Card>

      <div className="row">
        { productForEdit?.status == quoteStatuses.CLIENT_REJECTED ? <div className="col-lg-12 text-danger mb-2">
          Reject Reason: {productForEdit?.reject_reason}
        </div> : '' }
        <div className="col-lg-7">
          <Info
            productForEdit={productForEdit || initProduct}
            isChinese={isChinese}
            downloadClickPDF={downloadClickPDF}
          />
        </div>
        <div className="col-lg-5 contract-right-side">
          { (!params.isHistory) ? <Actions
            isChinese={isChinese}
            setIsChenese={downloadClickPDF}
            productForEdit={productForEdit || initProduct}
            approveQuote={approveThisQuote}
            rejectQuote={rejectThisQuote}
            approveSpecialEdit={approveThisSpecialEdit}
            rejectSpecialEdit={rejectThisSpecialEdit}
            confirmQuote={confirmQuote}
            generatePDFLoader={generatePDFLoader}
            refreshPage={refreshPage}
          /> : '' }
        </div>
      </div>
    </>
  );
}
