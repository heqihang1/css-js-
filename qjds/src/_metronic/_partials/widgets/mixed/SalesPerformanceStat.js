/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { API_URL } from "../../../../app/API_URL";
import axios from "axios";
import moment from "moment";

export default function SalesPerformanceStat({ className }) {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [date, setDate] = useState(moment().format("YYYY-MM"));
  let chartnewSalesPerformance;

  var options = {
    colors: ["#ffe68d", "#fea800", "#e5eaee"],
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
      height: "350px",
    },
    series: [],
    xaxis: {
      categories: [],
    },
    dataLabels: {
      enabled: false,
    },
  };

  const setOPtions = (newApiData) => {
    options.series = [
      {
        name: "Open",
        data: newApiData.map((i) => i.open),
      },
      {
        name: "Confirmed",
        data: newApiData.map((i) => i.confirm),
      },
      {
        name: "Rejected",
        data: newApiData.map((i) => i.reject),
      },
    ];
    options.xaxis.categories = newApiData.map((i) => i.user_name);
    const element = document.getElementById("sales_performance_stat");
    if (!element) {
      return;
    }
    if (chartnewSalesPerformance) {
      chartnewSalesPerformance.destroy();
    }
    chartnewSalesPerformance = new ApexCharts(element, options);
    chartnewSalesPerformance.render();
  };

  useEffect(() => {
    setLoader(true);
    setData(null)
    axios
      .get(API_URL + "dashboard/sales_performance_stats", {
        params: {
          period: date,
        },
      })
      .then((res) => {
        setLoader(false);
        setData(res.data);
        setOPtions(res.data);
      })
      .catch((err) => {
        setLoader(false);
      });
  }, [date]);

  return (
    <div className={`card card-custom ${className}`}>
      {/* begin::Body */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title font-weight-bolder">
          Sales Performance Stats
        </h3>
        <div className="card-toolbar">
          <div className="form-group ">
            <input
              className="form-control"
              type="month"
              value={date}
              onChange={(e) => {
                if (e?.target?.value) {
                  setDate(e.target.value);
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="card-body d-flex flex-column">
        {loader ? (
          <div className="text-center" style={{ height: "200px" }}>
            Loading...
          </div>
        ) : (
          <div id="sales_performance_stat" style={{ height: "200px" }}></div>
        )}
      </div>
      {/* end::Body */}
    </div>
  );
}
