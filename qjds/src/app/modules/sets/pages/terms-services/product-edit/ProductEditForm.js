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
  terms_conditions_name: "",
  terms_conditions_content: "",
};

// Validation schema
const ProductEditSchema = Yup.object().shape({
  terms_conditions_name: Yup.string().required("Name is required"),
  terms_conditions_content: Yup.string().test(
    "custom-required",
    "Description is required",
    (value) => (value && value.replace(/<[^>]+>/g, '') != '') ? true : false
  ),
});

export function ProductEditForm({
  product = { terms_conditions_name: "", terms_conditions_content: "" },
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
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values) => {
          saveProduct(values);
        }}
      >
        {({ handleSubmit, errors, setFieldValue, resetForm }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group">
                <label>Terms and Services <span className="indicatory">*</span></label>
                <Field
                  name="terms_conditions_name"
                  component={Input}
                  placeholder="Terms and Services"
                  withFeedbackLabel={false}
                />
              </div>
              <div className="form-group ">
                <label>Description <span className="indicatory">*</span></label>
                <div className="col-sm-10">
                  <Editor
                    name="terms_conditions_content"
                    initContent={product.terms_conditions_content}
                    onChange={setFieldValue}
                    editor={editorRef}
                    placeholder="Enter your content here"
                  />
                  {errors.terms_conditions_content ? (
                    <div className="text-danger">
                      {errors.terms_conditions_content}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
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
