import React from "react";
import Calendar from "../../../components/Calendar";
import Card from "../../../components/Card";

export default function JobsPendingCalendar() {
  const COLORS = {
    COLOR1: "#6f00ff",
    COLOR2: "#04d19e",
    COLOR3: "#3788d8",
    COLOR4: "#ff0000",
    COLOR5: "#ffb300",
  };
  let names = [
    {
      displayname: "Jason",
      color: COLORS.COLOR1,
      events: [],
    },
    {
      displayname: "Annie Yeng",
      color: COLORS.COLOR2,
    },
    {
      displayname: "Katie CHeng",
      color: COLORS.COLOR3,
    },
    {
      displayname: "Ben Li",
      color: COLORS.COLOR4,
    },
    {
      displayname: "Edison Lo",
      color: COLORS.COLOR5,
    },
    {
      displayname: "Peggy To",
      color: COLORS.COLOR5,
    },
    {
      displayname: "Hilary Tsang",
      color: COLORS.COLOR3,
    },
    {
      displayname: "Iris Cheung",
      color: COLORS.COLOR3,
    },
  ];

  let events = [
    {
      id: 58,
      title: "JC09873",
      no_of_people: 3,
      district_chi_name: "中西區",
      district_area: "港島\r",
      backgroundColor: "#3788d8",
      status: 5,
      start: "2022-06-01",
    },

    {
      id: 118,
      title: "JC09840",
      no_of_people: 12,
      district_chi_name: "南區",
      district_area: "港島\r",
      backgroundColor: "#1bc5bd",
      status: 5,
      start: "2022-06-02",
    },
  ];

  return (
    <div className="container w-100 h-100 p-3 d-flex justify-content-center align-items-center">
      <div className="row h-100 w-100">
        <div className="col-lg-3 my-3 mt-md-0 w-100">
          <Card title={"Pending Order"}>
            <div className="h-100">
              <div className="d-flex flex-wrap">
                {names &&
                  names.map((name, id) => (
                    <div
                      key={id}
                      className="w-50 flex-row d-flex align-items-center p-1"
                      style={{ gap: "3px" }}
                    >
                      <div
                        className="m-0"
                        style={{
                          height: "20px",
                          width: "20px",
                          backgroundColor: name.color,
                        }}
                      ></div>
                      <p className="m-0" style={{ fontSize: "11px" }}>
                        {name.displayname}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="h-100 w-100 mt-5">
                {events &&
                  events.map((myevent, i) => (
                    <div
                      key={i}
                      className="my-2 rounded text-white p-3"
                      style={{ backgroundColor: myevent.backgroundColor }}
                    >
                      <h5 className="mb-2 cursor-pointer">{myevent.title}</h5>
                      <p className="my-1">
                        <span>Region: </span>
                        {myevent.district_area}
                      </p>
                      <p className="my-1">
                        <span>Number of people: </span>
                        {myevent.no_of_people}
                      </p>
                      <p className="my-1">
                        <span>Expected time: </span>
                        {myevent.start}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>
        <div className="col-lg-9 mt-5 mt-md-0 w-100">
          <Card title={"Fleet Schedule"}>
            <Calendar events={events} />
          </Card>
        </div>
      </div>
    </div>
  );
}
