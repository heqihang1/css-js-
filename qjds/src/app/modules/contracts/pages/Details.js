/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../_redux/contracts/contractsActions";
import { Card } from "../../../../_metronic/_partials/controls";
import Info from "./details/Info";
import SuccessErrorAlert from "./../../../components/SuccessErrorAlert";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
import Actions from "./details/Actions";
import { contractStatuses } from "../partials/statuses";
import {
  approvecontract,
  rejectcontract,
  approveSpecialEdit,
  rejectSpecialEdit
} from "../_redux/contracts/contractsCrud";
import ConfirmModal from "./ConfirmModal";
import TerminateModal from "./TerminateModal";
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
  const history = useHistory();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isTerminateDialogOpen, setIsTerminateDialogOpen] = useState(false);
  const [contractConfirm, setContractConfirm] = useState({});
  const [contractTerminate, setContractTerminate] = useState({});
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });
  const [isChinese, setIsChenese] = useState(false);
  const [generatePDFLoader, setGeneratePDFLoader] = useState(false);
  const dispatch = useDispatch();

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const { actionsLoading, productForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.contracts.actionsLoading,
      productForEdit: state.contracts.contractForEdit,
    }),
    shallowEqual
  );

  let approveThisContract = async () => {
    await approvecontract(productForEdit._id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Contract approved successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 3000);
        dispatch(actions.fetchcontract(id));
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

  // reject quote
  let rejectThisContract = async () => {
    await rejectcontract(productForEdit._id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Contract rejected successfully",
        });

        setTimeout(() => {
          history.push("/contracts/all"); // GO BACK TO CONTRACT LIST
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
          message: "Contract approved successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 3000);
        dispatch(actions.fetchcontract(id));
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
          message: "Contract rejected successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 3000);
        dispatch(actions.fetchcontract(id));
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

  // 这里逻辑是通过详情页中 -> 点击Approve生成 -> 点击Confirm signed contract跳转【原有逻辑为弹窗
  let confirmContract = (id, flag = true) => {
    // history.push(`/contracts/${id}/to-be-confirm/${flag}`);   // 拆分工作单新功能
    let contract = {
      ...productForEdit,
      amount: getTotal(productForEdit.services),
    };
    setContractConfirm(contract);
    setIsConfirmDialogOpen(true);
  };

  let terminateContract = () => {
    setContractTerminate(productForEdit);
    setIsTerminateDialogOpen(true);
  };


  useEffect(() => {
    dispatch(actions.fetchcontract(id));
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
        html: document.getElementById("contract-pdf-component")
          ? document.getElementById("contract-pdf-component").innerHTML
          : "",
        url: `${window.location.origin}/pdf/contract`,
        contract_no: productForEdit.contract_no,
        is_chinese: isChina,
      };
      axios
        .post(API_URL + "/pdf/contract", post_data, {
          responseType: "blob", // VERY IMPORTANT
          headers: { Accept: "application/pdf" },
        })
        .then((res) => {
          console.log(res.data);
          var downloadLink = document.createElement("a");
          downloadLink.target = "_blank";
          downloadLink.download = `${productForEdit.contract_no}.pdf`;
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
    dispatch(actions.fetchcontract(id));
  }

  return (
    <>
      {isSuccess.success !== 0 && (
        <SuccessErrorAlert isSuccess={isSuccess} setisSuccess={setisSuccess} />
      )}
      <ConfirmModal
        show={isConfirmDialogOpen}
        doc={contractConfirm}
        onHide={() => setIsConfirmDialogOpen(false)}
      />
      <TerminateModal
        show={isTerminateDialogOpen}
        doc={contractTerminate}
        onHide={() => setIsTerminateDialogOpen(false)}
        refreshPage={refreshPage}
      />
      <Card>{actionsLoading && <ModalProgressBar />}</Card>
      <div className="row">
        {productForEdit?.status == contractStatuses.CLIENT_REJECTED ? <div className="col-lg-12 text-danger mb-2">
          Reject Reason: {productForEdit?.reject_reason}
        </div> : ''}
        {productForEdit?.status == contractStatuses.TERMINATED ? <div className="col-lg-12 text-danger mb-2">
          Termination Reason: {productForEdit?.terminate_reason}
        </div> : ''}
        <div className="col-lg-7">
          <Info
            productForEdit={productForEdit || initProduct}
            isChinese={isChinese}
            downloadClickPDF={downloadClickPDF}
          />
        </div>
        <div className="col-lg-5 contract-right-side">
          {(!params.isHistory) ? <Actions
            isChinese={isChinese}
            setIsChenese={downloadClickPDF}
            productForEdit={productForEdit || initProduct}
            approveContract={approveThisContract}
            rejectContract={rejectThisContract}
            approveSpecialEdit={approveThisSpecialEdit}
            rejectSpecialEdit={rejectThisSpecialEdit}
            confirmContract={confirmContract}
            terminateContract={terminateContract}
            generatePDFLoader={generatePDFLoader}
            refreshPage={refreshPage}
          /> : ''}
        </div>
      </div>
    </>
  );
}
