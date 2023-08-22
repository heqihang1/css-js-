/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect, useState } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_helpers";
import { useHtmlClassService } from "../../../layout";
import { API_URL } from "../../../../app/API_URL";
import axios from "axios";
import { useHistory } from "react-router-dom";

export function OverdueAmount({ className, symbolShape, baseColor }) {
  const history = useHistory();
  const uiService = useHtmlClassService();
  const [months, setMonths] = useState([])
  const [data, setData] = useState([])
  const [totalOverdue, setTotalOverdue] = useState(0)

  function getChartOption(layoutProps) {
    const options = {
      series: [
        {
          name: "Overdue Amount",
          data: data,
        },
      ],
      chart: {
        type: "area",
        height: 150,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {},
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: "solid",
        opacity: 1,
      },
      stroke: {
        curve: "smooth",
        show: true,
        width: 3,
        colors: [layoutProps.colorsThemeBaseSuccess],
      },
      xaxis: {
        categories: months,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          style: {
            colors: layoutProps.colorsGrayGray500,
            fontSize: "12px",
            fontFamily: layoutProps.fontFamily,
          },
        },
        crosshairs: {
          show: false,
          position: "front",
          stroke: {
            color: layoutProps.colorsGrayGray300,
            width: 1,
            dashArray: 3,
          },
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
          style: {
            fontSize: "12px",
            fontFamily: layoutProps.fontFamily,
          },
        },
      },
      yaxis: {
        min: 0,
        max: 55,
        labels: {
          show: false,
          style: {
            colors: layoutProps.colorsGrayGray500,
            fontSize: "12px",
            fontFamily: layoutProps.fontFamily,
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        hover: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "none",
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
        y: {
          formatter: function(val) {
            return "$" + val;
          },
        },
      },
      colors: [layoutProps.colorsThemeLightSuccess],
      markers: {
        colors: [layoutProps.colorsThemeLightSuccess],
        strokeColor: [layoutProps.colorsThemeBaseSuccess],
        strokeWidth: 3,
      },
    };
    return options;
  }

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
      colorsThemeBaseSuccess: objectPath.get(
        uiService.config,
        `js.colors.theme.base.${baseColor}`
      ),
      colorsThemeLightSuccess: objectPath.get(
        uiService.config,
        `js.colors.theme.light.${baseColor}`
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
    };
  }, [uiService, baseColor]);

  useEffect(() => {
    const element = document.getElementById("overdue_amount_chart");

    if (!element) {
      return;
    }

    const options = getChartOption(layoutProps);
    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, data]);

  useEffect(() => {
    axios.get(API_URL + "dashboard/overdue_amount").then((res)  => {      
      const data = res.data
      setTotalOverdue(data.total_over_due)
      let monthArr = []
      let dataArr = []
      data.data.filter((item) => {
        monthArr.push(item.month)
        dataArr.push(item.total)
      }) 
      setMonths(monthArr)
      setData(dataArr)
    })
  }, [])

  return (
    <div className={`card card-custom ${className}`}>
      <div className="card-body p-0 cursor-pointer" onClick={() => history.push(`/reports/overdue-amount/Today`) }>
        <div className="d-flex align-items-center justify-content-between p-10 flex-grow-1">
          <span
            className={`symbol ${symbolShape} symbol-50 symbol-light-${baseColor} mr-2`}
          >
            <span className="symbol-label">
              <span className={`svg-icon svg-icon-xl svg-icon-${baseColor}`}>
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Layout/Layout-4-blocks.svg"
                  )}
                ></SVG>
              </span>
            </span>
          </span>
          <div className="d-flex flex-column text-right">
            <span className="text-dark-75 font-weight-bolder font-size-h3">
              ${totalOverdue.toLocaleString()}
            </span>
            <span className="text-muted font-weight-bold mt-2">
              Overdue Amount
            </span>
          </div>
        </div>
        <div
          id="overdue_amount_chart"
          className="card-rounded-bottom"
          style={{ height: "150px" }}
        ></div>
      </div>
    </div>
  );
}
