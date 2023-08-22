// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { ResetButton } from "../../../../../components/ResetButton";
import { Editor } from "../../../../../components/Editor";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  payment_method_name: Yup.string().required("Payment method name is required"),
  over_due_day: Yup.number().integer().required("Over due day is required"),
  payment_method_content: Yup.string().test(
    "custom-required",
    "Description is required",
    (value) => (value && value.replace(/<[^>]+>/g, '') != '') ? true : false
  ),
});

const initProduct = {
  payment_method_name: "",
  payment_method_content: "",
  over_due_day: ""
};

export function ProductEditForm({ product, btnRef, saveProduct, btnResRef }) {
  let productEdited = JSON.parse(JSON.stringify(product))
  if (productEdited.payment_method_content != '') {
    productEdited.payment_method_content = product.payment_method_content.replace(/\\r\\n/g, "<br />")
  }
  let editorRef = useRef(null);
  let resetEditor = () => (editorRef.current.value = "");
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={productEdited}
        validationSchema={ProductEditSchema}
        onSubmit={(values) => {
          saveProduct(values);
        }}
      >
        {({ handleSubmit, errors, resetForm, setFieldValue }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group">
                <label>Payment method name <span className="indicatory">*</span></label>
                <Field
                  withFeedbackLabel={false}
                  name="payment_method_name"
                  component={Input}
                  placeholder="Payment method name"
                />
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-lg-2">
                    <label>Over due day <span className="indicatory">*</span></label>
                    <Field
                      withFeedbackLabel={false}
                      name="over_due_day"
                      component={Input}
                      type="number"
                    />
                  </div>
                  <div className="col-lg-1 mt-10 ml-0 pl-0">
                    Days
                  </div>
                </div>
              </div>
              <div className="form-group ">
                <label>Description <span className="indicatory">*</span></label>
                <Editor
                  name="payment_method_content"
                  initContent={productEdited?.payment_method_content}
                  onChange={setFieldValue}
                  editor={editorRef}
                  placeholder="Enter your content here"                    
                />
                {errors.payment_method_content ? (
                  <div className="text-danger">
                    {errors.payment_method_content}
                  </div>
                ) : (
                  ""
                )}
                {/* <Field
                  withFeedbackLabel={false}
                  name="payment_method_content"
                  as="textarea"
                  className="form-control"
                /> */}
              </div>
              <ResetButton
                btnResRef={btnResRef}
                initProduct={initProduct}
                resetForm={resetForm}
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
