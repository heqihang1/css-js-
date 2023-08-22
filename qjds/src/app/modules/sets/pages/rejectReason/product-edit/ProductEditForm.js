// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { Editor } from "../../../../../components/Editor";
import { ResetButton } from "../../../../../components/ResetButton";

const initProduct = {
  reject_reason: "",
};

// Validation schema
const ProductEditSchema = Yup.object().shape({
  reject_reason: Yup.string().required(
    "Reject reason is required"
  ),
});

export function ProductEditForm({
  product = { reject_reason: "" },
  btnRef,
  saveProduct,
  btnResRef,
}) {
  let editorRef = useRef(null);
  let resetEditor = () => (editorRef.current.value = "");
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          reject_reason: product?.reject_reason
            ? product?.reject_reason
            : "",
        }}
        validationSchema={ProductEditSchema}
        onSubmit={(values) => {
          saveProduct(values);
        }}
      >
        {({ handleSubmit, setFieldValue, resetForm }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group">
                <label>Reject Reason <span className="indicatory">*</span></label>
                <Field
                  name="reject_reason"
                  component={Input}
                  placeholder="Reject Reason"
                  withFeedbackLabel={false}
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
