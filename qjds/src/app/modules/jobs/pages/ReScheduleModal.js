import React, { useEffect, useState } from "react";
import { FormLabel, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {
  Input,
} from "../../../../_metronic/_partials/controls";
import SelectFilter from "react-select";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import * as districtActions from "../../sets/_redux/districts/districtsActions";
import moment from "moment";
import {
  rescheduleJobOrder
} from "../_redux/job/jobCrud";

const ReScheduleModal = ({ doc, show, onHide }) => {
  const dispatch = useDispatch();
  const ref = React.useRef();
  const history = useHistory();
  const [startDate, setStartDate] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [worker, setWorker] = useState("");

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

  const submitRescheduleJobOrder = async () => {
    const requestBody = {
      area: selectedDistrict?.value ? selectedDistrict?.value : null,
      worker: worker,
      expected_job_date: (startDate) ? new Date(startDate) : '',
    };

    rescheduleJobOrder(doc._id, requestBody)
      .then((res) => {
        onHide()
        history.push("/jobs/all");
      })
      .catch((err) => {})
  }

  useEffect(() => {
    if (doc?.area?._id) {
      setSelectedDistrict(
        districtOptions?.filter(
          (x) => x?.value === doc?.area?._id
        )[0]
      );
    }
    if (
      doc?.expected_job_date &&
      doc?.expected_job_date !== ""
    ) {
      setStartDate(
        moment(doc?.expected_job_date).format("YYYY-MM-DD HH:mm")
      );
    }
    if (doc?.worker) {
      setWorker(doc?.worker);
    }
    // eslint-disable-next-line
  }, [show]);

  useEffect(() => {
    dispatch(districtActions.findAllDistrictsList());
    // eslint-disable-next-line
  }, []);

  return (
    <Modal
      show={show}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Re-schedule
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="overlay overlay-block cursor-default">
        <Formik
          innerRef={ref}
          onSubmit={async (values, formikActions) => {
            submitRescheduleJobOrder();
          }}
        >
          {({ values, handleChange, handleSubmit, submitForm }) => {
            return (
              <Form className="form form-label-right">
                <div className="form-group ">
                  <FormLabel>District</FormLabel>
                  <SelectFilter
                    onChange={setSelectedDistrict}
                    value={selectedDistrict}
                    options={districtOptions}
                  />
                </div>

                <div className="form-group ">
                  <FormLabel>Expected Start Date</FormLabel>
                  <Field
                    name="startDate"
                    type="datetime-local"
                    component={Input}
                    withFeedbackLabel={false}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                  />
                </div>

                <div className="form-group ">
                  <FormLabel>Worker</FormLabel>
                  <Field
                    name="worker"
                    type="number"
                    component={Input}
                    withFeedbackLabel={false}
                    value={worker}
                    onChange={(e) => {
                      setWorker(e.target.value);
                    }}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>

      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={() => onHide() }
            className="btn btn-secondary mr-2"
          >
            Close
          </button>
          <button
            type="button"
            onClick={submitRescheduleJobOrder}
            className="btn btn-primary btn-elevate"
          >
            Confirm
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ReScheduleModal;
