import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import moment from "moment";
import "./pdf.css";
let timer;
const QuestionnairePDF = ({ isChinese, data }) => {
  const productForEdit = data;
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
    debounce("test", 2000);
  }, [data]);

  function checkQuestionAns(id, score) {
    let flag = false
    if (data.question_score) {
      data.question_score.filter((item) => {
        if (item.question_id == id && score == item.score) {
          flag = true
        }
      })
    }
    return flag
  }

  return (
    <div className="questionnaire-pdf-component" id="questionnaire-pdf-component">
      <div>
        <Row className="pt-8" style={{ borderBottom: "1px solid", padding: "10px 0px" }}>
          <Col sm={3}>
            <img
              src="/media/details_logo.png"
              style={{ maxHeight: "73.6px" }}
              alt="Masterclean"
            />
          </Col>
          <Col sm={9}>
            <h1>
              <strong>MasterClean Job Order Questionnaire</strong>
            </h1>
            <div style={{ fontSize: "16px" }}>
              Job Order No: #{data?.job_no || ""}
            </div>
            <div style={{ fontSize: "16px" }}>
              Quotation / Contract No: {data?.quote_contract_no
                      ? `#${data?.quote_contract_no}`
                      : ""}
            </div>
          </Col>
        </Row>
      </div>
      <div className="mt-5">
        <table style={{ fontSize: "16px", width: "50%", }}>
          <tbody>
            <tr>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                <strong>Customer Name:</strong>
              </td>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                {data?.customer_id?.customer_name}
              </td>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                <strong>Customer Contact No.:</strong>
              </td>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                {data?.customer_contact_no}
              </td>
            </tr>
            <tr>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                <strong>Address:</strong>
              </td>
              <td style={{ width: "10%", verticalAlign: "top" }}>
              {(data?.customer_id?.location_id &&
                data?.customer_id?.location_id[0]
                  ?.location_address) ||
                ""}
              </td>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                <strong>Service Hotline:</strong>
              </td>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                {data?.customer_id?.customer_officer_id?.hotline}
              </td>
            </tr>
            <tr>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                <strong>Email:</strong>
              </td>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                {data?.contact_person_id?.email}
              </td>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                <strong>Working Time:</strong>
              </td>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                {data?.start_time ? moment(data?.start_time).format("HH:mm") : ""}
              </td>
            </tr>
            <tr>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                <strong>Contact Person:</strong>
              </td>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                {data?.contact_person || ""}
              </td>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                <strong>Leaving Time:</strong>
              </td>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                {data?.end_time ? moment(data?.end_time).format("HH:mm") : ""}
              </td>
            </tr>
            <tr>
              <td style={{ width: "25%", verticalAlign: "top" }}>
                <strong>Working Location:</strong>
              </td>
              <td colSpan={3} style={{ width: "75%", verticalAlign: "top" }}>
                {data?.working_location?.location_address}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-8" style={{ border: "1px solid" }}>
        <div className="text-center" style={{ fontSize: "16px", backgroundColor: 'red', color: 'white', padding: '5px' }}>
          <strong>Customer Satisfaction Survey 客戶滿意度調查表</strong>
        </div>
        <div style={{ padding: '10px', fontSize: "14px",  }}>
          MasterClean always value your suggestions and comments. We would like to invite you to fill in the following questionnaire to improve our service(s):
          <table style={{ width: "100%", marginTop: '10px' }}>
            <tbody>
              { data?.questionnaire?.map((item) => {
                  return (<tr>
                    <td style={{ width: "60%", verticalAlign: "top" }}>
                      {item.question_title}
                    </td>
                    <td style={{ width: "40%", verticalAlign: "top" }}>
                      <input type='checkbox' checked={checkQuestionAns(item._id, '1')}></input> 非常差
                      <input type='checkbox' className="ml-10" checked={checkQuestionAns(item._id, '2')}></input> 差
                      <input type='checkbox' className="ml-10" checked={checkQuestionAns(item._id, '3')}></input> 普通
                      <input type='checkbox' className="ml-10" checked={checkQuestionAns(item._id, '4')}></input> 滿意
                      <input type='checkbox' className="ml-10" checked={checkQuestionAns(item._id, '5')}></input> 非常滿意
                    </td>
                  </tr>)
                })
              }
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="row justify-content-between p-4 company-about"
        style={{ paddingTop: 0 }}
      >
        <div style={{ width: "45%" }}>

          <div style={{ marginTop: "26px" }}>
            <p>
              {isChinese
                ? "海富清潔滅蟲服務有限公司"
                : "MasterClean Carpet Systems Limited"}
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
  );
};

export default QuestionnairePDF;
