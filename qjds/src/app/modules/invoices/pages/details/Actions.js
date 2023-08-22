import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import SearchSelect from "react-select"
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { invoiceStatuses } from "../../../invoices/partials/statuses";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { API_URL } from "../../../../API_URL";
import { checkPermission } from "../../../../utils/utils";
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
import * as customersActions from "../../../customers/_redux/customers/customersActions";
import * as invoiceActions from "../../../invoices/_redux/invoice/invoiceActions";
import { formateAmount } from "../../../../utils/utils";
import MicroHeiRegular from "../../../../../_metronic/_assets/font/Micro-Hei-Regular.ttf";
import axios from "axios";
import { node } from "prop-types";
import CircularProgress from '@material-ui/core/CircularProgress';
Font.register({ family: "MicroHeiRegular", src: MicroHeiRegular });

const INVOICE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL_DEV + "invoices/"
    : process.env.REACT_APP_API_URL + "invoices/";

const styles = StyleSheet.create({
  page: {
    fontSize: "10px",
    fontFamily: "MicroHeiRegular",
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
});

export default function Actions({
  reloadInvoice,
  productForEdit,
  approveInvoice,
  rejectInvoice,
  setIsChenese,
  generatePDFLoader,
  setIsEdit,
  editPDFLoader
}) {
  const dispatch = useDispatch();
  const [output, setOutput] = useState("");
  const [customer, setCustomer] = useState([]);
  const [printLoader, setPrintLoader] = useState(false);
  const [selectedContactPerson, setSelectedContactPerson] = useState([])
  const [contactPersonModel, setContactPersonModel] = useState(false)
  const history = useHistory();

  const { customers } = useSelector(
    (state) => ({
      customers: state.customers.entities,
    }),
    shallowEqual
  );

  const submitHandler = () => {
    const requestBody = {
      contact_person: selectedContactPerson,
      status_update: false
    }

    if (productForEdit && selectedContactPerson && selectedContactPerson !== "") {
      axios.put(INVOICE_URL + productForEdit._id, requestBody)
        .then((res) => {
          if (res.data.success) {
            setContactPersonModel(false)
            reloadInvoice()
            document.getElementById('invoice_pdf_iframe').src += ''
          }
        })
        .catch((err) => { })
    }
  }

  useEffect(() => {
    setInterval(() => {
      if (document.getElementById("invoice-pdf-component")) {
        setOutput(document.getElementById("invoice-pdf-component").innerHTML);
      }
    }, 1000);
  }, []);
  
  const InvoicePDF = () => (
    <Document>
      {productForEdit ? (
        <Page size="LETTER" style={styles.page} wrap debug={false}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View style={{ flex: 2 }}>
              <Image src="/media/details_logo.png" style={{ width: "40%" }} />
              <Text style={{ fontSize: "18px", marginTop: "5px" }}>
                Invoice To:
              </Text>
              <Text style={{ marginTop: "5px" }}>
                {productForEdit.contact_person?.contact_name || ""}
              </Text>
              <Text style={{ marginTop: "3px" }}>
                {productForEdit.customer_id?.customer_name}
              </Text>
              <Text style={{ marginTop: "3px" }}>
                {productForEdit.address && productForEdit.address.length > 0
                  ? productForEdit.address[0].location_address
                  : ""}
              </Text>
              <Text style={{ marginTop: "3px" }}>
                Phone: {productForEdit.customer_id?.office_number}
              </Text>
              <Text style={{ marginTop: "3px" }}>
                Email: {productForEdit.customer_id?.email}
              </Text>
            </View>
            <View style={{ flex: 1, textAlign: "right" }}>
              <Text style={{ fontSize: "25px" }}>INVOICE</Text>
              <Text style={{ marginTop: "5px" }}>
                Invoice No: #{productForEdit.invoice_no}
              </Text>
              <Text style={{ marginTop: "3px" }}>
                Date:{" "}
                {Intl.DateTimeFormat("en-GB", {
                  dateStyle: "medium",
                })
                  .format(new Date(productForEdit.date || Date.now()))
                  .replace(/\//g, " ")}
              </Text>
              <Text
                style={{
                  borderBottom: "1px",
                  marginTop: "14px",
                  marginBottom: "10px",
                  borderColor: "#E4E6EF",
                }}
              ></Text>
              <Text>
                Contract / Quotation No: #{productForEdit.quote_contract_no}
              </Text>
              <Text style={{ marginTop: "3px" }}>
                Job Date / Period:{" "}
                {productForEdit.job_start_date &&
                  productForEdit.job_end_date ? (
                  <Text>
                    {Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                    })
                      .format(
                        new Date(productForEdit.job_start_date || Date.now())
                      )
                      .replace(/\//g, " ")}
                    To{" "}
                    {Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                    })
                      .format(
                        new Date(productForEdit.job_end_date || Date.now())
                      )
                      .replace(/\//g, " ")}
                  </Text>
                ) : (
                  <Text></Text>
                )}
              </Text>
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "15px",
              fontSize: "16px",
            }}
          >
            <Text
              style={{
                padding: "3px",
                flex: 2,
                backgroundColor: "red",
                color: "white",
              }}
            >
              Service Item(S)
            </Text>
            <Text
              style={{
                padding: "3px",
                flex: 1,
                backgroundColor: "grey",
                color: "white",
                textAlign: "right",
              }}
            >
              Amount
            </Text>
          </View>

          {productForEdit.services.map((service, id) => (
            <View key={id}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "5px",
                }}
              >
                <Text style={{ flex: 2 }}>{service?.title}</Text>
                <Text style={{ flex: 1, textAlign: "right" }}>
                  {formateAmount(service.price)}
                </Text>
              </View>
            </View>
          ))}
          <Text
            style={{
              borderBottom: "1px",
              marginTop: "5px",
              marginBottom: "5px",
              borderColor: "#E4E6EF",
            }}
          ></Text>
          <View
            style={{ display: "flex", flexDirection: "row", marginTop: "5px" }}
          >
            <Text style={{ flex: 2, textAlign: "right" }}>Total Amount:</Text>
            <Text style={{ flex: 1, textAlign: "right" }}>
              {formateAmount(productForEdit.amount)}
            </Text>
          </View>
          <Text
            style={{
              fontSize: "14px",
              marginTop: "15px",
            }}
          >
            Payment terms:
          </Text>
          <Text style={{ marginTop: "5px" }}>
            {productForEdit.payment_term_id?.payment_method_content}
          </Text>

          <View
            style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}
          >
            <Text style={{ flex: 2 }}>For and behalf of</Text>
            <Text style={{ flex: 1 }}></Text>
            <Text style={{ flex: 2 }}></Text>
          </View>

          <View
            style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
          >
            <Text style={{ flex: 2 }}>MasterClean Hygiene Solution Limited</Text>
            <Text style={{ flex: 1 }}></Text>
            <Text style={{ flex: 2 }}></Text>
          </View>

          <View
            style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
          >
            <Image
              style={{ flex: 2 }}
              src="/static/media/signature.5d01e54c.jpg"
            />
            <Text style={{ flex: 1 }}></Text>
            <Text style={{ flex: 2 }}></Text>
          </View>

          <View
            style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
          >
            <Text
              style={{
                flex: 2,
                borderBottom: "2px",
                marginTop: "14px",
                marginBottom: "5px",
                borderColor: "#E4E6EF",
              }}
            ></Text>
            <Text style={{ flex: 1 }}></Text>
            <Text
              style={{
                flex: 2,
              }}
            ></Text>
          </View>

          <View
            style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
          >
            <Text style={{ flex: 2 }}>Authorized Company Chop</Text>
            <Text style={{ flex: 1 }}></Text>
            <Text style={{ flex: 2 }}></Text>
          </View>
          <View
            style={{ display: "flex", flexDirection: "row", marginTop: "2px" }}
          >
            <Text style={{ flex: 2 }}>
              {Intl.DateTimeFormat("en-GB", {
                dateStyle: "medium",
              })
                .format(new Date(productForEdit.date || Date.now()))
                .replace(/\//g, " ")}
            </Text>
            <Text style={{ flex: 1 }}></Text>
            <Text style={{ flex: 2 }}></Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: "15px" }}>
            <View style={{ flex: 1 }}>
              <Text>MasterClean Hygiene Solution Limited</Text>
              <Text style={{ marginTop: "5px" }}>
                Hotline: (852) 3975 6300 Fax: (852) 2756 3141
              </Text>
              <Text style={{ marginTop: "5px" }}>
                Website: www.masterclean.hk
              </Text>
              <Text style={{ marginTop: "5px" }}>
                Flat J, 8/F, Wang Kwong Industrial Building, 45 Hung To Road,
                Kwun Tong, KLN
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Image src="/media/all-in-one.jpg" />
            </View>
          </View>

          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
          <Text
            style={styles.invoiceNo}
            render={() => `Invoice No.: #${productForEdit.invoice_no}`}
            fixed
          />
        </Page>
      ) : (
        ""
      )}
    </Document>
  );

  const onHide = () => {
    setContactPersonModel(false)
  }

  useEffect(() => {
    setSelectedContactPerson(productForEdit?.contact_person?._id || "")
    dispatch(
      customersActions.findCustomers({
        pageSize: 100,
        filter: { _id: productForEdit?.customer_id?._id },
        customer_id: productForEdit?.customer_id?._id
      })
    );
    // eslint-disable-next-line
  }, [productForEdit])

  useEffect(() => {
    if (customers && customers.length > 0 && productForEdit.customer_id) {
      customers.filter((item) => {
        if (item._id == productForEdit?.customer_id?._id) {
          setCustomer({
            label: item.customer_name,
            value: item._id,
            cp: item.contact_person,
            location_id: item.location_id,
          });
        }
      });
    }
  }, [customers])

  const contactPersonOptions = customers && customer
    ? customer?.cp?.map((cp) => {
      return {
        label: cp?.contact_name,
        value: cp?._id,
      };
    })
    : []

  function printInvoice() {
    setPrintLoader(true)
    setTimeout(() => {
      // if (document.getElementById("url_form")) {
      //   document.getElementById("url_form").submit();
      // }
      let post_data = {
        html: document.getElementById("invoice-pdf-component")
          ? document.getElementById("invoice-pdf-component").innerHTML
          : "",
        url: `${window.location.origin}/pdf/invoice`,
        invoice_no: productForEdit.invoice_no,
        is_chinese: false,
      };

      axios
        .post(API_URL + "/pdf/invoice", post_data, {
          responseType: "blob", // VERY IMPORTANT
          headers: { Accept: "application/pdf" },
        })
        .then((res) => {
          console.log(res.data);
          var blob = new Blob([res.data], { type: 'application/pdf' }); //this make the magic
          var blobURL = URL.createObjectURL(blob);

          var iframe = document.createElement('iframe'); //load content in an iframe to print later
          document.body.appendChild(iframe);

          iframe.style.display = 'none';
          iframe.src = blobURL;
          iframe.onload = function () {
            setTimeout(function () {
              iframe.focus();
              iframe.contentWindow.print();
            }, 1);
          };
          setPrintLoader(false)
        });
    }, 500);
  }

  return (
    <>
      <div className="d-flex flex-column">
        <Card>
          <CardBody>
            <div className="d-flex flex-column">
              {(productForEdit.status == invoiceStatuses.WAITING ||
                productForEdit.status == invoiceStatuses.PARTIAL_PAYMENT ||
                productForEdit.status == invoiceStatuses.PENDING ||
                productForEdit.status == invoiceStatuses.REJECT) &&
                checkPermission("INVOICE", "can_edit") ? (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  onClick={() => {
                    history.push(`/invoices/${productForEdit._id}/edit`);
                  }}
                >
                  Edit
                </button>
              ) : (
                ""
              )}

              {(productForEdit.status == invoiceStatuses.WAITING ||
                productForEdit.status == invoiceStatuses.REJECT) &&
                checkPermission("INVOICE", "can_approval") ? (
                <button
                  type="button"
                  className="btn btn-primary mb-4"
                  onClick={() => approveInvoice()}
                >
                  Approve
                </button>
              ) : (
                ""
              )}

              {(productForEdit.status == invoiceStatuses.WAITING ||
                productForEdit.status == invoiceStatuses.REJECT) &&
                checkPermission("INVOICE", "can_approval") ? (
                <button
                  type="button"
                  className="btn btn-primary mb-4 bg-danger border-danger"
                  onClick={() => rejectInvoice()}
                >
                  Reject
                </button>
              ) : (
                ""
              )}

              {productForEdit.status == invoiceStatuses.WAITING ||
                productForEdit.status == invoiceStatuses.PAID ||
                productForEdit.status == invoiceStatuses.PARTIAL_PAYMENT ||
                productForEdit.status == invoiceStatuses.PENDING ||
                productForEdit.status == invoiceStatuses.REJECT ? (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  onClick={
                    () => setIsChenese(false)
                    // document.querySelector(".generate_invoice_pdf").click()
                  }
                >
                  Download Invoice PDF
                  {
                    generatePDFLoader ? <CircularProgress size={14} style={{ marginLeft: "10px" }}></CircularProgress> : null
                  }
                </button>
              ) : (
                ""
              )}

              {productForEdit.status == invoiceStatuses.WAITING ||
                productForEdit.status == invoiceStatuses.PAID ||
                productForEdit.status == invoiceStatuses.PARTIAL_PAYMENT ||
                productForEdit.status == invoiceStatuses.PENDING ||
                productForEdit.status == invoiceStatuses.REJECT ? (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  onClick={() => printInvoice()}
                >
                  Print Invoice
                  {
                    printLoader ? <CircularProgress size={14} style={{ marginLeft: "10px" }}></CircularProgress> : null
                  }
                </button>
              ) : (
                ""
              )}

              {productForEdit.status == invoiceStatuses.WAITING ||
                productForEdit.status == invoiceStatuses.PAID ||
                productForEdit.status == invoiceStatuses.PARTIAL_PAYMENT ||
                productForEdit.status == invoiceStatuses.PENDING ||
                productForEdit.status == invoiceStatuses.REJECT ? (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  onClick={() => setIsEdit({ bool: false, editBool: true })}
                >
                  Old Company Name PDF
                  {
                    editPDFLoader ? <CircularProgress size={14} style={{ marginLeft: "10px" }}></CircularProgress> : null
                  }
                </button>
              ) : (
                ""
              )}

              <button style={{ display: "none" }} type="button">
                <PDFDownloadLink
                  className="generate_invoice_pdf"
                  document={<InvoicePDF />}
                  fileName={`Invoice-${productForEdit.invoice_no}.pdf`}
                >
                  {" "}
                  PDF
                </PDFDownloadLink>
              </button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="d-flex flex-column">
              <button
                type="button"
                className="btn btn-default border bg-white border-dark text-dark"
                onClick={() => { setContactPersonModel(true) }}
              >
                Change Contact Person
              </button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <form
            action={`${API_URL}/pdf/invoice`}
            method="post"
            target="my_iframe"
            id="url_form"
          >
            <input type="hidden" value={output} name="html"></input>
            <input
              type="hidden"
              value={`${window.location.origin}/pdf/invoice`}
              name="url"
            ></input>
            <input
              type="hidden"
              value={productForEdit?.invoice_no}
              name="invoice_no"
            ></input>
            {/* <input type="hidden" value={false} name="is_chinese"></input> */}
          </form>
          <iframe
            src="https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif"
            name="my_iframe"
            frameBorder="0"
            id="invoice_pdf_iframe"
            style={{ height: "70vh", width: "100%" }}
          ></iframe>
        </Card>
      </div>

      <Modal
        show={contactPersonModel}
        onHide={onHide}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Change Contact Person</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchSelect
            name="district"
            options={contactPersonOptions}
            value={contactPersonOptions?.find((item) => item?.value === selectedContactPerson)}
            onChange={(opt) => { setSelectedContactPerson(opt?.value || "") }}
            placeholder="All"
          />
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={onHide}
              className="btn btn-light btn-elevate"
            >
              Cancel
            </button>
            <> </>
            <button
              type="button"
              onClick={submitHandler}
              className="btn btn-delete btn-elevate btn-primary"
            >
              Confirm
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
