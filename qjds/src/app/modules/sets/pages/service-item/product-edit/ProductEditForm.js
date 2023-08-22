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
  service_name: Yup.string().required("Price is required"),
  service_content: Yup.string().test(
    "custom-required",
    "Description is required",
    (value) => (value && value.replace(/<[^>]+>/g, '') != '') ? true : false
  ),
  service_type: Yup.string().required("Type is required"),
  service_price: Yup.number().required("Price is required"),
  service_minimum_consumption: Yup.number().required("Minimum consumption is required"),
});

const initProduct = {
  service_name: "",
  service_content: "",
  service_type: "",
  service_price: "",
  service_minimum_consumption: ""
};

export function ProductEditForm({ product, btnRef, btnResRef, saveProduct }) {
  let productEdited = JSON.parse(JSON.stringify(product));
  if (productEdited.service_content != "") {
    productEdited.service_content = product.service_content.replace(
      /\\r\\n/g,
      "<br />"
    );
  }
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
        {({ handleSubmit, errors, setFieldValue, values, resetForm }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group">
                <label>Service name <span className="indicatory">*</span></label>
                <Field
                  name="service_name"
                  component={Input}
                  placeholder="Service name"
                  withFeedbackLabel={false}
                />
              </div>
              <div className="form-group">
                <label htmlFor="model" className="mr-5">
                  Type <span className="indicatory">*</span>
                </label>
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    class="custom-control-input"
                    id="defaultInline1"
                    value={"One time-service"}
                    name="service_type"
                    defaultChecked={product.service_type === "One time-service"}
                    onChange={() =>
                      setFieldValue("service_type", "One time-service")
                    }
                  />
                  <label
                    class="custom-control-label"
                    for="defaultInline1"
                    style={
                      values.service_type === "One time-service"
                        ? { color: "dodgerblue" }
                        : {}
                    }
                  >
                    One time-service
                  </label>
                </div>

                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    class="custom-control-input"
                    id="defaultInline2"
                    name="service_type"
                    value={"Contract-service"}
                    onChange={() =>
                      setFieldValue("service_type", "Contract-service")
                    }
                  />
                  <label
                    class="custom-control-label"
                    for="defaultInline2"
                    style={
                      values.service_type === "Contract-service"
                        ? { color: "dodgerblue" }
                        : {}
                    }
                  >
                    Contract-service
                  </label>
                </div>

                {errors.service_type ? (
                  <div className="text-danger">
                    {errors.service_type}
                  </div>
                ) : (
                  ""
                )}

              </div>
              <div className="form-group ">
                <label>Description <span className="indicatory">*</span></label>
                <Editor
                  name="service_content"
                  initContent={product?.service_content?.replaceAll(
                    "\\r\\n",
                    "<br/>"
                  )}
                  onChange={setFieldValue}
                  editor={editorRef}
                  placeholder="Enter your content here"
                />
                {errors.service_content ? (
                  <div className="text-danger">
                    {errors.service_content}
                  </div>
                ) : (
                  ""
                )}
                {/* <Field
                  name="service_content"
                  as="textarea"
                  className="form-control"
                  withFeedbackLabel={false}
                /> */}
              </div>
              <div className="form-group">
                <label>Price per square foot <span className="indicatory">*</span></label>
                <Field
                  name="service_price"
                  component={Input}
                  placeholder="Price per square foot"
                  withFeedbackLabel={false}
                />
              </div>
              <div className="form-group">
                <label>Minimum Consumption <span className="indicatory">*</span></label>
                <Field
                  name="service_minimum_consumption"
                  component={Input}
                  placeholder="Minimum Consumption"
                  withFeedbackLabel={false}
                />
              </div>
              <ResetButton
                btnResRef={btnResRef}
                resetForm={resetForm}
                initProduct={initProduct}
                resetEditor={resetEditor}
              ></ResetButton>
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
