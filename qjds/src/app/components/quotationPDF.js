import React, { useEffect } from "react";
import questionPDF from './pictureQUOPDF'
import ReactHTMLParser from "react-html-parser";
import { invoiceStatuses } from "../modules/invoices/partials/statuses";
import { getDisplayEditorContent } from "../utils/utils";
import "./pdf.css";
let timer;
const QotationPDF = ({ isChinese, data }) => {
  let {
    quotation_no,
    issueDate: create_date,
    customer_id,
    places,
    contact_person,
    payment_term_id,
    customer_office_worker,
    services,
    remark_desc,
    amount,
  } = data;
  const translateTime = (typeCal) => {
    switch (typeCal) {
      case "Every time":
        return isChinese ? "每次" : "Every time";
      case "Every month":
        return isChinese ? "每月" : "Per month";
      case "Per month":
        return isChinese ? "每月" : "Per month";
      case "Every quarter":
        return isChinese ? "每季" : "Quarterly";
      case "Every Half Year":
        return isChinese ? "每半年" : "Every Half Year";
      case "Every Year":
        return isChinese ? "每年" : "Per Year";
      default:
        return;
    }
  };

  const displayMinimumConsumption = (feet = 0, price = 0, discount = 0, service) => {
    let amount = feet * price * ((100 - discount) / 100);
    if (service && service.service_minimum_consumption && amount < service.service_minimum_consumption) {
      return true
    } else {
      return false
    }
  };

  const debounce = function (e, d) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      if (document.getElementById("url_form")) {
        document.getElementById("url_form").submit();
      }
    }, d);
  };

  useEffect(() => {
    debounce("test", 1000);
  }, [data]);

  return (
    <div
      className="quotation-pdf-component"
      id="quotation-pdf-component"
      onInput={(e) => {
        debounce(e.target.value, 1000);
      }}
    >
      <div>
        <div
          className="d-flex w-100 justify-content-between align-items-center mb-3"
          style={{ borderBottom: "1px solid", padding: "10px 0px" }}
        >
          <div>
            <img
              src="/media/details_logo.png"
              style={{ maxHeight: "73.6px" }}
              alt="Masterclean"
            />
          </div>

          <h1>
            <strong>{isChinese ? "報價單" : "Quotation"}</strong>
          </h1>

          <div
            className="d-flex justify-content-between"
            style={{ flexDirection: "column" }}
          >
            <p className="h5 small text-secondary">
              {isChinese ? "報價單編號" : "Quotation No"}:{" "}
              <span className="text-dark font-weight-bold">
                #{quotation_no}
              </span>
            </p>
            <p className="text-secondary">
              {isChinese ? "日期" : "Date"} :{" "}
              <span className="text-dark font-weight-bold">
                {Intl.DateTimeFormat("en-GB", {
                  dateStyle: "medium",
                })
                  .format(new Date(create_date || Date.now()))
                  .replace(/\//g, " ")}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div>
        <table style={{ fontSize: "16px", width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ width: "17%", verticalAlign: "top" }}>
                <strong>{isChinese ? "客戶名稱" : "Customer Name"}:</strong>
              </td>
              <td colSpan={3} style={{ width: "83%", verticalAlign: "top" }}>
                {customer_id?.customer_name}
              </td>
            </tr>
            <tr>
              <td style={{ width: "17%", verticalAlign: "top" }}>
                <strong>{isChinese ? "地址" : "Address"}:</strong>
              </td>
              <td colSpan={3} style={{ width: "83%", verticalAlign: "top" }}>
                {(customer_id?.location_id &&
                  customer_id?.location_id[0]?.location_address) ||
                  ""}
              </td>
            </tr>
            <tr>
              <td style={{ width: "17%", verticalAlign: "top" }}>
                <strong>{isChinese ? "聯絡人姓名" : "Contact Person"}:</strong>
              </td>
              <td style={{ width: "45%", verticalAlign: "top" }}>
                {contact_person?.contact_name || ""}
              </td>
              <td style={{ width: "23%", verticalAlign: "top" }}>
                <strong>
                  {isChinese ? "聯絡電話" : "Customer Contact No"}:
                </strong>
              </td>
              <td style={{ width: "15%", verticalAlign: "top" }}>
                <span>
                  {contact_person?.office_number ||
                    contact_person?.mobile_number}{" "}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ width: "17%", verticalAlign: "top" }}>
                <strong>{isChinese ? "電郵" : "Email"}:</strong>
              </td>
              <td style={{ width: "45%", verticalAlign: "top" }}>
                {contact_person?.email}
              </td>
              <td style={{ width: "23%", verticalAlign: "top" }}>
                <strong>{isChinese ? "傳真號碼" : "Customer Fax No."}:</strong>
              </td>
              <td style={{ width: "15%", verticalAlign: "top" }}>
                {contact_person?.fax_number}
              </td>
            </tr>
            <tr>
              <td style={{ width: "17%", verticalAlign: "top" }}>
                <strong>
                  {isChinese ? "客戶服務主任" : "Customer Officer"}:
                </strong>
              </td>
              <td style={{ width: "45%", verticalAlign: "top" }}>
                {data?.customer_id?.customer_officer_id?.displayname} (
                {data?.customer_id?.customer_officer_id?.email})
              </td>
              <td style={{ width: "23%", verticalAlign: "top" }}>
                <strong>{isChinese ? "服務專線" : "Service Hotline"}:</strong>
              </td>

              <td style={{ width: "15%", verticalAlign: "top" }}>
                {data?.customer_id?.customer_officer_id?.hotline}
              </td>
            </tr>
          </tbody>{" "}
        </table>
        <br />
        <strong style={{ fontSize: "15px" }}>
          {isChinese ? "工作地點" : "Working Location"}
        </strong>
        <ul>
          { (data?.hide_working_location) ? <li style={{ fontSize: 15 }}>
            {isChinese ? "請在以下服務內容中查看" : "Please see on below service item"}
          </li> : places.map((place, id) => {
              return (
                <li key={id} style={{ fontSize: 15 }}>
                  {place.location_address} {(place.feet)? `(${place.feet})` : '' }
                </li>
              );
            })
          }
        </ul>
        <br />

        <div className="border-bottom border-dark border-1 p-4 pt-10 row justify-content-between">
          <p className="h4 text-secondary">
            {isChinese ? "服務內容" : "Service Description"}
          </p>
          {(!window.location.pathname.includes("/job")) ? <p className="h4 text-secondary">{isChinese ? "金額" : "Amount"}</p> : ''}
        </div>

        <div>
          {services.map((service, id) => {
            return (
              <div key={id} className="row justify-content-between mt-5 p-4">
                <div style={{ width: "75%" }}>
                  {/* <h6>{service.service_id?.service_name}</h6> */}
                  <div style={{ fontSize: 15 }}
                    dangerouslySetInnerHTML={{
                      __html: getDisplayEditorContent(service?.desc)
                    }}
                  />
                  <br></br>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: getDisplayEditorContent(service?.offer)
                    }}
                  />
                </div>
                {(!window.location.pathname.includes("/job")) ? <div>
                  {displayMinimumConsumption(service.feet, service.cost, service.discount, service.service_id) ? <p style={{ fontSize: 18, textAlign: "right" }}>
                    ${service.service_id.service_minimum_consumption}
                  </p> : <p style={{ fontSize: 18, textAlign: "right" }}>
                    {service?.discount && service?.discount !== "" && service?.discount !== 0 ? (
                      <p
                        className="mb-0"
                        style={{ textDecoration: "line-through" }}
                      >
                        ${(service?.feet * service?.cost).toFixed(2)}
                      </p>
                    ) : null}
                    {service?.discount && service?.discount !== "" && service?.discount !== 0
                      ? isChinese
                        ? "優惠價"
                        : "Special Offer"
                      : null}
                    <p>
                      $
                      {(
                        service.feet *
                        Number(service?.cost || 0) *
                        ((100 - service.discount) / 100)
                      ).toFixed(2)}
                      {service?.calculation &&
                        `/${translateTime(service?.calculation)}`}
                    </p>
                  </p>}
                </div> : ''}
              </div>
            );
          })}
        </div>

        <div
          className="p-4 pt-10 row justify-content-between"
          style={{ fontSize: "16px", borderTop: "1px solid #000" }}
        >
          <p className="text-secondary">
            <b>{isChinese ? "專員" : "Customer Officer"}:</b>{" "}
            {data?.customer_id?.customer_officer_id?.displayname}
            {/* {data?.customer_office_worker_id?.email} */}
          </p>
          {(!window.location.pathname.includes("/job")) ? <p className="text-secondary ">
            <b>{isChinese ? "合共" : "Total Amount"}:</b>{" "}
            <span className="ml-8">${(amount || 0).toFixed(2)}</span>
          </p> : ''}
        </div>

        {/* REMARKS */}
        <div className="pt-7" style={{ fontSize: 15 }}>
          <p
            className="h4 text-secondary pb-2"
            style={{ fontSize: 20, borderBottom: "1px solid #000" }}
          >
            {isChinese ? "備註" : "Remarks"}:
          </p>
          <p style={{ fontSize: 15 }} className="text-secondary">{ReactHTMLParser(getDisplayEditorContent(remark_desc))}</p>
        </div>

        {/* PAYMENT METHODS */}
        <div className="pt-7" style={{ fontSize: 15 }}>
          <p
            className="h4 text-secondary pb-2 mb-6"
            style={{ fontSize: 20, borderBottom: "1px solid #000" }}
          >
            {isChinese ? "付款方法" : "Payment Method"}:
          </p>
          <div style={{ fontSize: 15 }}
            className="text-secondary"
            dangerouslySetInnerHTML={{
              __html: getDisplayEditorContent(payment_term_id?.payment_method_content)
            }}
          />
        </div>

        <div className="row justify-content-between mt-12 p-4">
          <div style={{ borderBottom: "1px solid #000", width: "45%" }}>
            <p>
              {isChinese ? "確認和接受" : "Confirmed and Accepted by"}
              <br />

              {customer_id?.customer_name}
            </p>
          </div>

          <div style={{ borderBottom: "1px solid #000", width: "45%" }}>
            <p>
              {isChinese ? "海富清潔滅蟲服務有限公司" : "For and behalf of"}
              <br />
              {isChinese ? "代表" : "MasterClean Hygiene Solution Limited"}
            </p>
            {data?.approved_by ? (
              <img
                style={{ width: "300px", maxWidth: "100%" }}

                src={questionPDF}
                alt="masterclean-signature"
                className="mb-4"
              />
            ) : (
              <div style={{ height: "82px" }} />
            )}
          </div>
        </div>
        <div
          className="row justify-content-between p-4 company-about"
          style={{ paddingTop: 0 }}
        >
          <div style={{ width: "45%" }}>
            <p style={{ height: "39px" }}>{isChinese ? "日期" : "Date"}:</p>

            <div style={{ marginTop: "26px" }}>
              <p>
                {isChinese
                  ? "海富清潔滅蟲服務有限公司"
                  : "MasterClean Hygiene Solution Limited"}
              </p>
              <p>
                {isChinese ? "熱線" : "Hotline"}: (852) 3975 6300{" "}
                {isChinese ? "傳真" : "Fax"}: (852) 2756 3141
              </p>
              <p>{isChinese ? "網站" : "Website"}: www.masterclean.hk</p>
              <p>
                {isChinese
                  ? "九龍觀塘鴻圖道45號宏光工業大廈8字樓J室"
                  : "Flat J, 8/F, Wang Kwong Industrial Building, 45 Hung To Road, Kwun Tong, KLN"}
              </p>
            </div>
          </div>
          <div style={{ width: "45%" }}>
            <p style={{ height: "39px" }}>
              {isChinese
                ? "授權簽署及公司印章"
                : "Authorized Signature and Company Chop"}
              <br />
              {Intl.DateTimeFormat("en-GB", {
                dateStyle: "medium",
              })
                .format(new Date(create_date || Date.now()))
                .replace(/\//g, " ")}
            </p>
            <div style={{ marginTop: "26px" }}>
              <img
                src="/media/all-in-one.jpg"
                alt="masterclean-signature"
                style={{ maxHeight: "70px", maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QotationPDF;
