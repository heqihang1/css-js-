import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as districtActions from "../../../sets/_redux/districts/districtsActions";
import * as teamActions from "../../../sets/_redux/teams/teamsActions";
import { getActiveTeams } from "../../../sets/_redux/teams/teamsCrud";
import { jobAssignTeam } from "../../_redux/job/jobCrud";
import * as actions from "../../_redux/job/jobActions";
import { jobStatuses } from "../../partials/statuses";
import ReScheduleModal from "../ReScheduleModal";
import CancelOrderModel from "../CancelOrderModel";
import { Modal, Button, Row, Col, FormLabel, OverlayTrigger, Tooltip} from "react-bootstrap";
import moment from "moment";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import GenereateQuestionnairePDF from "../../../../components/QuestionnairePDF";
import UploadDocumentModal from "../UploadDocumentModal";
import { Field, Form, Formik } from "formik";
import SelectFilter from "react-select";
import {
  Card,
  CardBody,
  Input,
} from "../../../../../_metronic/_partials/controls";
import { API_URL } from "../../../../API_URL";
import axios from "axios";
import { checkPermission } from "../../../../utils/utils";

const JobOrderActions = ({
  setIsChenese,
  printJob,
  productForEdit,
  approveJobOrder,
  rejectJobOrder,
  generatePDFLoader,
  printLoader,
  saveJobOrder,
  refreshPage
}) => {
  const history = useHistory();
  const [rescheduleShow, setRescheduleShow] = useState(false);
  const [confirmShow, setShowConfirm] = useState(false);
  const [output, setOutput] = useState("");
  const [isChinesePDF, setIsChinesePDF] = useState(false);
  const [teamModel, setTeamModel] = useState(false);
  const [teamOption, setTeamOption] = useState([]);
  const dispatch = useDispatch();
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedActualDate, setSelectedActualDate] = useState("");
  const [selectedJobEndDate, setSelectedJobEndDate] = useState("");
  const [signedDocumentModel, setSignedDocumentModel] = useState(false);
  const [uploadDocumentModel, setUploadDocumentModel] = useState(false);
  const [asignTeamValidation, setAsignTeamValidation] = useState(false)
  const [displayQuestionnairePreview, setDisplayQuestionnairePreview] = useState(false);
  const [questionnaireAlert, setQuestionnaireAlert] = useState({
    show: false,
    text: ''
  })

  const ref = React.useRef();

  const { id } = useParams();

  const { isLoading, districts } = useSelector(
    (state) => ({
      isLoading: state.contracts.actionsLoading,
      districts: state.districts.entities,
    }),
    shallowEqual
  );

  const districtOptions =
    districts?.map((x) => {
      return {
        label: x.district_eng_name,
        value: x._id,
      };
    }) || [];

  function generalPDF(isChinesePDF) {
    setIsChenese(isChinesePDF);
    setIsChinesePDF(isChinesePDF);
  }

  useEffect(() => {
    dispatch(districtActions.findAllDistrictsList());
  }, []);

  useEffect(() => {
    if (productForEdit) {
      getActiveTeams(productForEdit?.team)
      .then((res) => {
        var teams = res.data.docs;
        const teamOption =
          teams?.map((x) => {
            return {
              label: x.carPlateNumber,
              value: x._id,
            };
          }) || [];
        teamOption.unshift({
          label: "N/A",
          value: "N/A",
        });
        setTeamOption(teamOption);
      })
      .catch((err) => { });
    }
  }, [productForEdit]);

  useEffect(() => {
    setInterval(() => {
      if (document.getElementById("job-order-pdf-component")) {
        setOutput(document.getElementById("job-order-pdf-component").innerHTML);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    dispatch(actions.getJobDetails(id));
    // eslint-disable-next-line
  }, [id, dispatch]);

  function submitAsignedTeam() {
    if (!selectedTeam?.value || !selectedJobEndDate || !selectedActualDate) {
      setAsignTeamValidation(true)
    } else {
      jobAssignTeam(productForEdit._id, {
        team: selectedTeam?.value ? selectedTeam?.value : null,
        actual_job_date: selectedActualDate !== "" ? new Date(selectedActualDate) : "",
        end_job_date: selectedJobEndDate !== "" ? new Date(selectedJobEndDate) : ""
      })
        .then((res) => {
          history.push(`/jobs/all`);
        })
        .catch((err) => { });
    }
  }

  function downloadSignedDocument() {
    const linkSource = `${productForEdit.signed_document}`;
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = "_self";
    downloadLink.download = "signed_document";
    downloadLink.click();
  }

  function assignToTeam() {
    if (productForEdit.team && productForEdit.team != "") {
      teamOption.filter((item) => {
        if (item.value == productForEdit.team) {
          setSelectedTeam(item);
        }
      });
    } else {
      setSelectedTeam("");
    }
    if (productForEdit?.actual_job_date) {
      setSelectedActualDate(moment(productForEdit.actual_job_date).format("YYYY-MM-DD HH:mm"))
    } else {
      if (productForEdit?.expected_job_date) {
        setSelectedActualDate(moment(productForEdit.expected_job_date).format("YYYY-MM-DD HH:mm"))
      }
    }
    if (productForEdit?.end_job_date) {
      setSelectedJobEndDate(moment(productForEdit.end_job_date).format("YYYY-MM-DD HH:mm"))
    }
    setAsignTeamValidation(false)
    setTeamModel(true);
  }

  function uploadDocument() {
    setUploadDocumentModel(true);
  };

  function signedDocument(signed_document) {
    const linkSource = `${signed_document}`;
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = "_self";
    downloadLink.download = "signed_document";
    downloadLink.click();
  }

  function getDocumentList() {
    if (productForEdit?.signed_document) {
      return productForEdit?.signed_document.map((item) => {
        return (
          <TableRow>
            <TableCell>
              {item.date ? moment(item.date).format("MM-DD-YYYY HH:mm") : ""}
            </TableCell>
            <TableCell>
              <a onClick={() => signedDocument(item.document)}>
                <u>{item.file_name}</u>
              </a>
            </TableCell>
          </TableRow>
        );
      });
    } else {
      return "";
    }
  }

  const downloadQuestionnairePDF = () => {
    
    if (productForEdit?.questionnaire && productForEdit?.question_score && productForEdit?.questionnaire.length > 0 && productForEdit?.question_score.length > 0 && productForEdit?.questionnaire.length == productForEdit?.question_score.length) {
      setDisplayQuestionnairePreview(true);
      setTimeout(() => {
        let post_data = {
          html: document.getElementById("questionnaire-pdf-component")
            ? document.getElementById("questionnaire-pdf-component").innerHTML
            : "",
          url: `${window.location.origin}/pdf/questionnaire`,
          job_no: productForEdit?.job_no,
          is_chinese: false,
        };
        axios
          .post(API_URL + "/pdf/questionnaire", post_data, {
            responseType: "blob", // VERY IMPORTANT
            headers: {
              Accept: "application/pdf",
            },
          })
          .then((res) => {
            console.log(res.data);
            var downloadLink = document.createElement("a");
            downloadLink.target = "_blank";
            downloadLink.download = `${productForEdit?.job_no} Questionnaire.pdf`;
            // convert downloaded data to a Blob
            var blob = new Blob([res.data], { type: "application/pdf" });
            // create an object URL from the Blob
            var URL = window.URL || window.webkitURL;
            var downloadUrl = URL.createObjectURL(blob);
            // set object URL as the anchor's href
            downloadLink.href = downloadUrl;
            // append the anchor to document body
            document.body.append(downloadLink);
            // fire a click event on the anchor
            downloadLink.click();
            // cleanup: remove element and revoke object URL
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(downloadUrl);
            setDisplayQuestionnairePreview(false);
          });
      }, 500);
    } else {
      if (!productForEdit?.questionnaire || productForEdit?.questionnaire.length == 0) {
        setQuestionnaireAlert({
          show: true,
          text: "Job order have not any questionnaire."
        })
      } else  {
        setQuestionnaireAlert({
          show: true,
          text: "Customer did not fill out the questionnaire."
        })
      }
    }
  };

  return (
    <>
      <div className="d-flex flex-column">
        {/* APPROVALS & PDF ACTIONS */}
        <Card>
          <CardBody>
            <div className="d-flex flex-column">
              {productForEdit?.status &&
                (productForEdit?.status === jobStatuses.ARRAGED ||
                  productForEdit?.status === jobStatuses.REJECTED ||
                  productForEdit?.status === jobStatuses.APPROVED ||
                  productForEdit?.status === jobStatuses.PENDING) &&
                checkPermission("JOB", "can_edit") && (
                  <button
                    type="button"
                    className="btn btn-default mb-4 border bg-white border-dark text-dark"
                    onClick={() => {
                      history.push(`/jobs/${productForEdit._id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                )}

              {productForEdit &&
                checkPermission("JOB", "can_approval") &&
                productForEdit?.status !== jobStatuses.FINISHED &&
                productForEdit?.status !== jobStatuses.CANCELLED &&
                (productForEdit?.status === jobStatuses.PENDING ||
                  productForEdit?.status === jobStatuses.REJECTED) && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary mb-4"
                      onClick={() => approveJobOrder()}
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary mb-4 bg-danger border-danger"
                      onClick={() => rejectJobOrder()}
                    >
                      Reject
                    </button>
                  </>
                )}

              {/* {generatePDFLoader && !isChinesePDF ? (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  disabled
                >
                  <span className="spinner spinner-lg spinner-warning"></span>{" "}
                  <span className="ml-10"> Download PDF(English Version)</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  onClick={() => generalPDF(false)}
                >
                  Download PDF(English Version)
                </button>
              )} */}

              {generatePDFLoader && isChinesePDF ? (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  disabled
                >
                  <span className="spinner spinner-lg spinner-warning"></span>{" "}
                  <span className="ml-10"> Download PDF(Chinese Version)</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  onClick={() => generalPDF(true)}
                >
                  Download PDF(Chinese Version)
                </button>
              )}

              {printLoader ? (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  disabled
                >
                  <span className="spinner spinner-lg spinner-warning"></span>{" "}
                  <span className="ml-10"> Print Job Order</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-default mb-4 border bg-white border-dark text-dark"
                  onClick={() => printJob()}
                >
                  Print Job Order
                </button>
              )}
            </div>
          </CardBody>
        </Card>

        {(productForEdit?.status == jobStatuses.APPROVED ||
          productForEdit?.status == jobStatuses.ARRAGED) &&
          checkPermission("JOB", "can_edit") && (
            <Card>
              <CardBody>
                <div className="d-flex flex-column">
                  <button
                    type="button"
                    className="btn btn-default border bg-white border-dark text-dark"
                    onClick={() => assignToTeam()}
                  >
                    Assign to Team
                  </button>
                </div>
              </CardBody>
            </Card>
          )}

        {productForEdit?.status === jobStatuses.FINISHED &&
          checkPermission("JOB", "can_edit") && (
            <Card>
              <CardBody>
                <div className="d-flex flex-column">
                  <button
                    type="button"
                    className="btn btn-default mb-4 border bg-white border-dark text-dark"
                    // onClick={() => downloadSignedDocument()}
                    onClick={() => setSignedDocumentModel(true)}
                  >
                    Signed Job Order
                  </button>
                </div>
              </CardBody>
            </Card>
          )}

        {productForEdit?.status === jobStatuses.FINISHED && (
            <Card>
              <CardBody>
                <div className="d-flex flex-column">
                  {displayQuestionnairePreview ? (
                    <button
                      type="button"
                      className="btn btn-default mb-4 border bg-white border-dark text-dark"
                      disabled
                    >
                      <span className="spinner spinner-sm spinner-warning"></span>{" "}
                      <span className="ml-8"> Questionnaire</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-default mb-4 border bg-white border-dark text-dark"
                      onClick={() => downloadQuestionnairePDF() }
                    >
                      Questionnaire
                    </button>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

        {/* CANCEL ACTIONS */}
        {productForEdit?.status !== jobStatuses.FINISHED &&
          checkPermission("JOB", "can_edit") &&
          productForEdit?.status !== jobStatuses.CANCELLED && (
            <Card>
              <CardBody>
                <div className="d-flex flex-column">
                  <button
                    type="button"
                    className="btn btn-default border bg-white border-dark text-dark"
                    onClick={() => setShowConfirm(true)}
                  >
                    Cancel
                  </button>
                </div>
              </CardBody>
            </Card>
          )}

        <ReScheduleModal
          show={rescheduleShow}
          doc={productForEdit}
          onHide={() => setRescheduleShow(false)}
        />

        <CancelOrderModel
          show={confirmShow}
          doc={productForEdit}
          onHide={() => setShowConfirm(false)}
        />
      </div>

      <Modal
        show={teamModel}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Assign to Team
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            innerRef={ref}
            onSubmit={async (values, formikActions) => {
              submitAsignedTeam();
            }}
          >
            {({ values, handleChange, handleSubmit, submitForm }) => {
              return (
                <Form className="form form-label-right">
                  <div className="form-group ">
                    <FormLabel>Team</FormLabel>
                    <SelectFilter
                      onChange={setSelectedTeam}
                      value={selectedTeam}
                      options={teamOption}
                    />
                    {asignTeamValidation && !selectedTeam?.value ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">Team is required</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group ">
                    <FormLabel>Actual Job Date</FormLabel>
                    <Field
                      name="startDate"
                      component={Input}
                      type="datetime-local"
                      withFeedbackLabel={false}
                      onChange={(e) => {
                        setSelectedActualDate(e.target.value);
                      }}
                      value={selectedActualDate}
                    />
                    {asignTeamValidation && !selectedActualDate ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">Actual job date is required</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group ">
                    <FormLabel>Job End Date</FormLabel>
                    <Field
                      name="end_job_date"
                      component={Input}
                      type="datetime-local"
                      withFeedbackLabel={false}
                      onChange={(e) => {
                        setSelectedJobEndDate(e.target.value);
                      }}
                      value={selectedJobEndDate}
                    />
                    {asignTeamValidation && !selectedJobEndDate ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">Job end date is required</div>
                      </div>
                    ) : null}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setTeamModel(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={submitAsignedTeam}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={signedDocumentModel}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Signed Job Order
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="overlay overlay-block cursor-default">
          <Row className="mt-0 pt-0">
            <Col className="text-right">
              <OverlayTrigger
                overlay={
                  <Tooltip id="products-delete-tooltip">
                    Upload Signed Document
                  </Tooltip>
                }
              >
                <a
                  className="btn btn-icon btn-light btn-sm ml-3"
                  onClick={() => uploadDocument()}
                >
                  <span className="svg-icon svg-icon-md">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Files/Upload.svg"
                      )}
                    />
                  </span>
                </a>
              </OverlayTrigger>
            </Col>
          </Row>
          <Table className="mt-2">
            <TableHead>
              <TableRow>
                <TableCell>Date Created</TableCell>
                <TableCell>File Name</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>{getDocumentList()}</TableBody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => setSignedDocumentModel(false)}
              className="btn btn-delete btn-elevate"
            >
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={questionnaireAlert.show}
        onHide={() => setQuestionnaireAlert({show: false, text: ''})}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>{questionnaireAlert.text}</span>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => setQuestionnaireAlert({show: false, text: ''})}
              className="btn btn-light btn-elevate"
            >
              Ok
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <UploadDocumentModal
        show={uploadDocumentModel}
        doc={productForEdit}
        isFinishJobOrder={false}
        onHide={() => setUploadDocumentModel(false)}
        onSuccess={() => dispatch(actions.getJobDetails(id)) }
      />

      <Card>
        <form
          action={`${API_URL}/pdf/job-order`}
          method="post"
          target="my_iframe"
          id="url_form"
        >
          <input type="hidden" value={output} name="html"></input>
          <input
            type="hidden"
            value={`${window.location.origin}/pdf/job-order`}
            name="url"
          ></input>
          <input
            type="hidden"
            value={productForEdit?.job_no}
            name="job_no"
          ></input>
          <input type="hidden" value={isChinesePDF} name="is_chinese"></input>
        </form>
        <iframe
          src="https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif"
          name="my_iframe"
          frameBorder="0"
          style={{ height: "70vh", width: "100%" }}
        ></iframe>
      </Card>

      {displayQuestionnairePreview && productForEdit ? (
        <span style={{ display: "none" }}>
          <GenereateQuestionnairePDF isChinese={false} data={productForEdit || null} />
        </span>
      ) : (
        ""
      )}
    </>
  );
};

export default JobOrderActions;
