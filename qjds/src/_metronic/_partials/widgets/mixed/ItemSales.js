/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect, useState } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { Nav, Tab } from "react-bootstrap";
import { useHtmlClassService } from "../../../layout";
import { useHistory } from "react-router-dom";
import { API_URL } from "../../../../app/API_URL";
import axios from "axios";
import moment from "moment";

export default function ItemSales({ className, id, title }) {
  const [key, setKey] = useState("Month")
  const history = useHistory();
  let chartnewUsers
  const uiService = useHtmlClassService();
  const [sales, setSales] = useState([])
  const [redirectToReportFlag, setRedirectToReportFlag] = useState('no')

  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray100: objectPath.get(
        uiService.config,
        "js.colors.gray.gray100"
      ),
      colorsGrayGray700: objectPath.get(
        uiService.config,
        "js.colors.gray.gray700"
      ),
      colorsThemeBaseSuccess: objectPath.get(
        uiService.config,
        "js.colors.theme.base.success"
      ),
      colorsThemeLightSuccess: objectPath.get(
        uiService.config,
        "js.colors.theme.light.success"
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
    };
  }, [uiService]);

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
    history.push(`/reports/items-sales-stat?from=${from}&to=${to}&service_id=${item.service_id}&service_name=${item.title}`)
  }

  const options = {
    colors: ['#00bb7a', '#008ffb', '#feb019', '#ff4560'],
    series: [],
    chart: {
      width: 300,
      type: 'donut',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          setRedirectToReportFlag(config.selectedDataPoints[0][0])
        }
      }
    },
    labels: [],
    legend: {
      show: false
    },
    dataLabels: {
      enabled: true
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              fontSize: '16px',
              formatter: function (v) {
                return parseFloat(v).toLocaleString()
              }
            },
            name: {
              show: false
            },
            total: {
              show: true,
              showAlways: false,
              label: '',
              formatter: function (w) {
                // console.log(w)
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return w.config.series.reduce((a, b) => a + b, 0).toLocaleString()
              }
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString()
        }
      }
    }
  };

  const setOPtions = (newApiData) => {
    options.labels = newApiData.map((i) => (i.title) ? i.title : '')
    options.series = newApiData.map((i) => i.price)
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    if (chartnewUsers) {
      chartnewUsers.destroy();
    }
    chartnewUsers = new ApexCharts(element, options);
    chartnewUsers.render();
  }

  useEffect(() => {
    setOPtions([])
    axios.get(API_URL + "dashboard/sales_items?type=" + key).then((res) => {
      setSales(res.data)
      setOPtions(res.data)
    }).catch(() => {
      setSales([])
    })
    return function cleanUp() {
      if (chartnewUsers) {
        chartnewUsers.destroy();
      }
    };
  }, [key]);

  useEffect(() => {
    if (redirectToReportFlag !== 'no') {
      redirectToReport(sales[redirectToReportFlag])
    }
  }, [redirectToReportFlag])

  return (
    <div className={`card card-custom ${className}`}>
      {/* Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title font-weight-bolder ">{title}</h3>
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
      <div className="card-body d-flex flex-column">
        {
          sales.length === 0 ? <div style={{ position: "absolute", top: "50%", left: "40%" }} className="text-black-50"><h5>No Data</h5></div> : null
        }
        <div className="">
          <div id={id} style={{ height: "200px" }}></div>
        </div>
        <div className="row mt-5">
          {sales.map((item, index) => (
              <div className={`d-flex align-items-start col-6 mb-5 cursor-pointer`} onClick={() => redirectToReport(item)} key={index}>
                <div className="symbol symbol-40 symbol-light-success mr-5 align-self-start">
                  <span className="symbol-label" style={{ height: '40px', width: '40px', backgroundColor: options.colors[index] }}></span>
                </div>
                <div className="d-flex flex-column flex-grow-1 font-weight-bold">
                  <a
                    href="#"
                    className="text-dark text-hover-primary mb-1 font-size-lg"
                  >
                    $ {item.price.toLocaleString()}
                  </a>
                  <span className="text-muted font-weight-bold three-line-ellipsis" title={item.title}>{item.title}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}