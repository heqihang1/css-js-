import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import {
  approveJobOrder,
  rejectJobOrder,
  editJobOrder,
} from "../../_redux/job/jobCrud";
import SuccessErrorAlert from "./../../../../components/SuccessErrorAlert";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import JobOrderPDF from "../../../../components/jobOrderPDF";
import JobOrderActions from "./actions";
import { API_URL } from "../../../../API_URL";
import axios from "axios";

const JobsDetails = () => {
  const history = useHistory();
  const [isChinese, setIsChenese] = useState(false);
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });
  const [generatePDFLoader, setGeneratePDFLoader] = useState(false);
  const [printLoader, setPrintLoader] = useState(false);
  const [serviceVisitNote, setServiceVisitNote] = useState("");

  const { productForEdit } = useSelector(
    (state) => ({
      productForEdit: state.job.productForEdit,
    }),
    shallowEqual
  );

  const downloadClickPDF = (isChina) => {
    setGeneratePDFLoader(true);
    setIsChenese(isChina);
    setTimeout(() => {
      if (document.getElementById("url_form")) {
        document.getElementById("url_form").submit();
      }
      //window.print();
      let post_data = {
        html: document.getElementById("job-order-pdf-component")
          ? document.getElementById("job-order-pdf-component").innerHTML
          : "",
        url: `${window.location.origin}/pdf/job-order`,
        job_no: productForEdit.job_no,
        is_chinese: isChina,
      };
      axios
        .post(API_URL + "/pdf/job-order", post_data, {
          responseType: "blob", // VERY IMPORTANT
          headers: { Accept: "application/pdf" },
        })
        .then((res) => {
          console.log(res.data);
          var downloadLink = document.createElement("a");
          downloadLink.target = "_blank";
          downloadLink.download = `${productForEdit.job_no}.pdf`; //'job-order.pdf';
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

  const printJob = () => {
    setIsChenese(true);
    setPrintLoader(true)
    setTimeout(() => {
      let post_data = {
        html: document.getElementById("job-order-pdf-component")
          ? document.getElementById("job-order-pdf-component").innerHTML
          : "",
        url: `${window.location.origin}/pdf/job-order`,
        job_no: productForEdit.job_no,
        is_chinese: true,
      };
      axios
        .post(API_URL + "/pdf/job-order", post_data, {
          responseType: "blob", // VERY IMPORTANT
          headers: { Accept: "application/pdf" },
        })
        .then((res) => {
          console.log(res.data);
          var blob = new Blob([res.data], {type: 'application/pdf'}); //this make the magic
          var blobURL = URL.createObjectURL(blob);

          var iframe =  document.createElement('iframe'); //load content in an iframe to print later
          document.body.appendChild(iframe);

          iframe.style.display = 'none';
          iframe.src = blobURL;
          iframe.onload = function() {
            setTimeout(function() {
              iframe.focus();
              iframe.contentWindow.print();
            }, 1);
          };
          setPrintLoader(false)
        });
    }, 500);
  };

  // APPROVE JOB ORDER
  const approveJobOrderFunc = async () => {
    await approveJobOrder(productForEdit._id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "job order approved successfully",
        });
        setTimeout(() => {
          history.push("/jobs/all"); // GO BACK TO JOBS LIST
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

  // REJECT JOB ORDER
  const rejectJobOrderFunc = async () => {
    await rejectJobOrder(productForEdit._id)
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "job order rejected successfully",
        });

        setTimeout(() => {
          history.push("/jobs/all"); // GO BACK TO JOBS LIST
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

  const saveJobOrderFunc = async () => {
    await editJobOrder({
      id: productForEdit._id,
      service_visit_notes: serviceVisitNote,
    })
      .then((res) => {
        setisSuccess({
          success: 2,
          message: "Job order saved successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 5000);
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

  function changeServiceNoteFunc(val) {
    setServiceVisitNote(val);
  }

  useEffect(() => {
    if (document.getElementsByClassName("container").length > 0) {
      document
        .getElementsByClassName("container")[0]
        .setAttribute("class", "container-fluid");
    }
    setServiceVisitNote(productForEdit?.service_visit_notes);
  }, []);

  useEffect(() => {
    setServiceVisitNote(productForEdit?.service_visit_notes);
  }, [productForEdit]);

  return (
    <>
      {isSuccess.success !== 0 && (
        <SuccessErrorAlert isSuccess={isSuccess} setisSuccess={setisSuccess} />
      )}
      <div className="row">
        <div className="col-lg-7">
          <JobOrderPDF
            isChinese={isChinese}
            serviceVisitNote={serviceVisitNote}
            data={productForEdit || null}
            changeServiceNote={changeServiceNoteFunc}
          />
        </div>
        <div className="col-lg-5 contract-right-side">
          <JobOrderActions
            isChinese={isChinese}
            setIsChenese={downloadClickPDF}
            productForEdit={productForEdit || null}
            approveJobOrder={approveJobOrderFunc}
            saveJobOrder={saveJobOrderFunc}
            rejectJobOrder={rejectJobOrderFunc}
            generatePDFLoader={generatePDFLoader}
            printLoader={printLoader}
            printJob={printJob}
          />
        </div>
      </div>
    </>
  );
};

export default JobsDetails;
