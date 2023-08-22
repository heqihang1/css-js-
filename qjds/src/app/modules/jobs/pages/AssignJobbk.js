import React, { useEffect, useState, useCallback } from "react";
import FullCalendar, { getIsRtlScrollbarOnLeft } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { getActiveTeams } from "../../sets/_redux/teams/teamsCrud";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../Admin/_redux/users/usersActions";
import axios from "axios";
import { checkPermission } from "../../../utils/utils";
import { API_URL } from "../../../API_URL";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import moment from "moment";

import {
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
  Row,
  Col,
  FormLabel,
} from "react-bootstrap";

const AssignJob = () => {
  const dispatch = useDispatch();
  const [jobs, setJobs] = useState([])
  const [userList, setUserList] = useState([])
  const { isLoading, users } = useSelector(
    (state) => ({
      isLoading: state.users.actionsLoading,
      users: state.users.entities,
    }),
    shallowEqual
  );

  const [teamOption, setTeamOption] = useState([]);

  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        let title = eventEl.getAttribute("title");
        let id = eventEl.getAttribute("data");
        let bgColor = eventEl.getAttribute("bgColor");
        return {
          title: title,
          id: id,
          backgroundColor: bgColor
        };
      }
    });

    getActiveTeams()
      .then((res) => {
        var teams = res.data.docs;
        const teamOption =
          teams?.map((x) => {
            return {
              title: x.carPlateNumber,
              id: x._id,
            };
          }) || [];
        setTeamOption(teamOption);
      })
      .catch((err) => { });

    dispatch(actions.findusers({ pageNumber: 1, pageSize: 100000 }));

    const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
    const newQueryParams = hasPermissions ? {} : {
      filter: {
        "customer.customer_officer_id": localStorage.getItem("user_id")
      }
    }

    axios
      .get(API_URL + "/jobs/unassigned", { params: newQueryParams })
      .then((res) => {
        setJobs(res.data.docs)
      });
  }, [])

  useEffect(() => {
    let userData = []
    users.filter((item) => {
      let row = { ...item }
      row.bgColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
      userData.push(row)
    })
    setUserList(userData)
  }, [users])

  function getUserColor(user_id) {
    return userList.filter((item) => {
      if (item._id == user_id) {
        return item
      }
    })[0]?.bgColor
  }

  return (
    <>
      <Row>
        <Col sm='3' md='3' lg='3'>
          <Card>
            <CardHeader title="Unassigned Jobs">
              <CardHeaderToolbar></CardHeaderToolbar>
            </CardHeader>
            <CardBody className="p-5" style={{ height: '80vh', overflow: 'auto' }}>
              <Row>
                {userList.map((item) => (
                  <Col sm='6' className="mt-2">
                    <div className="d-flex">
                      <div
                        style={{ backgroundColor: item.bgColor, width: "15px", height: "15px" }}
                      ></div>
                      <div className="ml-1">
                        {item.displayname}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              <div id="external-events" className="mt-10">
                {jobs.map((event) => (
                  <Card
                    className="fc-event"
                    title={event.job_no}
                    data={event._id}
                    key={event._id}
                    bgColor={getUserColor(event?.customer[0]?.customer_officer_id)}
                    style={{ backgroundColor: getUserColor(event?.customer[0]?.customer_officer_id) }}
                  >
                    <CardBody className="p-5">
                      <b><u>{event.job_no}</u></b>
                      <div>District: {event?.location[0]?.dist[0]?.district_eng_name}</div>
                      <div>Worker: {event?.worker}</div>
                      <div>Exp. Job Date: {event?.expected_job_date ? moment(event?.expected_job_date).format("DD MMM YYYY, HH:mm") : moment().format("DD MMM YYYY, HH:mm")}</div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm='9' md='9' lg='9'>
          <Card>
            <CardHeader title="Schedule Job">
              <CardHeaderToolbar></CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <FullCalendar
                schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
                plugins={[dayGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,resourceTimeGridDay'
                }}
                initialView='resourceTimeGridDay'
                editable={true}
                droppable={true}
                rerenderDelay={10}
                eventDurationEditable={false}
                resources={teamOption}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AssignJob;
