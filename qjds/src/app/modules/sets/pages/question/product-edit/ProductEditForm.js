// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useRef, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { Editor } from "../../../../../components/Editor";
import { ResetButton } from "../../../../../components/ResetButton";
import SearchSelect from "react-select";
import * as serviceActions from "../../../_redux/services/servicesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const initProduct = {
  question_title: "",
  services: []
};

// Validation schema
const ProductEditSchema = Yup.object().shape({
  question_title: Yup.string().required(
    "Question title is required"
  ),
});

export function ProductEditForm({
  product = { question_title: "", services: [] },
  btnRef,
  saveProduct,
  btnResRef,
}) {
  let editorRef = useRef(null);
  let resetEditor = () => (editorRef.current.value = "");
  let [serviceOption, setServiceOption] = useState([])

  const { services } = useSelector((state) => {
    return { services: state.services.entities };
  }, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(serviceActions.fetchservices({ pageSize: 100000 }));
  }, [])

  useEffect(() => {
    let servicesArr = [
      {
        label: 'Select All',
        value: 'ALL'
      }
    ]
    if (services && services.length > 0) {
      services.filter((item) => {
        servicesArr.push({
          value: item._id,
          label: item.service_name
        })
      })
    }
    setServiceOption(servicesArr)
  }, [services])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          question_title: product?.question_title
            ? product?.question_title
            : "",
          services: product?.services
            ? serviceOption.filter((item) => product.services.includes(item.value))
            : [],
        }}
        validationSchema={ProductEditSchema}
        onSubmit={(values) => {
          let postData = {...values}
          if (values.services && values.services.length > 0) {
            postData.services = values.services.map((item) => item.value)
          } else {
            postData.services = []
          }
          saveProduct(postData);
        }}
      >
        {({ handleSubmit, setFieldValue, resetForm, values }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group">
                <label>Question Title <span className="indicatory">*</span></label>
                <Field
                  name="question_title"
                  component={Input}
                  placeholder="Question Title"
                  withFeedbackLabel={false}
                />
              </div>
              <div className="form-group">
              <SearchSelect
                name="services"
                options={serviceOption}
                onChange={(opt, row) => {
                  if (row?.action == 'select-option' && row?.option?.value == 'ALL') {
                    setFieldValue("services", serviceOption.filter((item) => item.value != 'ALL'))
                  } else {
                    setFieldValue("services", (opt) ? opt : [])
                  }
                } }
                placeholder="Select Services"
                isMulti
                value={values.services}
              />
              </div>
              <ResetButton
                btnResRef={btnResRef}
                resetForm={resetForm}
                initProduct={initProduct}
                resetEditor={resetEditor}
              />
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
