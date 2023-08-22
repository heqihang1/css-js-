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
  commercial_sector_name: "",
};

// Validation schema
const ProductEditSchema = Yup.object().shape({
  commercial_sector_name: Yup.string().required(
    "Commercial Sector name is required"
  ),
});

export function ProductEditForm({
  product = { commercial_sector_name: "" },
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
          commercial_sector_name: product?.commercial_sector_name
            ? product?.commercial_sector_name
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
                <label>Commercial Sector <span className="indicatory">*</span></label>
                <Field
                  name="commercial_sector_name"
                  component={Input}
                  placeholder="Commercial Sector"
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
