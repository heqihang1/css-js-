/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import { API_URL } from "../../../../app/API_URL";
import axios from "axios";
import { Avatar } from "@material-ui/core";
import moment from "moment";
import { useHistory } from "react-router-dom";

export default function SalesBusiness({ className }) {
  const history = useHistory();
  const [key, setKey] = useState("Month")
  const [sales, setSales] = useState([])

  useEffect(() => {
    axios.get(API_URL + "dashboard/sales_business?type=" + key).then((res) => {
      setSales(res.data)
    })
  }, [key]);


  function redirectToReport(item) {
    let from = ''
    let to = ''
    if (key === "Month") {
      from = moment().startOf('month').format('YYYY-MM-DD');
      to = moment().endOf('month').format('YYYY-MM-DD');
    } else if (key === "Week") {
      from = moment(moment().startOf('week')).add(1, 'days').format("YYYY-MM-DD");
      to = moment(moment().endOf('week')).add(1, 'days').format("YYYY-MM-DD");
    } else if (key === "Day") {
      from = moment().format('YYYY-MM-DD');
      to = moment().format('YYYY-MM-DD');
    }
    history.push(`/reports/sales-business?from=${from}&to=${to}&customer_office_worker_id=${item.customer_office_worker_id}&customer=${item.customer}`)
  }

  return (
    <>
      <div className={`card card-custom ${className}`}>
        {/* Head */}
        <div className="card-header border-0">
          <h3 className="card-title font-weight-bolder text-dark">Sales Business</h3>
          <div className="card-toolbar">
            <Tab.Container defaultActiveKey={key}>
              <Nav
                as="ul"
                onSelect={(_key) => setKey(_key)}
                className="nav nav-pills nav-pills-sm nav-dark-75"
              >
                <Nav.Item className="nav-item" as="li">
                  <Nav.Link
                    eventKey="Month"
                    className={`nav-link py-2 px-4 ${key === "Month" ? "active" : ""}`}
                  >
                    Month
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="nav-item" as="li">
                  <Nav.Link
                    eventKey="Week"
                    className={`nav-link py-2 px-4 ${key === "Week" ? "active" : ""}`}
                  >
                    Week
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="nav-item" as="li">
                  <Nav.Link
                    eventKey="Day"
                    className={`nav-link py-2 px-4 ${key === "Day" ? "active" : ""}`}
                  >
                    Day
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Tab.Container>
          </div>
        </div>
        {/* Body */}
        <div className="card-body pt-2">
          {sales.length === 0
            ? <div style={{ position: "absolute", bottom: "10%", left: "40%" }} className="text-black-50"><h5>No Data</h5></div>
            : (sales.map((a, index) => (
              <div
                className={`d-flex align-items-center cursor-pointer ${(index + 1 === sales.length) ? '' : 'mb-10'}`}
                onClick={() => redirectToReport(a)}
                key={index}
              >
                <div className="symbol symbol-40 symbol-light-success overflow-hidden mr-5">
                  <span className="symbol-label">
                    {a.profile_pic ? (
                      <Avatar variant="square" src={a?.profile_pic} />
                    ) : (
                      <Avatar variant="square">
                        {String(a?.customer ? a?.customer : a?.username
                        )[0].toLocaleUpperCase()}
                      </Avatar>
                    )}
                  </span>
                </div>
                <div className="d-flex flex-column flex-grow-1 font-weight-bold">
                  <a
                    href="#"
                    className="text-dark text-hover-primary mb-1 font-size-lg"
                  >
                    {a.customer}
                  </a>
                </div>
                <span>{a.sum.toLocaleString()}</span>
              </div>
            )))
          }
        </div>
      </div>
    </>
  );
}

