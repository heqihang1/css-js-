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
  district_eng_name: "",
  district_chi_name: "",
};

// Validation schema
const ProductEditSchema = Yup.object().shape({
  district_eng_name: Yup.string().required("District (Eng) is required"),
  district_chi_name: Yup.string().required("District (Chi) is required"),
});

export function ProductEditForm({
  product = { district_eng_name: "", district_chi_name: "" },
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
          district_eng_name: product?.district_eng_name
            ? product?.district_eng_name
            : "",
          district_chi_name: product?.district_chi_name
            ? product?.district_chi_name
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
                <label>District (Eng) <span className="indicatory">*</span></label>
                <Field
                  name="district_eng_name"
                  component={Input}
                  placeholder="District (Eng)"
                  withFeedbackLabel={false}
                />
              </div>
              <div className="form-group">
                <label>District (Chi) <span className="indicatory">*</span></label>
                <Field
                  name="district_chi_name"
                  component={Input}
                  placeholder="District (Chi)"
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
