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
import SearchSelect from "react-select";
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

const AssignTeam = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [teamOption, setTeamOption] = useState([]);
  const [team, setTeam] = useState({});
  const [assignedJob, setAssignedJob] = useState([])
  const [userList, setUserList] = useState([])
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  function getUserColor(data, user_id) {
    return data.filter((item) => {
      if (item._id == user_id) {
        return item
      }
    })[0]?.color
  }
  function getAssingedJob(salesDeptUsers, team_id) {
    setLoading(true)
    axios
      .get(API_URL + "jobs/assigned?team_id=" + team_id)
      .then((res) => {
        if (res.data.docs) {
          let eventOption = []
          res.data.docs.filter((item) => {
            const event = {
              id: item._id,
              title: (item.isAdditional) ? `*${item.job_no}` : `${item.job_no}`,
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
          setLoading(false)
        }
      });
  }
  async function getUsers(team_id) {
    const data = await axios.get(API_URL + "users?all=true");
    const salesDeptUsers = data.data.users.filter((x) => x?.department === "Sales" && x?.status === "active");
    setUserList(salesDeptUsers);
    getAssingedJob(salesDeptUsers, team_id)
  }
  function getTeams() {
    setLoading(true)
    getActiveTeams()
    .then((res) => {
      var teams = res.data.docs;
      let teamOptions = []
      let selectedTeam = {
        label: teams[0]?.carPlateNumber,
        value: teams[0]?._id
      }
      teams.filter((x) => {
        teamOptions.push({
          label: x.carPlateNumber,
          value: x._id
        })
        if (x._id == params?.team_id) {
          selectedTeam = {
            label: x.carPlateNumber,
            value: x._id
          }
        }
      })
      setTeamOption(teamOptions);

      setTeam(selectedTeam)

      getUsers(selectedTeam.value)
    })
    .catch((err) => { });
  }
  
  useEffect(() => {
    getTeams()
  }, [])

  return (
    <>
      <Card>
        <CardHeader title={(team?.label) ? team?.label : ""}>
          <CardHeaderToolbar>
            <div style={{width: '200px', zIndex: 5}} className="pr-4">
              <SearchSelect
                name="team"
                options={teamOption}
                value={team}
                onChange={(opt) => {
                  setTeam(opt);
                  getAssingedJob(userList, opt?.value);
                }}
              />
            </div>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => getAssingedJob(userList, team?.value)}
            >
              <i style={{ fontSize: 14 }} class="fa">&#xf021;</i> Refresh
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody className="team-calendar">
          {!loading ? (
            <FullCalendar
              schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
              plugins={[dayGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
              headerToolbar={{
                left: 'prev',
                center: 'title',
                right: `next`
              }}
              initialView='timeGridFourDay'
              views={{
                timeGridFourDay: {
                  type: 'timeGrid',
                  duration: { month: 1 }
                }
              }}
              dayHeaderFormat={{ month: 'numeric', day: 'numeric' }}
              // dayMinWidth={5}
              events={assignedJob}
            />
          ) : (
            <span className="spinner spinner-sm spinner-warning"></span>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default AssignTeam;
