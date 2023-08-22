// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { Editor } from "../../../../../components/Editor";
import { ResetButton } from "../../../../../components/ResetButton";

// Validation schema
const remarkEditSchema = Yup.object().shape({
  remark_name: Yup.string().required("Remark name is required"),
  remark_content: Yup.string().test(
    "custom-required",
    "Description is required",
    (value) => (value && value.replace(/<[^>]+>/g, '') != '') ? true : false
  ),
});

const initProduct = {
  remark_name: "",
  remark_content: "",
};

export function RemarkEditForm({
  remark = { remark_name: "", remark_content: "" },
  btnRef,
  saveremark,
  btnResRef,
}) {
  let editorRef = React.useRef(null);
  let resetEditor = () => {
    editorRef.current.value = "";
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={remark}
        validationSchema={remarkEditSchema}
        onSubmit={(values) => {
          saveremark(values);
        }}
      >
        {({ handleSubmit, errors, setFieldValue, resetForm }) => (
          <>
            <Form className="form form-label-right h-100">
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-2 col-form-label">
                  rename remark <span className="indicatory">*</span>
                </label>
                <div className="col-sm-10">
                  <Field
                    id="name"
                    name="remark_name"
                    component={Input}
                    withFeedbackLabel={false}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-2 col-form-label">
                  remark description <span className="indicatory">*</span>
                </label>
                <div className="col-sm-10">
                  <Editor
                    name="remark_content"
                    initContent={remark.remark_content}
                    onChange={setFieldValue}
                    editor={editorRef}
                    placeholder="Remark content"
                  />
                  {errors.remark_content ? (
                    <div className="text-danger">
                      {errors.remark_content}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <ResetButton
                initProduct={initProduct}
                resetForm={resetForm}
                btnResRef={btnResRef}
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
