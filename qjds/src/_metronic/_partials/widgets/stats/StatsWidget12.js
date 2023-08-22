/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useMemo, useEffect, useState} from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import SVG from "react-inlinesvg";
import {useHtmlClassService} from "../../../layout";
import {toAbsoluteUrl} from "../../../_helpers";
import { Nav, Tab } from "react-bootstrap";
import { API_URL } from "../../../../app/API_URL";
import axios from "axios";
import { useHistory } from "react-router-dom";

export function StatsWidget12({ className }) {
  let chartnewUsers
  const history = useHistory();
  const uiService = useHtmlClassService();
  const [key, setKey] = useState("Month")
  const [apiData, setApiData] = useState()  

  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray500: objectPath.get(
        uiService.config,
        "js.colors.gray.gray500"
      ),
      colorsGrayGray200: objectPath.get(
        uiService.config,
        "js.colors.gray.gray200"
      ),
      colorsGrayGray300: objectPath.get(
        uiService.config,
        "js.colors.gray.gray300"
      ),
      colorsThemeBasePrimary: objectPath.get(
        uiService.config,
        "js.colors.theme.base.primary"
      ),
      colorsThemeLightPrimary: objectPath.get(
        uiService.config,
        "js.colors.theme.light.primary"
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily")
    };
  }, [uiService]);
  const options = {
    series: [
      {
        name: "New Members",
        data: []
      }
    ],
    chart: {
      type: "area",
      height: 150,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {},
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: "solid",
      opacity: 1
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [layoutProps.colorsThemeBasePrimary]
    },
    xaxis: {
      categories: [],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
        }
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3
        }
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
        }
      }
    },
    yaxis: {
      min: 0,
      max: 55,
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
        }
      }
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0
        }
      },
      hover: {
        filter: {
          type: "none",
          value: 0
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0
        }
      }
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily
      },
      y: {
        formatter: function(val) {
          return val;
        }
      }
    },
    colors: [layoutProps.colorsThemeLightPrimary],
    markers: {
      colors: [layoutProps.colorsThemeLightPrimary],
      strokeColor: [layoutProps.colorsThemeBasePrimary],
      strokeWidth: 3
    }
  };
  const setOPtions = (newApiData) => {
    options.series[0].data = newApiData?.stats?.map((i) => i.total)
    options.xaxis.categories = newApiData?.stats?.map((i) => i.month)
    const element = document.getElementById("kt_stats_widget_12_chart");
    if (!element) {
      return;
    }
    chartnewUsers = new ApexCharts(element, options);
    chartnewUsers.render();
  }
  const getUser = () => {
    if (key == 'Day') return apiData?.total
    else if (key == 'Week') return apiData?.total
    else if (key == 'Month') return apiData?.total
    else return 0
  }
  useEffect(() => {
    axios.get(API_URL + "dashboard/users?type="+ key).then((res)  => {
      setApiData(res.data)
      setOPtions(res.data)
    })
    return function cleanUp() {
      if (chartnewUsers) chartnewUsers.destroy();      
    };
  }, [key]);

  return (
    <div className={`card card-custom ${className}`}>
      <div className="card-body d-flex flex-column p-0">
        <div className="d-flex align-items-center justify-content-between p-5 flex-grow-1">
          <span className="symbol symbol-circle symbol-50 symbol-light-primary mr-2 cursor-pointer" onClick={() => history.push(`/reports/new-customer/${key}`) }>
            <span className="symbol-label">
              <span className="svg-icon svg-icon-xl svg-icon-primary">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Group.svg"
                  )}
                ></SVG>
              </span>
            </span>
          </span>
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
                    className={`nav-link py-2 px-4 ${
                      key === "Month" ? "active" : ""
                    }`}
                  >
                    Month
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="nav-item" as="li">
                  <Nav.Link
                    eventKey="Week"
                    className={`nav-link py-2 px-4 ${
                      key === "Week" ? "active" : ""
                    }`}
                  >
                    Week
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="nav-item" as="li">
                  <Nav.Link
                    eventKey="Day"
                    className={`nav-link py-2 px-4 ${
                      key === "Day" ? "active" : ""
                    }`}
                  >
                    Day
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Tab.Container>
          </div>
          <div className="d-flex flex-column text-right cursor-pointer" onClick={() => history.push(`/reports/new-customer/${key}`) }>
            <span className="text-dark-75 font-weight-bolder font-size-h3">
              {getUser()}
            </span>
            <span className="text-muted font-weight-bold mt-2">New Customers</span>
          </div>
        </div>
        <div
          onClick={() => history.push(`/reports/new-customer/${key}`) }
          id="kt_stats_widget_12_chart"
          className="card-rounded-bottom cursor-pointer"
          style={{ height: "150px" }}
        ></div>
        {
            getUser() == 0 ||  !getUser() ? <div style={{position: "absolute", top: "55%", left: "40%"}} className="text-black-50"><h5>No Data</h5></div> : null
        }        
      </div>
    </div>
  );
}