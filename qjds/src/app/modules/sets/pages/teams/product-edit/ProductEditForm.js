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
  carPlateNumber: "",
  password: "",
};

// Validation schema
const ProductEditSchema = Yup.object().shape({
  carPlateNumber: Yup.string().required("Car Plate Number is required"),
  // password: Yup.string().required("Password is required"),
});

export function ProductEditForm({
  product = { carPlateNumber: "", password: "" },
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
          carPlateNumber: product?.carPlateNumber
            ? product?.carPlateNumber
            : "",
          password: "",
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
                <label>Car Plate Number <span className="indicatory">*</span></label>
                <Field
                  name="carPlateNumber"
                  component={Input}
                  placeholder="Car Plate Number"
                  withFeedbackLabel={false}
                />
              </div>
              <div className="form-group">
                <label>Password <span className="indicatory">*</span></label>
                <Field
                  name="password"
                  component={Input}
                  placeholder="Password"
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
