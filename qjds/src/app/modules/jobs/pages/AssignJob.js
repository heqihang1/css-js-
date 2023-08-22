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
import { API_URL } from "../../../API_URL";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import moment from "moment";
import { checkPermission } from "../../../utils/utils";
import { jobAssignTeam, jobUpdateAssignTeam, jobUnassignTeam } from "../_redux/job/jobCrud";
import { jobStatuses } from "../partials/statuses";
import SalesRemarkModal from "./SalesRemarkModal";
import {
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
  Row,
  Col,
  FormLabel,
} from "react-bootstrap";
import StarIcon from '@material-ui/icons/Star';

const AssignJob = () => {
  const dispatch = useDispatch();
  const [jobs, setJobs] = useState([])
  const [userList, setUserList] = useState([])
  const { isLoading } = useSelector(
    (state) => ({
      isLoading: state.users.actionsLoading
    }),
    shallowEqual
  );

  const { user } = useSelector((state) => state.auth, shallowEqual);

  const [teamOption, setTeamOption] = useState([]);
  const [confirmModel, setConfirmModel] = useState(false)
  const [deleteEventInfo, setDeleteEventInfo] = useState({})
  const [assignedJob, setAssignedJob] = useState([])
  const [unAssignedJob, setUnAssignedJob] = useState([])
  const [showAlert, setShowAlert] = useState(false)
  const [showAlertMsg, setShowAlertMsg] = useState("")
  const [loading, setLoading] = useState(true)
  const [editable, setEditable] = useState(true)
  const [showUnassignedAlert, setShowUnassignedAlert] = useState(false)
  const [salesRemarkModel, setSalesRemarkModel] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [optionModel, setOptionModel] = useState(false)
  const [redirectTeam, setRedirectTeam] = useState('')

  function getUserColor(data, user_id) {
    return data.filter((item) => {
      if (item._id == user_id) {
        return item
      }
    })[0]?.color
  }

  function getJobs(salesDeptUsers) {

    const hasPermissions = checkPermission("SHOW_ALL_CUSTOMER_DATA", "can_read")
    const newQueryParams = hasPermissions ? {} : {
      filter: {
        "customer.customer_officer_id": localStorage.getItem("user_id")
      }
    }

    axios
      .get(API_URL + "jobs/unassigned", { params: newQueryParams })
      .then((res) => {
        setJobs(res.data.docs)
        let eventOption = []
        res.data.docs.filter((item) => {
          const event = {
            id: item._id,
            title: (item.isAdditional) ? `*${item.job_no}` : `${item.job_no}`,
            status: item.status,
            job_no: item.job_no,
            start: item.expected_job_date,
            end: item.end_job_date,
            end_job_date: item.end_job_date,
            resourceIds: ['634f64c24f7176a04a32bb25'],
            backgroundColor: getUserColor(salesDeptUsers, item?.customer[0]?.customer_officer_id),
            borderColor: getUserColor(salesDeptUsers, item?.customer[0]?.customer_officer_id)
          }
          if (item.quotation_id) {
            event["quotation_id"] = item.quotation_id
          } else if (item.contract_id) {
            event["contract_id"] = item.contract_id
          }
          eventOption.push(event)
        })
        setUnAssignedJob(eventOption)
      });
  }

  function getAssingedJob(salesDeptUsers) {
    axios
      .get(API_URL + "jobs/assigned")
      .then((res) => {
        if (res.data.docs) {
          let eventOption = []
          res.data.docs.filter((item) => {
            const event = {
              id: item._id,
              title: (item.isAdditional) ? `*${item.job_no} (${item.team?.carPlateNumber})` : `${item.job_no} (${item.team?.carPlateNumber})`,
              status: item.status,
              job_no: item.job_no,
              start: item.actual_job_date,
              end: item.end_job_date,
              end_job_date: item.end_job_date,
              resourceIds: [item.team._id],
              backgroundColor: getUserColor(salesDeptUsers, item?.customer_id?.customer_officer_id),
              borderColor: getUserColor(salesDeptUsers, item?.customer_id?.customer_officer_id)
            }
            if (item.quotation_id) {
              event["quotation_id"] = item.quotation_id
            } else if (item.contract_id) {
              event["contract_id"] = item.contract_id
            }
            eventOption.push(event)
          })
          setAssignedJob(eventOption)
        }
        setLoading(false)
      });
  }

  async function getUsers() {
    setLoading(true)
    const data = await axios.get(API_URL + "users?all=true");
    const salesDeptUsers = data.data.users.filter((x) => x?.department === "Sales" && x?.status === "active");
    setUserList(salesDeptUsers);
    getJobs(salesDeptUsers)
    getAssingedJob(salesDeptUsers)
  }

  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        let title = eventEl.getAttribute("title");
        let id = eventEl.getAttribute("data");
        let bgColor = eventEl.getAttribute("bgColor");
        let status = eventEl.getAttribute("status");
        let end_job_date = eventEl.getAttribute("end_job_date");
        return {
          title: title,
          id: id,
          status: status,
          end_job_date: end_job_date,
          backgroundColor:
            bgColor
        };
      }
    });

    getActiveTeams()
      .then((res) => {
        var teams = res.data.docs;
        let teamOptions = [{
          id: "634f64c24f7176a04a32bb25",
          title: 'Unassigned'
        }]
        teams.filter((x) => {
          teamOptions.push({
            title: x.carPlateNumber,
            id: x._id
          })
        })
        setTeamOption(teamOptions);
      })
      .catch((err) => { });

    getUsers();
  }, [])

  document.addEventListener('click', (e) => {
    const targetData = e.target.closest(".fc-resource");
    const targetChildData = e.target.closest(".fc-col-header-cell-cushion");
    if (targetData && targetChildData) {
      const teamId = targetData.getAttribute("data-resource-id")
      if (teamId && teamId != '634f64c24f7176a04a32bb25') {
        setRedirectTeam(teamId)
      }
    }
  })

  useEffect(() => {
    if (redirectTeam) {
      window.open(`/jobs/team?team_id=${redirectTeam}`)
      setTimeout(() => {
        setRedirectTeam('')
      }, 500)
    }
  }, [redirectTeam])

  const handleEventReceive = (eventInfo) => {
    if (eventInfo.view.type == 'resourceTimeGridDay') {
      if (eventInfo?.event?._def?.extendedProps?.end_job_date && moment(new Date(moment(eventInfo.event._instance.range.start).utc().format("YYYY-MM-DD HH:mm"))).format() > moment(eventInfo?.event?._def?.extendedProps?.end_job_date).format()) {
        eventInfo.event.remove()
        setShowAlert(true)
        setShowAlertMsg(`Start time cannot later than job end date (${moment(eventInfo?.event?._def?.extendedProps?.end_job_date).format("YYYY-MM-DD HH:mm")}).`)
      } else {
        let newEvent = {
          team: eventInfo?.event?._def?.resourceIds[0] ? eventInfo.event._def.resourceIds[0] : null,
          actual_job_date: eventInfo?.event?._instance?.range?.start ? new Date(moment(eventInfo.event._instance.range.start).utc().format("YYYY-MM-DD HH:mm")) : "",
        }
        if (!eventInfo?.event?._def?.extendedProps?.end_job_date) {
          newEvent.end_job_date = eventInfo?.event?._instance?.range?.end ? new Date(moment(eventInfo.event._instance.range.end).utc().format("YYYY-MM-DD HH:mm")) : ""
        }
        jobAssignTeam(eventInfo?.event?._def?.publicId, newEvent)
          .then((res) => {
            getJobs(userList)
            getAssingedJob(userList)
            eventInfo.event.remove()
          })
          .catch((err) => { });
      }
    } else {
      eventInfo.event.remove()
      setShowAlert(true)
      setShowAlertMsg("This browsing mode cannot assign job, please do it in 'Day' mode.")
    }
  }

  const handleEventChange = (eventInfo) => {
    if (eventInfo?.event?._def?.extendedProps?.status == jobStatuses.FINISHED) {
      eventInfo.revert()
    } else if (eventInfo.event._def.resourceIds[0] != '634f64c24f7176a04a32bb25') {
      if (eventInfo?.event?._def?.extendedProps?.end_job_date && moment(new Date(moment(eventInfo.event._instance.range.start).utc().format("YYYY-MM-DD HH:mm"))).format() > moment(eventInfo?.event?._def?.extendedProps?.end_job_date).format()) {
        getAssingedJob(userList)
        setShowAlert(true)
        setShowAlertMsg(`Start time cannot later than job end date (${moment(eventInfo?.event?._def?.extendedProps?.end_job_date).format("YYYY-MM-DD HH:mm")}).`)
      } else {
        const newEvent = {
          team: eventInfo?.event?._def?.resourceIds[0] ? eventInfo.event._def.resourceIds[0] : null,
          actual_job_date: eventInfo?.event?._instance?.range?.start ? new Date(moment(eventInfo.event._instance.range.start).utc().format("YYYY-MM-DD HH:mm")) : ""
        }
        if (eventInfo.oldEvent._def.resourceIds[0] == '634f64c24f7176a04a32bb25') {
          if (!eventInfo?.event?._def?.extendedProps?.end_job_date) {
            newEvent.end_job_date = eventInfo?.event?._instance?.range?.end ? new Date(moment(eventInfo.event._instance.range.end).utc().format("YYYY-MM-DD HH:mm")) : ""
          }
          jobAssignTeam(eventInfo?.event?._def?.publicId, newEvent)
            .then((res) => {
              getJobs(userList)
              getAssingedJob(userList)
            })
            .catch((err) => { });
        } else {
          jobUpdateAssignTeam(eventInfo?.event?._def?.publicId, newEvent)
            .then((res) => {
              getAssingedJob(userList)
              getJobs(userList)
            })
            .catch((err) => { });
        }
      }
    } else {
      jobUnassignTeam(eventInfo?.event?._def?.publicId)
        .then((res) => {
          getAssingedJob(userList)
          getJobs(userList)
        })
        .catch((err) => { });
    }
  }

  const handleEventClick = (clickInfo) => {
    setDeleteEventInfo(clickInfo)
    if (clickInfo?.event?._def?.extendedProps?.status == jobStatuses.FINISHED) {
      setShowUnassignedAlert(true)
    } else {
      setOptionModel(true)
    }
  }

  const deleteEvent = () => {
    jobUnassignTeam(deleteEventInfo?.event?._def?.publicId)
      .then((res) => {
        deleteEventInfo.event.remove()
        setConfirmModel(false)
        getAssingedJob(userList)
        getJobs(userList)
      })
      .catch((err) => { });
  }

  const handleEvents = (events) => {
    if (events[0]?._context?.currentViewType == 'resourceTimeGridDay') {
      setEditable(true)
    } else {
      setEditable(false)
    }
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
                        style={{ backgroundColor: item.color, width: "15px", height: "15px" }}
                      ></div>
                      <div className="ml-1">
                        {(item.displayname) ? item.displayname : item.username}
                        {/* {item.color} */}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              <div id="external-events" className="mt-10">
                {jobs.map((event) => {
                  const isContract = Boolean(event?.contract_id)
                  const eventRemarks = isContract ? event?.contract_remarks : event?.quotes_remarks
                  const checkSeen = eventRemarks.filter((x) => !x.read_by.includes(user._id))
                  return (
                    <Card
                      className={(checkPermission("DRAG_TO_ASSIGN_JOB_ORDER", "can_edit")) ? 'fc-event' : ''}
                      title={(event.isAdditional) ? `*${event.job_no}` : event.job_no}
                      data={event._id}
                      key={event._id}
                      status={event.status}
                      end_job_date={event.end_job_date}
                      onClick={() => {
                        setSalesRemarkModel(true)
                        setSelectedEvent(event)
                      }}
                      bgColor={getUserColor(userList, event?.customer[0]?.customer_officer_id)}
                      style={{ backgroundColor: getUserColor(userList, event?.customer[0]?.customer_officer_id), color: (getUserColor(userList, event?.customer[0]?.customer_officer_id)) ? 'white' : '' }}
                    >
                      <CardBody className="p-5 relative">
                        {checkSeen?.length ? (
                          <div style={{ position: "absolute", right: 12, top: 12 }}>
                            <StarIcon style={{ color: "#f4ea29" }} />
                          </div>
                        ) : null}
                        <b>
                          { (checkPermission("JOB", "can_read")) ? <u>
                            <a onClick={() => window.open(`/jobs/${event._id}/details`)}>
                              {(event.isAdditional) ? `*${event.job_no}` : event.job_no}
                            </a>
                          </u> : <span>
                            {(event.isAdditional) ? `*${event.job_no}` : event.job_no} 
                          </span> }
                        </b>
                        <div>District: {event?.location[0]?.dist[0]?.district_eng_name}</div>
                        <div>Worker: {event?.worker}</div>
                        <div>Exp. Job Date: {event?.expected_job_date ? moment(event?.expected_job_date).format("DD MMM YYYY, HH:mm") : ''}</div>
                      </CardBody>
                    </Card>
                  )
                })}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm='9' md='9' lg='9'>
          <Card>
            <CardHeader title="Schedule Job">
              <CardHeaderToolbar>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => getUsers()}
                >
                  <i style={{ fontSize: 14 }} class="fa">&#xf021;</i> Refresh
                </button>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody className="AssignJob">
              {!loading ? (
                <FullCalendar
                  schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
                  plugins={[dayGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,resourceTimeGridDay'
                  }}
                  initialView='resourceTimeGridDay'
                  editable={editable && checkPermission("JOB", "can_edit")}
                  droppable={true}
                  rerenderDelay={10}
                  eventDurationEditable={false}
                  resources={teamOption}
                  eventReceive={handleEventReceive}
                  eventChange={handleEventChange}
                  eventClick={handleEventClick}
                  events={(editable && checkPermission("JOB", "can_edit")) ? assignedJob.concat(unAssignedJob) : assignedJob}
                  eventsSet={handleEvents}
                />
              ) : (
                <span className="spinner spinner-sm spinner-warning"></span>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <SalesRemarkModal
        show={salesRemarkModel}
        event={selectedEvent}
        onHide={() => {
          setSalesRemarkModel(false)
          setSelectedEvent(null)
          getJobs(userList)
        }}
        onShow={() => setSalesRemarkModel(true)}
      />

      {/* JOB ORDER CLICK */}
      <Modal
        show={optionModel}
        onHide={() => setOptionModel(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">{deleteEventInfo?.event?._def?.extendedProps?.job_no}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <button
            type="button"
            onClick={() => {
              setOptionModel(false)
              setSalesRemarkModel(true)
              const eventData = {
                job_no: deleteEventInfo?.event?._def?.extendedProps?.job_no,
              }
              if (deleteEventInfo?.event?._def?.extendedProps?.quotation_id) {
                eventData["quotation_id"] = deleteEventInfo?.event?._def?.extendedProps?.quotation_id
              } else if (deleteEventInfo?.event?._def?.extendedProps?.contract_id) {
                eventData["contract_id"] = deleteEventInfo?.event?._def?.extendedProps?.contract_id
              }
              setSelectedEvent(eventData)
            }}
            style={{ backgroundColor: "#d6d6d6", color: "#000" }}
            className="btn btn-light btn-elevate w-100 shadow-lg"
          >
            Sales Remark
          </button>
          {(deleteEventInfo?.event?._def?.resourceIds[0] != '634f64c24f7176a04a32bb25' && checkPermission("JOB", "can_edit")) ? <>
            <br />
            <button
              type="button"
              onClick={() => {
                setOptionModel(false)
                setConfirmModel(true)
              }}
              className="btn btn-delete btn-elevate btn-danger w-100 mt-4 mb-2"
            >
              Unassign
            </button>
          </> : ''}
        </Modal.Body>
      </Modal>

      {/* CONFIRMATION MODAL */}
      <Modal
        show={confirmModel}
        onHide={() => setConfirmModel(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Please confirm unassign this job</span>
          <br />
          <strong>{deleteEventInfo?.event?.title}</strong>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => setConfirmModel(false)}
              className="btn btn-light btn-elevate"
            >
              Cancel
            </button>
            <> </>
            <button
              type="button"
              onClick={() => deleteEvent()}
              className="btn btn-delete btn-elevate btn-danger"
            >
              Confirm
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAlert}
        onHide={() => setShowAlert(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>{showAlertMsg}</span>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => setShowAlert(false)}
              className="btn btn-light btn-elevate"
            >
              Ok
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showUnassignedAlert}
        onHide={() => setShowUnassignedAlert(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>This job is finished So you can't unassign.</span>
          <br />
          <strong>{deleteEventInfo?.event?.title}</strong>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => setShowUnassignedAlert(false)}
              className="btn btn-light btn-elevate"
            >
              Ok
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AssignJob;
