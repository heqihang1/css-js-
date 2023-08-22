import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ReactHTMLParser from "react-html-parser";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../invoices/_redux/invoice/invoiceActions";
import * as quoteActions from "../../_redux/quotes/quotesActions";
import * as jobActions from "../../../jobs/_redux/job/jobActions";
import { reuseJob } from "../../../jobs/_redux/job/jobCrud";
import GenereateInvoicePDF from "../../../../components/InvoicePDF";
import { createJobOrder } from "../../_redux/quotes/quotesCrud";
import UploadDocumentModal from "../UploadDocumentModal";
import SalesRemarkModal from "../SalesRemarkModal";
import {
  Card,
  CardBody,
  Input,
} from "../../../../../_metronic/_partials/controls";
import { quoteStatuses } from "../../partials/statuses";
import { invoiceStatuses } from "../../../invoices/partials/statuses";
import { formateAmount } from "../../../../utils/utils";
import {
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
  Row,
  Col,
  FormLabel,
} from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import JobOrderPDF from "../../../../components/jobOrderPDF";
import SVG from "react-inlinesvg";
import { API_URL } from "../../../../API_URL";
import { Field, Form, Formik } from "formik";
import SelectFilter from "react-select";
import axios from "axios";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Font,
  usePDF,
  Image,
} from "@react-pdf/renderer";
import SuccessErrorAlert from "../../../../components/SuccessErrorAlert";

import MicroHeiRegular from "../../../../../_metronic/_assets/font/Micro-Hei-Regular.ttf";
import NotoSansBold from "../../../../../_metronic/_assets/font/NotoSans-Bold.ttf";
import { checkPermission } from "../../../../utils/utils";
import moment from "moment";

Font.register({
  family: "MicroHeiRegular",
  src: MicroHeiRegular,
  fontWeight: 400,
});
Font.register({
  family: "NotoSansBold",
  src: NotoSansBold,
  fontWeight: 700,
});

const styles = StyleSheet.create({
  page: {
    fontSize: "10px",
    //fontFamily: "MicroHeiRegular",
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  quoteNoEnglish: {
    position: "absolute",
    fontSize: 6,
    bottom: 15,
    left: 0,
    right: 10,
    textAlign: "right",
  },
  quoteNoChinese: {
    position: "absolute",
    fontSize: 6,
    bottom: 15,
    left: 0,
    right: 10,
    textAlign: "right",
  },
  invoiceNo: {
    position: "absolute",
    fontSize: 6,
    bottom: 15,
    left: 0,
    right: 10,
    textAlign: "right",
  },
  clientTitle: {
    width: "140px",
    fontWeight: 700,
    color: "red",
  },
});

export default function Actions({
  productForEdit,
  approveQuote,
  rejectQuote,
  approveSpecialEdit,
  rejectSpecialEdit,
  confirmQuote,
  setIsChenese,
  generatePDFLoader,
  refreshPage,
}) {
  let {
    quotation_no,
    issueDate: create_date,
    customer_id,
    places,
    payment_term_id,
    customer_office_worker,
    services,
    remark_desc,
    contact_person,
    amount,
  } = productForEdit;
  const ref = React.useRef();
  const history = useHistory();
  const [isChinesePDF, setIsChinesePDF] = useState(false);
  const dispatch = useDispatch();
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });

  const [uploadDocumentModel, setUploadDocumentModel] = useState(false);
  const [invoiceData, setInvoiceData] = useState("");
  const [showGenInvoiceBtn, setShowGenInvoiceBtn] = useState(false);
  const [invoiceModel, setInvoiceModel] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [totalActiveJob, setTotalActiveJob] = useState(0);
  const [signedDocumentModel, setSignedDocumentModel] = useState(false);
  const [jobOrderModel, setJobOrderMode] = useState(false);
  const [output, setOutput] = useState("");
  const [createJobOrderModel, setCreateJobOrderModel] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [selectedWlocations, setSelectedWlocations] = useState(null);
  const [worker, setWorker] = useState("");
  const [jobOrderData, setJobOrderData] = useState("");
  const [displayJobOrderPreview, setDisplayJobOrderPreview] = useState(false);
  const [displayInvoicePreview, setDisplayInvoicePreview] = useState(false);
  const [invoiceGenereateLoader, setInvoiceGenereateLoader] = useState(false);
  const [customerLocations, setCustomerLocations] = useState([]);
  const [isAdditionalJobOrder, setIsAdditionalJobOrder] = useState(false);
  const [salesRemarkModel, setSalesRemarkModel] = useState(false)
  const [isSubmitForm, setIsSubmitForm] = useState(false)
  const [showJobLimitAlert, setShowJobLimitAlert] = useState(false)
  const [isCloneJobOrder, setIsCloneJobOrder] = useState(false);
  const [cloneJobId, setCloneJobId] = useState('')
  const [historyModel, setHistoryModel] = useState(false)
  const [totalSalesRemark, setTotalSalesRemark] = useState(0)

  const { isLoading, districts } = useSelector(
    (state) => ({
      isLoading: state.contracts.actionsLoading,
      districts: state.districts.entities,
    }),
    shallowEqual
  );

  const fetchCustomerLocations = () => {
    let ids = productForEdit?.customer_id?.location_id?.map((loc) => loc._id);
    axios
      .post(API_URL + "customers/customer/locations", {
          sortOrder: "desc", // asc||desc
          sortField: "createdAt",
          pageNumber: 1,
          pageSize: 150,
          ids: ids.join(",")
      })
      .then((data) => {
        const optValues = data.data.docs.map((item) => {
          return {
            label: `${item.location_name} (${item.location_address})`,
            value: item._id,
          };
        });
        setCustomerLocations(optValues);
      });
  };

  const districtOptions =
    districts?.map((x) => {
      return {
        label: x.district_eng_name,
        value: x._id,
      };
    }) || [];

  function createJobOrderDialog(additional_job_order_flag, clone_job_order_flag, item) {
    let total_job_quentity = productForEdit?.job_order_no ? productForEdit.job_order_no : 1
    if (!checkPermission("CREATE_MORE_JOB_ORDER", "can_add") && totalActiveJob >= total_job_quentity) {
      setShowJobLimitAlert(true)
    } else {
      setIsAdditionalJobOrder(additional_job_order_flag);
      setIsCloneJobOrder(clone_job_order_flag);
      setJobOrderMode(false);
      setCreateJobOrderModel(true);
      setIsSubmitForm(false)

      if (item) {
        setCloneJobId(item._id)
        if (item.expected_job_date) {
          setStartDate(moment(item.expected_job_date).format("YYYY-MM-DD HH:mm"));
        } else {
          setStartDate("");  
        }
        if (item.worker) {
          setWorker(item.worker);
        } else {
          setWorker("");  
        }
        if (item.working_location) {
          setSelectedWlocations({
            label: `${item.working_location?.location_name} (${item.working_location?.location_address})`,
            value: item.working_location?._id,
          });
        } else {
          setSelectedWlocations("");  
        }
      } else {
        setStartDate("");
        setWorker("");
        setSelectedWlocations(null)
      }
    }
  }

  function getTotal(services) {
    let total = 0;
    for (let service of services) {
      total +=
        service.feet *
        Number(service?.price || 0) *
        ((100 - Number(service.discount)) / 100);
    }
    return total;
  }

  useEffect(() => {
    if (productForEdit?.customer_id?.location_id) {
      fetchCustomerLocations();
    }
    //eslint-disable-next-line
  }, [productForEdit]);

  useEffect(() => {
    setInterval(() => {
      if (document.getElementById("quotation-pdf-component")) {
        setOutput(document.getElementById("quotation-pdf-component").innerHTML);
      }
    }, 1000);
  }, []);

  function getJobOrder() {
    setJobOrderMode(true);
    dispatch(jobActions.fetchJobsByContractQuotationNo(quotation_no)).then(
      (res) => {
        if (res.data.docs.length > 0) {
          setJobs(res.data.docs);
          setTotalActiveJob(res.data.activeJob)
        }
      }
    );
  }

  const fetchJobOrders = () => {
    dispatch(jobActions.fetchJobsByContractQuotationNo(quotation_no)).then(
      (res) => {
        if (res.data.docs.length > 0) {
          setJobs(res.data.docs);
          setTotalActiveJob(res.data.activeJob)
        }
      }
    );
  };

  // const MyDocument = () => (
  //   <Document>
  //     <Page size="LETTER" style={styles.page} wrap debug={false}>
  //       <View style={{ display: "flex", flexDirection: "row" }}>
  //         <Image style={{ flex: 1 }} src="/media/details_logo.png" />
  //         <Text style={{ flex: 3 }}></Text>
  //         <Text style={{ flex: 2, textAlign: "right", fontSize: "14px" }}>
  //           {isChinesePDF ? <Text>報價單編號</Text> : "Quotation No"} :{" "}
  //           <Text>#{quotation_no}</Text>
  //         </Text>
  //       </View>
  //       <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
  //       >
  //         <Text style={{ flex: 1, textAlign: "right" }}>
  //           {isChinesePDF ? <Text>日期</Text> : "Date"}:{" "}
  //           <Text>
  //             {Intl.DateTimeFormat("en-GB", {
  //               dateStyle: "medium",
  //             })
  //               .format(new Date(create_date || Date.now()))
  //               .replace(/\//g, " ")}
  //           </Text>
  //         </Text>
  //       </View>
  //       <Text
  //         style={{
  //           borderBottom: "1px",
  //           marginTop: "14px",
  //           marginBottom: "5px",
  //           borderColor: "#E4E6EF",
  //         }}
  //       ></Text>

  //       {/* CLIENT NAME & CONTRACT */}
  //       <View
  //         style={{
  //           width: "100%",
  //           display: "flex",
  //           flexDirection: "row",
  //           marginTop: "2px",
  //           paddingTop: "20px",
  //         }}
  //       >
  //         <View style={{ display: "flex", width: "50%", flexDirection: "row" }}>
  //           <View style={{ width: "100px" }}>
  //             {isChinesePDF ? (
  //               <Text>客戶名稱 :</Text>
  //             ) : (
  //               <Text
  //                 style={{ fontFamily: "NotoSansBold", marginTop: "-1.5px" }}
  //               >
  //                 Customer Name :
  //               </Text>
  //             )}
  //           </View>
  //           <Text style={{ wordBreak: "break-all", maxWidth: "180px" }}>
  //             {customer_id?.customer_name}
  //           </Text>
  //         </View>
  //         <View style={{ display: "flex", width: "50%", flexDirection: "row" }}>
  //           <View style={{ width: "115px" }}>
  //             {isChinesePDF ? (
  //               <Text>聯絡電話 :</Text>
  //             ) : (
  //               <Text
  //                 style={{ fontFamily: "NotoSansBold", marginTop: "-1.5px" }}
  //               >
  //                 Customer Contact No. :
  //               </Text>
  //             )}
  //           </View>
  //           <Text style={{ wordBreak: "break-all" }}>
  //             {customer_id?.office_number}
  //           </Text>
  //         </View>
  //       </View>

  //       {/* ADDRESS & DATE ISSSUED */}
  //       <View
  //         style={{
  //           width: "100%",
  //           display: "flex",
  //           flexDirection: "row",
  //           marginTop: "2px",
  //           paddingTop: "5px",
  //         }}
  //       >
  //         <View style={{ display: "flex", width: "50%", flexDirection: "row" }}>
  //           <View style={{ width: "100px" }}>
  //             {isChinesePDF ? (
  //               <Text>地址 :</Text>
  //             ) : (
  //               <Text
  //                 style={{ fontFamily: "NotoSansBold", marginTop: "-1.5px" }}
  //               >
  //                 Address :
  //               </Text>
  //             )}
  //           </View>
  //           <Text style={{ wordBreak: "break-all", maxWidth: "180px" }}>
  //             {places[0]?.location_address || ""}
  //           </Text>
  //         </View>
  //         <View style={{ display: "flex", width: "50%", flexDirection: "row" }}>
  //           <View style={{ width: "115px" }}>
  //             {isChinesePDF ? (
  //               <Text>傳真號碼 :</Text>
  //             ) : (
  //               <Text
  //                 style={{ fontFamily: "NotoSansBold", marginTop: "-1.5px" }}
  //               >
  //                 Customer Fax No. :
  //               </Text>
  //             )}
  //           </View>
  //           <Text style={{ wordBreak: "break-all" }}>
  //             {customer_id?.fax_number}
  //           </Text>
  //         </View>
  //       </View>

  //       {/* CONTACT PERSON & SERVIVE LINE */}
  //       <View
  //         style={{
  //           width: "100%",
  //           display: "flex",
  //           flexDirection: "row",
  //           marginTop: "2px",
  //           paddingTop: "5px",
  //         }}
  //       >
  //         <View style={{ display: "flex", width: "50%", flexDirection: "row" }}>
  //           <View style={{ width: "100px" }}>
  //             {isChinesePDF ? (
  //               <Text>電郵 :</Text>
  //             ) : (
  //               <Text
  //                 style={{ fontFamily: "NotoSansBold", marginTop: "-1.5px" }}
  //               >
  //                 Email :
  //               </Text>
  //             )}
  //           </View>
  //           <Text style={{ wordBreak: "break-all", maxWidth: "180px" }}>
  //             {customer_id?.email}
  //           </Text>
  //         </View>
  //         <View style={{ display: "flex", width: "50%", flexDirection: "row" }}>
  //           <View style={{ width: "115px" }}>
  //             {isChinesePDF ? (
  //               <Text>服務專線 :</Text>
  //             ) : (
  //               <Text
  //                 style={{ fontFamily: "NotoSansBold", marginTop: "-1.5px" }}
  //               >
  //                 Service Hotline :
  //               </Text>
  //             )}
  //           </View>
  //           <Text style={{ wordBreak: "break-all" }}>
  //             {customer_id?.mobile_number}
  //           </Text>
  //         </View>
  //       </View>

  //       {/* OFFICER */}
  //       <View
  //         style={{
  //           width: "100%",
  //           display: "flex",
  //           flexDirection: "row",
  //           marginTop: "2px",
  //           paddingTop: "5px",
  //         }}
  //       >
  //         <View style={{ display: "flex", width: "50%", flexDirection: "row" }}>
  //           <View style={{ width: "100px" }}>
  //             {isChinesePDF ? (
  //               <Text>客戶服務主任 :</Text>
  //             ) : (
  //               <Text
  //                 style={{ fontFamily: "NotoSansBold", marginTop: "-1.5px" }}
  //               >
  //                 Customer Officer :
  //               </Text>
  //             )}
  //           </View>
  //           <Text style={{ wordBreak: "break-all", maxWidth: "180px" }}>
  //             {customer_office_worker}
  //           </Text>
  //         </View>
  //       </View>

  //       <View
  //         style={{
  //           display: "flex",
  //           flexDirection: "row",
  //           marginTop: "2px",
  //           paddingTop: "5px",
  //         }}
  //       >
  //         <Text style={{ flex: 1 }}>
  //           {isChinesePDF ? (
  //             <Text>工作地點</Text>
  //           ) : (
  //             <Text style={{ fontFamily: "NotoSansBold", marginTop: "-1.5px" }}>
  //               Working Location
  //             </Text>
  //           )}
  //           :
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           display: "flex",
  //           flexDirection: "row",
  //           marginTop: "2px",
  //           paddingTop: "5px",
  //         }}
  //       >
  //         {places.map((place, id) => (
  //           <Text
  //             style={{
  //               flex: 1,
  //               paddingLeft: "20px",
  //               wordBreak: "break-all",
  //               maxWidth: "200px",
  //             }}
  //             key={id}
  //           >
  //             &bull; {place.location_address}
  //           </Text>
  //         ))}
  //       </View>
  //       <View
  //         style={{
  //           display: "flex",
  //           flexDirection: "row",
  //           marginTop: "2px",
  //           paddingTop: "20px",
  //           fontSize: "14px",
  //         }}
  //       >
  //         <Text style={{ flex: 1 }}>
  //           {isChinesePDF ? <Text>服務內容</Text> : "Service Description"}
  //         </Text>
  //         <Text style={{ flex: 1, textAlign: "right" }}>
  //           {isChinesePDF ? <Text>金額</Text> : "Amount"}
  //         </Text>
  //       </View>
  //       <Text
  //         style={{
  //           borderBottom: "5px",
  //           marginTop: "14px",
  //           marginBottom: "5px",
  //           borderColor: "#E4E6EF",
  //         }}
  //       ></Text>
  //       {services.map((service, id) => (
  //         <View key={id}>
  //           <View
  //             style={{
  //               display: "flex",
  //               flexDirection: "row",
  //               marginTop: "10px",
  //               paddingLeft: "10px",
  //             }}
  //           >
  //             <Text style={{ flex: 1 }}>
  //               {service.service_id?.service_name}
  //             </Text>
  //           </View>
  //           <View
  //             style={{
  //               display: "flex",
  //               flexDirection: "row",
  //               marginTop: "2px",
  //               paddingLeft: "10px",
  //             }}
  //           >
  //             <Text style={{ flex: 1 }}>{service?.desc}</Text>
  //             <Text
  //               style={{
  //                 textAlign: "right",
  //                 width: "130px",
  //                 wordBreak: "break-all",
  //               }}
  //             >
  //               $
  //               {(service.feet *
  //                 Number(service?.cost || 0) *
  //                 (100 - service.discount)) /
  //                 100}
  //             </Text>
  //           </View>
  //           {/* <View
  //             style={{
  //               display: "flex",
  //               flexDirection: "row",
  //               marginTop: "2px",
  //               paddingLeft: "10px",
  //             }}
  //           >
  //             <Text style={{ flex: 1 }}>kl21321312k123k</Text>
  //           </View> */}
  //         </View>
  //       ))}
  //       <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "25px" }}
  //       >
  //         <Text style={{ flex: 1 }}>
  //           {isChinesePDF ? <Text>專員</Text> : "Commissioner"}:{" "}
  //           {customer_office_worker}
  //         </Text>
  //         <Text style={{ flex: 1, textAlign: "right" }}>
  //           {isChinesePDF ? <Text>合共</Text> : "Total Amount"}: ${amount}
  //         </Text>
  //       </View>
  //       <Text
  //         style={{
  //           borderBottom: "1px",
  //           marginTop: "14px",
  //           marginBottom: "8px",
  //           borderColor: "#E4E6EF",
  //         }}
  //       ></Text>
  //       <View
  //         style={{
  //           display: "flex",
  //           flexDirection: "row",
  //           marginTop: "10px",
  //           fontSize: "14px",
  //         }}
  //       >
  //         <Text style={{ flex: 1 }}>
  //           {isChinesePDF ? <Text>備註</Text> : "Remarks"}
  //         </Text>
  //       </View>
  //       <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "5px" }}
  //       >
  //         <Text style={{ flex: 1 }}>{ReactHTMLParser(remark_desc || "")}</Text>
  //       </View>
  //       <Text
  //         style={{
  //           borderBottom: "1px",
  //           marginTop: "14px",
  //           marginBottom: "5px",
  //           borderColor: "#E4E6EF",
  //         }}
  //       ></Text>
  //       <View
  //         style={{
  //           display: "flex",
  //           flexDirection: "row",
  //           marginTop: "10px",
  //           fontSize: "14px",
  //         }}
  //       >
  //         <Text style={{ flex: 1 }}>
  //           {isChinesePDF ? <Text>付款方法</Text> : "Payment methods"}
  //         </Text>
  //       </View>
  //       <Text
  //         style={{
  //           borderBottom: "1px",
  //           marginTop: "14px",
  //           marginBottom: "5px",
  //           borderColor: "#E4E6EF",
  //         }}
  //       ></Text>
  //       <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "8px" }}
  //       >
  //         <Text style={{ flex: 1 }}>
  //           {payment_term_id?.payment_method_content}
  //         </Text>
  //       </View>
  //       <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "15px" }}
  //       >
  //         <Text style={{ flex: 2 }}>
  //           {isChinesePDF ? (
  //             <Text>海富清潔滅蟲服務有限公司代表</Text>
  //           ) : (
  //             "Representative of Hai Fu Cleaning and Pest Control Service Co., Ltd"
  //           )}
  //         </Text>
  //         <Text style={{ flex: 1 }}></Text>
  //         <Text style={{ flex: 2 }}>
  //           {isChinesePDF ? <Text>確認和接受</Text> : "Confirm and accept Test"}
  //         </Text>
  //       </View>
  //       <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
  //       >
  //         <Text style={{ flex: 2 }}></Text>
  //         <Text style={{ flex: 1 }}></Text>
  //         <Text style={{ flex: 2 }}>{customer_id?.customer_name}</Text>
  //       </View>
  //       {productForEdit.approved_by ? (
  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
  //         >
  //           <Image
  //             style={{ flex: 2 }}
  //             src="/static/media/signature.5d01e54c.jpg"
  //           />
  //           <Text style={{ flex: 1 }}></Text>
  //           <Text style={{ flex: 2 }}></Text>
  //         </View>
  //       ) : (
  //         <View></View>
  //       )}
  //       <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
  //       >
  //         <Text
  //           style={{
  //             flex: 2,
  //             borderBottom: "2px",
  //             marginTop: "14px",
  //             marginBottom: "5px",
  //             borderColor: "#E4E6EF",
  //           }}
  //         ></Text>
  //         <Text style={{ flex: 1 }}></Text>
  //         <Text
  //           style={{
  //             flex: 2,
  //             borderBottom: "2px",
  //             marginTop: "14px",
  //             marginBottom: "5px",
  //             borderColor: "#E4E6EF",
  //           }}
  //         ></Text>
  //       </View>
  //       <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
  //       >
  //         <Text style={{ flex: 2 }}>
  //           {isChinesePDF ? (
  //             <Text>授權簽署及公司印章</Text>
  //           ) : (
  //             "Authorized Signature and Company"
  //           )}
  //         </Text>
  //         <Text style={{ flex: 1 }}></Text>
  //         <Text style={{ flex: 2 }}>
  //           {isChinesePDF ? <Text>日期</Text> : "Date"}:{" "}
  //         </Text>
  //       </View>
  //       <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
  //       >
  //         <Text style={{ flex: 2 }}>
  //           {Intl.DateTimeFormat("en-GB", {
  //             dateStyle: "medium",
  //           })
  //             .format(new Date(create_date || Date.now()))
  //             .replace(/\//g, " ")}
  //         </Text>
  //         <Text style={{ flex: 1 }}></Text>
  //         <Text style={{ flex: 2 }}></Text>
  //       </View>

  //       <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
  //         <View style={{ width: "50%" }}>
  //           <Text style={{ marginTop: "10px" }}>
  //             {isChinesePDF ? (
  //               <Text>海富清潔滅蟲服務有限公司</Text>
  //             ) : (
  //               "MasterClean Carpet Systems Limited"
  //             )}
  //           </Text>

  //           <Text>
  //             {isChinesePDF ? (
  //               <Text>熱線: (852) 3975 6300 傳真: (852) 2756 3141 </Text>
  //             ) : (
  //               "Hotline: (852) 3975 6300 Fax: (852) 2756 3141"
  //             )}
  //           </Text>
  //           <Text>
  //             {isChinesePDF ? <Text>網站</Text> : "Website"}: www.masterclean.hk
  //           </Text>
  //           <Text style={{ flex: 2 }}>
  //             {isChinesePDF ? (
  //               <Text>九龍觀塘鴻圖道45號宏光工業大廈8字樓J室</Text>
  //             ) : (
  //               "Flat J, 8/F, Wang Kwong Industrial Building, 45 Hung To Road, Kwun Tong, KLN"
  //             )}
  //           </Text>
  //         </View>

  //         <View style={{ width: "50%" }}>
  //           <Image
  //             src="/media/all-in-one.jpg"
  //             style={{ height: "65px", width: "100%", float: "right" }}
  //           />
  //         </View>
  //       </View>
  //       <Text
  //         style={styles.pageNumber}
  //         render={({ pageNumber, totalPages }) =>
  //           `${pageNumber} / ${totalPages}`
  //         }
  //         fixed
  //       />
  //       {isChinesePDF ? (
  //         <Text
  //           style={styles.quoteNoChinese}
  //           render={() => `報價單編號: #${quotation_no}`}
  //           fixed
  //         />
  //       ) : (
  //         <Text
  //           style={styles.quoteNoEnglish}
  //           render={() => `Quotation No.: #${quotation_no}`}
  //           fixed
  //         />
  //       )}

  //       {/* <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
  //       >
  //         <Text style={{ flex: 2 }}>
  //           {isChinesePDF ? (
  //             <Text>海富清潔滅蟲服務有限公司</Text>
  //           ) : (
  //             "MMasterClean Carpet Systems Limited"
  //           )}
  //         </Text>
  //         <Text style={{ flex: 1 }}></Text>
  //         <Text style={{ flex: 2 }}></Text>
  //       </View> */}
  //       {/* <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "8px" }}
  //       >
  //         <Text style={{ flex: 2 }}>
  //           {isChinesePDF ? (
  //             <Text>熱線: (852) 3975 6300 傳真: (852) 2756 3141 </Text>
  //           ) : (
  //             "Hotline: (852) 3975 6300 Fax: (852) 2756 3141"
  //           )}
  //         </Text>
  //         <Text style={{ flex: 1 }}></Text>
  //         <Text style={{ flex: 2 }}></Text>
  //       </View> */}
  //       {/* <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "8px" }}
  //       >
  //         <Text style={{ flex: 2 }}>
  //           {isChinesePDF ? <Text>網站</Text> : "Website"}: www.masterclean.hk
  //         </Text>
  //         <Text style={{ flex: 1 }}></Text>
  //         <Text style={{ flex: 2 }}></Text>
  //       </View> */}
  //       {/* <View
  //         style={{ display: "flex", flexDirection: "row", marginTop: "8px" }}
  //       >
  //         <Text style={{ flex: 2 }}>
  //           {isChinesePDF ? (
  //             <Text>九龍觀塘鴻圖道45號宏光工業大廈8字樓J室</Text>
  //           ) : (
  //             "Flat J, 8/F, Wang Kwong Industrial Building, 45 Hung To Road, Kwun Tong, KLN"
  //           )}
  //         </Text>
  //         <Text style={{ flex: 1 }}></Text>
  //         <Text style={{ flex: 2 }}></Text>
  //       </View> */}
  //       {/* <Text
  //         style={styles.pageNumber}
  //         render={({ pageNumber, totalPages }) =>
  //           `${pageNumber} / ${totalPages}`
  //         }
  //         fixed
  //       />
  //       {isChinesePDF ? (
  //         <Text
  //           style={styles.quoteNoChinese}
  //           render={() => `報價單編號: #${quotation_no}`}
  //           fixed
  //         />
  //       ) : (
  //         <Text
  //           style={styles.quoteNoEnglish}
  //           render={() => `Quotation No.: #${quotation_no}`}
  //           fixed
  //         />
  //       )} */}
  //     </Page>
  //   </Document>
  // );

  function generalPDF(isChinesePDF) {
    setIsChenese(isChinesePDF);
    setIsChinesePDF(isChinesePDF);
    // setTimeout(() => {
    //   document.querySelector(".generate_pdf").click();
    // }, 500);
  }

  // const InvoicePDF = () => (
  //   <Document>
  //     {invoiceData ? (
  //       <Page size="LETTER" style={styles.page} wrap debug={false}>
  //         <View style={{ display: "flex", flexDirection: "row" }}>
  //           <View style={{ flex: 2 }}>
  //             <Image src="/media/details_logo.png" style={{ width: "40%" }} />
  //             <Text style={{ fontSize: "18px", marginTop: "5px" }}>
  //               Invoice To:
  //             </Text>
  //             <Text style={{ marginTop: "5px" }}>
  //               {invoiceData.contact_person?.contact_name || ""}
  //             </Text>
  //             <Text style={{ marginTop: "3px" }}>
  //               {invoiceData.customer_id?.customer_name}
  //             </Text>
  //             <Text style={{ marginTop: "3px" }}>
  //               {invoiceData.address && invoiceData.address.length > 0
  //                 ? invoiceData.address[0].location_address
  //                 : ""}
  //             </Text>
  //             <Text style={{ marginTop: "3px" }}>
  //               Phone: {invoiceData.customer_id?.office_number}
  //             </Text>
  //             <Text style={{ marginTop: "3px" }}>
  //               Email: {invoiceData.customer_id?.email}
  //             </Text>
  //           </View>
  //           <View style={{ flex: 1, textAlign: "right" }}>
  //             <Text style={{ fontSize: "25px" }}>INVOICE</Text>
  //             <Text style={{ marginTop: "5px" }}>
  //               Invoice No: #{invoiceData.invoice_no}
  //             </Text>
  //             <Text style={{ marginTop: "3px" }}>
  //               Date:{" "}
  //               {Intl.DateTimeFormat("en-GB", {
  //                 dateStyle: "medium",
  //               })
  //                 .format(new Date(invoiceData.date || Date.now()))
  //                 .replace(/\//g, " ")}
  //             </Text>
  //             <Text
  //               style={{
  //                 borderBottom: "1px",
  //                 marginTop: "14px",
  //                 marginBottom: "10px",
  //                 borderColor: "#E4E6EF",
  //               }}
  //             ></Text>
  //             <Text>
  //               Contract / Quotation No: #{invoiceData.quote_contract_no}
  //             </Text>
  //             <Text style={{ marginTop: "3px" }}>
  //               Job Date / Period:{" "}
  //               {invoiceData.job_start_date && invoiceData.job_end_date ? (
  //                 <Text>
  //                   {Intl.DateTimeFormat("en-GB", {
  //                     dateStyle: "medium",
  //                   })
  //                     .format(
  //                       new Date(invoiceData.job_start_date || Date.now())
  //                     )
  //                     .replace(/\//g, " ")}
  //                   To{" "}
  //                   {Intl.DateTimeFormat("en-GB", {
  //                     dateStyle: "medium",
  //                   })
  //                     .format(new Date(invoiceData.job_end_date || Date.now()))
  //                     .replace(/\//g, " ")}
  //                 </Text>
  //               ) : (
  //                 <Text></Text>
  //               )}
  //             </Text>
  //           </View>
  //         </View>


  //         <View
  //           style={{
  //             display: "flex",
  //             flexDirection: "row",
  //             marginTop: "15px",
  //             fontSize: "16px",
  //           }}
  //         >
  //           <Text
  //             style={{
  //               padding: "3px",
  //               flex: 2,
  //               backgroundColor: "red",
  //               color: "white",
  //             }}
  //           >
  //             Service Item(S)
  //           </Text>
  //           <Text
  //             style={{
  //               padding: "3px",
  //               flex: 1,
  //               backgroundColor: "grey",
  //               color: "white",
  //               textAlign: "right",
  //             }}
  //           >
  //             Amount
  //           </Text>
  //         </View>

  //         {invoiceData.services.map((service, id) => (
  //           <View key={id}>
  //             <View
  //               style={{
  //                 display: "flex",
  //                 flexDirection: "row",
  //                 marginTop: "5px",
  //               }}
  //             >
  //               <Text style={{ flex: 2 }}>{service?.title}</Text>
  //               <Text style={{ flex: 1, textAlign: "right" }}>
  //                 {formateAmount(service.price)}
  //               </Text>
  //             </View>
  //           </View>
  //         ))}
  //         <Text
  //           style={{
  //             borderBottom: "1px",
  //             marginTop: "5px",
  //             marginBottom: "5px",
  //             borderColor: "#E4E6EF",
  //           }}
  //         ></Text>
  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "5px" }}
  //         >
  //           <Text style={{ flex: 2, textAlign: "right" }}>Total Amount:</Text>
  //           <Text style={{ flex: 1, textAlign: "right" }}>
  //             {formateAmount(invoiceData.amount)}
  //           </Text>
  //         </View>
  //         <Text
  //           style={{
  //             fontSize: "14px",
  //             marginTop: "15px",
  //           }}
  //         >
  //           Payment terms:
  //         </Text>
  //         <Text style={{ marginTop: "5px" }}>
  //           {invoiceData.payment_term_id?.payment_method_content}
  //         </Text>

  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}
  //         >
  //           <Text style={{ flex: 2 }}>For and behalf of</Text>
  //           <Text style={{ flex: 1 }}></Text>
  //           <Text style={{ flex: 2 }}></Text>
  //         </View>

  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
  //         >
  //           <Text style={{ flex: 2 }}>MasterClean Carpet System Ltd</Text>
  //           <Text style={{ flex: 1 }}></Text>
  //           <Text style={{ flex: 2 }}></Text>
  //         </View>

  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
  //         >
  //           <Image
  //             style={{ flex: 2 }}
  //             src="/static/media/signature.5d01e54c.jpg"
  //           />
  //           <Text style={{ flex: 1 }}></Text>
  //           <Text style={{ flex: 2 }}></Text>
  //         </View>

  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
  //         >
  //           <Text
  //             style={{
  //               flex: 2,
  //               borderBottom: "2px",
  //               marginTop: "14px",
  //               marginBottom: "5px",
  //               borderColor: "#E4E6EF",
  //             }}
  //           ></Text>
  //           <Text style={{ flex: 1 }}></Text>
  //           <Text
  //             style={{
  //               flex: 2,
  //             }}
  //           ></Text>
  //         </View>

  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
  //         >
  //           <Text style={{ flex: 2 }}>Authorized Company Chop</Text>
  //           <Text style={{ flex: 1 }}></Text>
  //           <Text style={{ flex: 2 }}></Text>
  //         </View>
  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
  //         >
  //           <Text style={{ flex: 2 }}>
  //             {Intl.DateTimeFormat("en-GB", {
  //               dateStyle: "medium",
  //             })
  //               .format(new Date(invoiceData.date || Date.now()))
  //               .replace(/\//g, " ")}
  //           </Text>
  //           <Text style={{ flex: 1 }}></Text>
  //           <Text style={{ flex: 2 }}></Text>
  //         </View>

  //         <View style={{ flexDirection: "row", marginTop: "15px" }}>
  //           <View style={{ flex: 1 }}>
  //             <Text>MasterClean Carpet Systems Limited</Text>
  //             <Text style={{ marginTop: "5px" }}>
  //               Hotline: (852) 3975 6300 Fax: (852) 2756 3141
  //             </Text>
  //             <Text style={{ marginTop: "5px" }}>
  //               Website: www.masterclean.hk
  //             </Text>
  //             <Text style={{ marginTop: "5px" }}>
  //               Flat J, 8/F, Wang Kwong Industrial Building, 45 Hung To Road,
  //               Kwun Tong, KLN
  //             </Text>
  //           </View>
  //           <View style={{ flex: 1 }}>
  //             <Image src="/media/all-in-one.jpg" />
  //           </View>
  //         </View>

  //         <Text
  //           style={styles.pageNumber}
  //           render={({ pageNumber, totalPages }) =>
  //             `${pageNumber} / ${totalPages}`
  //           }
  //           fixed
  //         />
  //         <Text
  //           style={styles.invoiceNo}
  //           render={() => `Invoice No.: #${invoiceData.invoice_no}`}
  //           fixed
  //         />
  //       </Page>
  //     ) : (
  //       ""
  //     )}
  //   </Document>
  // );

  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
  //         >
  //           <Text style={{ flex: 2 }}>MasterClean Hygiene Solution Limited</Text>
  //           <Text style={{ flex: 1 }}></Text>
  //           <Text style={{ flex: 2 }}></Text>
  //         </View>

  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
  //         >
  //           <Image
  //             style={{ flex: 2 }}
  //             src="/static/media/signature.5d01e54c.jpg"
  //           />
  //           <Text style={{ flex: 1 }}></Text>
  //           <Text style={{ flex: 2 }}></Text>
  //         </View>

  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
  //         >
  //           <Text
  //             style={{
  //               flex: 2,
  //               borderBottom: "2px",
  //               marginTop: "14px",
  //               marginBottom: "5px",
  //               borderColor: "#E4E6EF",
  //             }}
  //           ></Text>
  //           <Text style={{ flex: 1 }}></Text>
  //           <Text
  //             style={{
  //               flex: 2,
  //             }}
  //           ></Text>
  //         </View>

  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
  //         >
  //           <Text style={{ flex: 2 }}>Authorized Company Chop</Text>
  //           <Text style={{ flex: 1 }}></Text>
  //           <Text style={{ flex: 2 }}></Text>
  //         </View>
  //         <View
  //           style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
  //         >
  //           <Text style={{ flex: 2 }}>
  //             {Intl.DateTimeFormat("en-GB", {
  //               dateStyle: "medium",
  //             })
  //               .format(new Date(invoiceData.date || Date.now()))
  //               .replace(/\//g, " ")}
  //           </Text>
  //           <Text style={{ flex: 1 }}></Text>
  //           <Text style={{ flex: 2 }}></Text>
  //         </View>

  //         <View style={{ flexDirection: "row", marginTop: "15px" }}>
  //           <View style={{ flex: 1 }}>
  //             <Text>MasterClean Hygiene Solution Limited</Text>
  //             <Text style={{ marginTop: "5px" }}>
  //               Hotline: (852) 3975 6300 Fax: (852) 2756 3141
  //             </Text>
  //             <Text style={{ marginTop: "5px" }}>
  //               Website: www.masterclean.hk
  //             </Text>
  //             <Text style={{ marginTop: "5px" }}>
  //               Flat J, 8/F, Wang Kwong Industrial Building, 45 Hung To Road,
  //               Kwun Tong, KLN
  //             </Text>
  //           </View>
  //           <View style={{ flex: 1 }}>
  //             <Image src="/media/all-in-one.jpg" />
  //           </View>
  //         </View>

  //         <Text
  //           style={styles.pageNumber}
  //           render={({ pageNumber, totalPages }) =>
  //             `${pageNumber} / ${totalPages}`
  //           }
  //           fixed
  //         />
  //         <Text
  //           style={styles.invoiceNo}
  //           render={() => `Invoice No.: #${invoiceData.invoice_no}`}
  //           fixed
  //         />
  //       </Page>
  //     ) : (
  //       ""
  //     )}
  //   </Document>
  // );


  function generateInvoice() {
    let invoice_services = [];
    for (let service of services) {
      invoice_services.push({
        service_id: service.service_id._id,
        discount: service.discount,
        feet: service.feet,
        price:
          (service.feet *
            Number(service?.cost || 0) *
            (100 - service.discount)) /
          100,
        desc: service.desc,
        title: service.title,
      });
    }
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    let data = {
      customer_id: customer_id?._id,
      date: `${yyyy}-${mm}-${dd}`,
      quote_contract_no: quotation_no,
      contact_person: contact_person?._id
        ? contact_person._id
        : "",
      services: invoice_services,
      status: invoiceStatuses.WAITING,
      customer_office_worker: customer_office_worker
        ? customer_office_worker
        : "",
      address: (places && places.length > 0)
        ? places.map((item) => { return item._id })
        : [],
      amount: amount.toFixed(2),
    };
    if (payment_term_id?._id) {
      data.payment_term_id = payment_term_id?._id;
    }
    console.log("data", data);
    dispatch(actions.createinvoice(data)).then(
      (res) => {
        setisSuccess({
          success: 2,
          message: "Invoice created successfully",
        });
        //getInvoices();
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 3000);
        setTimeout(() => {
          setShowGenInvoiceBtn(false);
        }, 500);
        dispatch(
          quoteActions.changequotesStatus(productForEdit._id, {
            status: quoteStatuses.PENDING_PAYMENT,
          })
        ).then((res2) => {
          refreshPage();
        });
      },
      (err) => {
        let myerr = err.response.data.message;
        console.log(myerr.response);
        setisSuccess({
          success: 1,
          message: myerr || "An unknown error occured",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 5000);
      }
    );
  }

  const downloadInvoicePDF = (item) => {
    setInvoiceData(item);
    setDisplayInvoicePreview(true);
    setTimeout(() => {
      let post_data = {
        html: document.getElementById("invoice-pdf-component")
          ? document.getElementById("invoice-pdf-component").innerHTML
          : "",
        url: `${window.location.origin}/pdf/invoice`,
        invoice_no: item.invoice_no,
        is_chinese: false,
      };
      axios
        .post(API_URL + "/pdf/invoice", post_data, {
          responseType: "blob", // VERY IMPORTANT
          headers: {
            Accept: "application/pdf",
          },
        })
        .then((res) => {
          console.log(res.data);
          var downloadLink = document.createElement("a");
          downloadLink.target = "_blank";
          downloadLink.download = `${item.invoice_no}.pdf`;
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
          setJobOrderData("");
          setDisplayInvoicePreview(false);
          setInvoiceGenereateLoader(false);
        });
    }, 500);
  };

  function getInvoices(IsCheckInvoice) {
    dispatch(actions.fetchInvoicesByContractQuotationNo(quotation_no)).then(
      (res) => {
        console.log("data", res.data.docs);
        if (res.data.docs.length > 0) {
          setShowGenInvoiceBtn(false);
          if (!IsCheckInvoice) {
            if (res.data.docs.length > 1) {
              setInvoices(res.data.docs);
              setInvoiceModel(true);
            } else {
              setInvoiceGenereateLoader(true);
              downloadInvoicePDF(res.data.docs[0]);
            }
          }
        } else {
          setShowGenInvoiceBtn(true);
          if (!IsCheckInvoice) {
            setisSuccess({
              success: 1,
              message: "No Invoice Found!",
            });
            setTimeout(() => {
              setisSuccess({ success: 0, message: "" });
            }, 5000);
          }
        }
      }
    );
  }

  useEffect(() => {
    if (quotation_no) {
      fetchJobOrders();
      getInvoices(true);
    }
    // eslint-disable-next-line
  }, [quotation_no]);

  function setGenereateInvoiceDate(item) {
    setInvoiceData(item);
    setTimeout(() => {
      document.querySelector(".generate_invoice_pdf").click();
    }, 1000);
  }

  function getInvoiceList() {
    return invoices.map((item) => {
      return (
        <TableRow>
          <TableCell>{item.invoice_no}</TableCell>
          <TableCell>{item.date}</TableCell>
          <TableCell>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-edit-tooltip">Download Invoice</Tooltip>
              }
            >
              {displayInvoicePreview && invoiceData._id == item._id ? (
                <button
                  type="button"
                  className="btn btn-default border bg-white border-dark text-dark btn-sm"
                  disabled
                >
                  <span className="spinner spinner-sm spinner-warning"></span>{" "}
                  <span className="ml-8"> Downloading</span>
                </button>
              ) : (
                <a
                  className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                  onClick={() => downloadInvoicePDF(item)}
                >
                  <span className="svg-icon svg-icon-md svg-icon-primary">
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/Files/Download.svg")}
                    />
                  </span>
                </a>
              )}
            </OverlayTrigger>
          </TableCell>
        </TableRow>
      );
    });
  }

  function signedDocument(signed_document) {
    const linkSource = `${signed_document}`;
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = "_self";
    downloadLink.download = "signed_document";
    downloadLink.click();
  }

  function getDocumentList() {
    if (productForEdit?.signed_document) {
      return productForEdit?.signed_document.map((item) => {
        return (
          <TableRow>
            <TableCell>
              {item.date ? moment(item.date).format("MM-DD-YYYY HH:mm") : ""}
            </TableCell>
            <TableCell>
              <a onClick={() => signedDocument(item.document)}>
                <u>{item.file_name}</u>
              </a>
            </TableCell>
          </TableRow>
        );
      });
    } else {
      return "";
    }
  }

  function downloadSignedDocument(signed_document) {
    const linkSource = `${signed_document}`;
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = "_self";
    downloadLink.download = "signed_document";
    downloadLink.click();
  }

  const downloadJobPDF = (item) => {
    setJobOrderData(item);
    setDisplayJobOrderPreview(true);
    setTimeout(() => {
      let post_data = {
        html: document.getElementById("job-order-pdf-component")
          ? document.getElementById("job-order-pdf-component").innerHTML
          : "",
        url: `${window.location.origin}/pdf/job-order`,
        job_no: item.job_no,
        is_chinese: true,
      };
      axios
        .post(API_URL + "/pdf/job-order", post_data, {
          responseType: "blob", // VERY IMPORTANT
          headers: {
            Accept: "application/pdf",
          },
        })
        .then((res) => {
          console.log(res.data);
          var downloadLink = document.createElement("a");
          downloadLink.target = "_blank";
          downloadLink.download = `${item.job_no}.pdf`; //"job-order.pdf";
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
          setJobOrderData("");
          setDisplayJobOrderPreview(false);
        });
    }, 500);
  };

  function getJobList() {
    if (jobs) {
      return jobs.map((item) => {
        return (
          <TableRow>
            <TableCell>
              {item?.isAdditional ? `*${item.job_no}` : item.job_no}
            </TableCell>
            <TableCell>
              {item?.status}
            </TableCell>
            <TableCell>
              {item.expected_job_date
                ? moment(item.expected_job_date).format("MM-DD-YYYY HH:mm")
                : ""}
            </TableCell>
            <TableCell>
              {displayJobOrderPreview && jobOrderData._id == item._id ? (
                <button
                  type="button"
                  className="btn btn-default border bg-white border-dark text-dark btn-sm"
                  disabled
                >
                  <span className="spinner spinner-sm spinner-warning"></span>{" "}
                  <span className="ml-8"> Downloading</span>
                </button>
              ) : (
                <a
                  className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                  onClick={() => downloadJobPDF(item)}
                >
                  <span className="svg-icon svg-icon-md svg-icon-primary">
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/Files/Download.svg")}
                    />
                  </span>
                </a>
              )}
            </TableCell>
            <TableCell>
              {item.signed_document ? (
                <a
                  className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                  onClick={() => downloadSignedDocument(item.signed_document)}
                >
                  <span className="svg-icon svg-icon-md svg-icon-primary">
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/Files/Download.svg")}
                    />
                  </span>
                </a>
              ) : (
                "No Record"
              )}
            </TableCell>
            <TableCell>
              <div className="d-sm-flex flex-sm-row justify-content-end">
                <OverlayTrigger
                  overlay={<Tooltip id="products-edit-tooltip">Preview</Tooltip>}
                >
                  <a
                    className="btn btn-icon btn-light btn-hover-primary btn-sm ml-3"
                    onClick={() => window.open(`/jobs/${item._id}/details`) }
                  >
                    <span className="svg-icon svg-icon-md svg-icon-primary">
                      <SVG
                        src={toAbsoluteUrl("/media/svg/icons/General/Expand-arrows.svg")}
                      />
                    </span>
                  </a>
                </OverlayTrigger>

                <OverlayTrigger
                  overlay={<Tooltip id="products-edit-tooltip">Clone</Tooltip>}
                >
                  <a
                    className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                    onClick={() => {
                      createJobOrderDialog(false, true, item);
                    }}
                  >
                    <span className="svg-icon svg-icon-md svg-icon-primary">
                      <SVG src={toAbsoluteUrl("/media/svg/icons/General/Duplicate.svg")} />
                    </span>
                  </a>
                </OverlayTrigger>
              </div>
            </TableCell>
          </TableRow>
        );
      });
    } else {
      return "";
    }
  }

  function getHistoryList() {
    if (productForEdit?.history) {
      return productForEdit?.history?.map((item) => {
        return (
          <TableRow>
            <TableCell>
              {item.createdAt
              ? moment(item.createdAt).format("MM-DD-YYYY HH:mm")
              : ""}
            </TableCell>
            <TableCell>
              {item?.history_created_by?.displayname}
            </TableCell>
            <TableCell>
              {(item?.approve_reject_by?.displayname) ? item?.approve_reject_by?.displayname : '-'}
            </TableCell>
            <TableCell>
              <div className="d-sm-flex flex-sm-row justify-content-end">
                <OverlayTrigger
                  overlay={<Tooltip id="products-edit-tooltip">Preview</Tooltip>}
                >
                  <a
                    className="btn btn-icon btn-light btn-hover-primary btn-sm ml-3"
                    onClick={() => window.open(`/quotes/${item._id}/details?isHistory=true`) }
                  >
                    <span className="svg-icon svg-icon-md svg-icon-primary">
                      <SVG
                        src={toAbsoluteUrl("/media/svg/icons/General/Expand-arrows.svg")}
                      />
                    </span>
                  </a>
                </OverlayTrigger>
              </div>
            </TableCell>
          </TableRow>
        );
      });
    } else {
      return "";
    }
  }

  const submitCreateJobOrder = async () => {
    const isAbletoSubmit = Boolean(
      worker &&
      worker !== "" &&
      startDate &&
      startDate !== "" &&
      selectedWlocations
    );
    if (isAbletoSubmit) {
      const requestBody = {
        area: selectedWlocations ? selectedWlocations.value : "",
        worker: worker,
        expected_job_date: startDate ? new Date(startDate) : "",
        places: selectedWlocations ? [selectedWlocations.value] : [],
        is_additional: isAdditionalJobOrder,
      };

      if (isCloneJobOrder) {
        reuseJob(cloneJobId, requestBody)
        .then((res) => {
          setCreateJobOrderModel(false);
          setisSuccess({
            success: 2,
            message: "Job order cloned successfully",
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 3000);
          fetchJobOrders()
        })
        .catch((err) => { });
      } else {
        createJobOrder(productForEdit._id, requestBody)
        .then((res) => {
          setCreateJobOrderModel(false);
          setisSuccess({
            success: 2,
            message: "Job order created successfully",
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 3000);
          fetchJobOrders()
        })
        .catch((err) => { });
      }

    } else {
      setIsSubmitForm(true)
    }
  };

  const workingLocationOptions = places.map((x) => {
    return {
      label: x?.location_address,
      value: x?._id,
    };
  });

  function uploadDocument() {
    setUploadDocumentModel(true);
  };

  function getJobOrderLabel() {
    if (isAdditionalJobOrder) {
      return 'Create Additional Job Order'
    } else if (isCloneJobOrder) {
      return 'Clone Job Order'
    } else {
      return 'Create Job Order'
    }
  }

  return (
    <>
      {isSuccess.success !== 0 && (
        <SuccessErrorAlert isSuccess={isSuccess} setisSuccess={setisSuccess} />
      )}
      <div className="d-flex flex-column">
        <Card>
          <CardBody>
            <div className="d-flex flex-column">
              <p className="text-danger h2">
                Number of work orders: {totalActiveJob}/
                {productForEdit?.job_order_no || 1}
              </p>

              <p style={{ fontSize: 16, marginBottom: 2 }}>
                <b>Follow By:</b>&nbsp;
                {productForEdit?.updated_by ? (
                  `${productForEdit?.updated_by?.displayname || productForEdit?.updated_by?.username}`
                ) : (
                  `${productForEdit?.created_by?.displayname || productForEdit?.created_by?.username}`
                )}
              </p>
              <p style={{ fontSize: 16 }}><b>Sales:</b> {productForEdit?.customer_id?.customer_officer_id?.displayname}</p>

              {/* EDIT ACTION SHOW WHEN STATUS IS REJECTED */}
              {productForEdit?.status &&
                (productForEdit?.status === quoteStatuses.PENDING ||
                  productForEdit?.status === quoteStatuses.REJECTED ||
                  productForEdit?.status === quoteStatuses.CLIENT_REJECTED ||
                  productForEdit?.status === quoteStatuses.APPROVED || 
                  ((productForEdit?.status === quoteStatuses.CONFIRMED || productForEdit?.status === quoteStatuses.PENDING_PAYMENT) && checkPermission("SPECIAL_EDIT", "can_edit"))) &&
                checkPermission("QUOTATION", "can_edit") && (
                  <button
                    type="button"
                    className="btn btn-default mb-4 border bg-white border-dark text-dark"
                    onClick={() => {
                      history.push(`/quotes/${productForEdit._id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                )}

              {/* APPROVE QUOTATION ACTION */}
              {productForEdit?.status &&
                (productForEdit?.status === quoteStatuses.PENDING ||
                  productForEdit?.status === quoteStatuses.REJECTED ||
                  productForEdit?.status === quoteStatuses.CLIENT_REJECTED) &&
                checkPermission("QUOTATION", "can_approval") && (
                  <button
                    type="button"
                    className="btn btn-primary mb-4"
                    onClick={() => approveQuote()}
                  >
                    Approve
                  </button>
                )}

              {productForEdit?.status &&
                productForEdit?.status === quoteStatuses.SPECIAL_PENDING &&
                checkPermission("SPECIAL_EDIT", "can_approval") && (
                  <button
                    type="button"
                    className="btn btn-primary mb-4"
                    onClick={() => approveSpecialEdit()}
                  >
                    Approve
                  </button>
                )}

              {/* REJECT QUOTATION ACTION */}
              {productForEdit?.status &&
                (productForEdit?.status === quoteStatuses.PENDING ||
                  productForEdit?.status === quoteStatuses.REJECTED ||
                  productForEdit?.status === quoteStatuses.CLIENT_REJECTED) &&
                checkPermission("QUOTATION", "can_approval") && (
                  <button
                    type="button"
                    className="btn btn-primary mb-4 bg-danger border-danger"
                    onClick={() => rejectQuote()}
                  >
                    Reject
                  </button>
                )}

              {productForEdit?.status &&
                productForEdit?.status === quoteStatuses.SPECIAL_PENDING &&
                checkPermission("SPECIAL_EDIT", "can_approval") && (
                  <button
                    type="button"
                    className="btn btn-primary mb-4 bg-danger border-danger"
                    onClick={() => rejectSpecialEdit()}
                  >
                    Reject
                  </button>
                )}

              {/* <button
                type="button"
                className="btn btn-default mb-4 border bg-white border-dark text-dark"
                onClick={() => handleDownloadImage()}
              >
                Download PDF(English Version)
              </button> */}
              {/* <button style={{ display: "none" }} type="button">
                <PDFDownloadLink
                  className="generate_pdf"
                  document={<MyDocument />}
                  fileName={`Quotation-${quotation_no}.pdf`}
                >
                  {" "}
                  PDF
                </PDFDownloadLink>
              </button> */}
              {generatePDFLoader && !isChinesePDF ? (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  disabled
                >
                  <span className="spinner spinner-lg spinner-warning"></span>{" "}
                  <span className="ml-10"> Download PDF(English Version)</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  onClick={() => generalPDF(false)}
                >
                  Download PDF(English Version)
                </button>
              )}

              {generatePDFLoader && isChinesePDF ? (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  disabled
                >
                  <span className="spinner spinner-lg spinner-warning"></span>{" "}
                  <span className="ml-10"> Download PDF(Chinese Version)</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  onClick={() => generalPDF(true)}
                >
                  Download PDF(Chinese Version)
                </button>
              )}
            </div>
          </CardBody>
        </Card>
        {productForEdit?.status &&
          productForEdit?.status === quoteStatuses.APPROVED &&
          checkPermission("QUOTATION", "can_confirm") && (
            <Card>
              <CardBody>
                <div className="d-flex flex-column">
                  <button
                    type="button"
                    className="btn btn-default mb-4 border bg-white border-dark text-dark"
                    onClick={confirmQuote}
                  >
                    Confirm signed quotation
                  </button>

                  <button
                    type="button"
                    className="btn btn-default mb-4 border bg-white border-dark text-dark"
                    onClick={() => { }}
                    disabled
                  >
                    Signed quotation
                  </button>
                </div>
              </CardBody>
            </Card>
          )}

        {productForEdit?.status &&
          checkPermission("JOB", "can_read") &&
          (productForEdit?.status === quoteStatuses.CONFIRMED ||
            productForEdit?.status === quoteStatuses.PENDING_PAYMENT) && (
            <Card>
              <CardBody>
                <div className="d-flex flex-column">
                  <button
                    type="button"
                    className="btn btn-default mb-4 border bg-white border-dark text-dark"
                    onClick={() => getJobOrder()}
                  >
                    Job Order
                  </button>
                </div>
              </CardBody>
            </Card>
          )}

        {productForEdit?.status &&
          (productForEdit?.status === quoteStatuses.APPROVED ||
            productForEdit?.status === quoteStatuses.CONFIRMED ||
            productForEdit?.status === quoteStatuses.SPECIAL_PENDING ||
            productForEdit?.status === quoteStatuses.PENDING_PAYMENT) &&
          checkPermission("QUOTATION", "can_confirm") && (
            <Card>
              <CardBody>
                <div className="d-flex flex-column">
                  <button
                    type="button"
                    className="btn btn-default mb-4 border bg-white border-dark text-dark"
                    onClick={() => setSignedDocumentModel(true)}
                  >
                    Signed Document
                  </button>
                </div>
              </CardBody>
            </Card>
          )}

        {productForEdit?.confirmed_by &&
          checkPermission("INVOICE", "can_add") &&
          showGenInvoiceBtn && (
            <Card>
              <CardBody>
                <div className="d-flex flex-column">
                  <button
                    type="button"
                    className="btn btn-default mb-4 border bg-white border-dark text-dark"
                    onClick={generateInvoice}
                  >
                    Generate Invoice
                  </button>
                </div>
              </CardBody>
            </Card>
          )}

        {productForEdit?.status &&
          productForEdit?.status === quoteStatuses.PENDING_PAYMENT &&
          checkPermission("INVOICE", "can_read") && (
            <Card>
              <CardBody>
                <div className="d-flex flex-column">
                  {invoiceGenereateLoader && invoiceData ? (
                    <button
                      type="button"
                      className="btn btn-default mb-4 border bg-white border-dark text-dark"
                      disabled
                    >
                      <span className="spinner spinner-lg spinner-warning"></span>{" "}
                      <span className="ml-10"> Download Invoice</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-default mb-4 border bg-white border-dark text-dark"
                      onClick={() => getInvoices(false)}
                    >
                      Download Invoice
                    </button>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

        {/* <button style={{ display: "none" }} type="button">
          <PDFDownloadLink
            className="generate_invoice_pdf"
            document={<InvoicePDF />}
            fileName={`Invoice-${quotation_no}.pdf`}
          >
            {" "}
            PDF
          </PDFDownloadLink>
        </button> */}

        {checkPermission("QUOTATION_DETAILS_SALES_REMARK", "can_read") && (
          <Card>
            <CardBody>
              <div className="d-flex flex-column">
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  onClick={() => setSalesRemarkModel(true)}
                >
                  Sales Remark ({totalSalesRemark})
                </button>
              </div>
            </CardBody>
          </Card>
        )}

        { productForEdit.history && productForEdit.history.length > 0 && (
          <Card>
            <CardBody>
              <div className="d-flex flex-column">
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  onClick={() => setHistoryModel(true)}
                >
                  History
                </button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>



      <Modal show={invoiceModel} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            List of invoices
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="overlay overlay-block cursor-default">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice No</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>{getInvoiceList()}</TableBody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => setInvoiceModel(false)}
              className="btn btn-delete btn-elevate"
            >
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={signedDocumentModel}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Signed Documents
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="overlay overlay-block cursor-default">
          <Row className="mt-0 pt-0">
            <Col className="text-right">
              <OverlayTrigger
                overlay={
                  <Tooltip id="products-delete-tooltip">
                    Upload Signed Document
                  </Tooltip>
                }
              >
                <a
                  className="btn btn-icon btn-light btn-sm ml-3"
                  onClick={() => uploadDocument()}
                >
                  <span className="svg-icon svg-icon-md">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Files/Upload.svg"
                      )}
                    />
                  </span>
                </a>
              </OverlayTrigger>
            </Col>
          </Row>
          <Table className="mt-2">
            <TableHead>
              <TableRow>
                <TableCell>Date Created</TableCell>
                <TableCell>File Name</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>{getDocumentList()}</TableBody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => setSignedDocumentModel(false)}
              className="btn btn-delete btn-elevate"
            >
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={jobOrderModel}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Job Order List
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mt-0 pt-0">
            <Col className="text-right">
              {checkPermission("JOB", "can_add") ? (
                <>
                  <Button
                    variant="primary"
                    className="mr-1"
                    onClick={() => {
                      createJobOrderDialog(true, false);
                    }}
                  >
                    Additional Job Order
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      createJobOrderDialog(false, false);
                    }}
                  >
                    New Job Order
                  </Button>
                </>
              ) : (
                ""
              )}
            </Col>
          </Row>
          <Table className="mt-2">
            <TableHead>
              <TableRow>
                <TableCell>Job Order No.</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Expected Job Date</TableCell>
                <TableCell>Job Order</TableCell>
                <TableCell>Signed Job Order</TableCell>
                <TableCell className="text-right">行动</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{getJobList()}</TableBody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setJobOrderMode(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={historyModel}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="mt-2">
            <TableHead>
              <TableRow>
                <TableCell>Update Date</TableCell>
                <TableCell>Updated By</TableCell>
                <TableCell>Approved/Rejected By</TableCell>
                <TableCell className="text-right">行动</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{getHistoryList()}</TableBody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setHistoryModel(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={createJobOrderModel}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            {getJobOrderLabel()}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="overlay overlay-block cursor-default">
          <Formik
            innerRef={ref}
            onSubmit={async (values, formikActions) => {
              // submitCreateJobOrder();
            }}
          >
            {({ values, handleChange, handleSubmit, submitForm }) => {
              return (
                <Form className="form form-label-right">
                  <div className="form-group ">
                    <FormLabel>Expected Job Date</FormLabel>
                    <Field
                      name="startDate"
                      type="datetime-local"
                      component={Input}
                      withFeedbackLabel={false}
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                      }}
                    />
                    {isSubmitForm && !startDate  ? (
                      <div className="text-danger">
                        Expected job date & time is required
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group ">
                    <FormLabel>Worker</FormLabel>
                    <Field
                      name="worker"
                      type="number"
                      component={Input}
                      withFeedbackLabel={false}
                      value={worker}
                      onChange={(e) => {
                        setWorker(e.target.value);
                      }}
                    />
                    {isSubmitForm && !worker  ? (
                      <div className="text-danger">
                        Worker is required
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-group ">
                    <FormLabel>Working Location</FormLabel>
                    <SelectFilter
                      // isMulti
                      onChange={setSelectedWlocations}
                      value={selectedWlocations}
                      options={customerLocations}
                    />
                    {isSubmitForm && !selectedWlocations  ? (
                      <div className="text-danger">
                        Working location is required
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>

        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => setCreateJobOrderModel(false)}
              className="btn btn-secondary mr-2"
            >
              Close
            </button>
            <button
              type="button"
              onClick={submitCreateJobOrder}
              className="btn btn-primary btn-elevate"
            >
              Confirm
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showJobLimitAlert}
        onHide={() => setShowJobLimitAlert(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Job order quantity cannot large than special job quantity</span>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => setShowJobLimitAlert(false)}
              className="btn btn-light btn-elevate"
            >
              Ok
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <UploadDocumentModal
        show={uploadDocumentModel}
        doc={productForEdit}
        onHide={() => setUploadDocumentModel(false)}
        onSuccess={() => refreshPage()}
      />

      { productForEdit?._id ? <SalesRemarkModal
        show={salesRemarkModel}
        quote_id={productForEdit._id}
        onHide={() => setSalesRemarkModel(false)}
        onShow={() => setSalesRemarkModel(true)}
        totalSalesRemark={(val) => setTotalSalesRemark(val)}
      /> : '' }

      <Card>
        <form
          action={`${API_URL}/pdf/quotation`}
          method="post"
          target="my_iframe"
          id="url_form"
        >
          <input type="hidden" value={output} name="html"></input>
          <input
            type="hidden"
            value={`${window.location.origin}/pdf/quotation`}
            name="url"
          ></input>
          <input type="hidden" value={quotation_no} name="quotation_no"></input>
          <input type="hidden" value={isChinesePDF} name="is_chinese"></input>
        </form>
        <iframe
          src="https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif"
          name="my_iframe"
          frameBorder="0"
          style={{ height: "70vh", width: "100%" }}
        ></iframe>
      </Card>

      {displayJobOrderPreview && jobOrderData ? (
        <span style={{ display: "none" }}>
          <JobOrderPDF isChinese={true} data={jobOrderData || null} />
        </span>
      ) : (
        ""
      )}
      {displayInvoicePreview && invoiceData ? (
        <span style={{ display: "none" }}>
          <GenereateInvoicePDF isChinese={false} data={invoiceData || null} />
        </span>
      ) : (
        ""
      )}
    </>
  );
}
