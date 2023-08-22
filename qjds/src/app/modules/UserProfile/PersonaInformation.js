/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
// import SVG from "react-inlinesvg";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
// import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import * as auth from "../Auth";
import Axios from "axios";
import Resizer from "react-image-file-resizer";
import _ from "lodash";
import { API_URL } from "../../API_URL";

function PersonalInformation(props) {
  // Fields
  const [loading, setloading] = useState(false);
  const [isError, setisError] = useState(false);
  const [error, seterror] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user, shallowEqual);

  let [profile_pic, setprofile_pic] = useState(user?.profile_pic);
  let [imageFile, setImageFile] = useState();
  let [isImageUpdated, setIsImageUpdated] = useState(false);

  // Methods
  const saveUser = (values, setStatus, setSubmitting) => {
    setloading(true);
    setisError(false);
    seterror("");
    values = _(values)
      .omitBy(_.isNil)
      .omitBy(_.isEmpty)
      .value();
    const updatedUser = Object.assign(user, values);
    // user for update preparation
    setTimeout(() => {
      setisError(false);
      setIsSuccess(false);
      Axios.put(API_URL + "users/edit-user", { ...values, profile_pic })
        .then(async () => {
          dispatch(props.setUser({ ...updatedUser, profile_pic }));
          setSubmitting(false);
          setloading(false);
          setIsSuccess(true);
        })
        .catch((error) => {
          console.log(error.response);
          setloading(false);
          setSubmitting(false);
          setStatus(error);
          setisError(true);
          seterror(error.response.data.message);
        });
    }, 500);
  };
  // UI Helpers
  const initialValues = {
    email: user.email,
    displayname: user?.displayname,
    username: user.username,
    hotline: user?.hotline ? user.hotline : "",
    department: user?.department ? user.department : "",
  };

  useEffect(() => {
    setprofile_pic(user?.profile_pic);
    setIsImageUpdated(false);
  }, [user]);

  const Schema = Yup.object().shape({
    email: Yup.string()
      .email()
      .optional(),
    username: Yup.string()
      .max(50)
      .min(2)
      .optional(),
    displayname: Yup.string().required("Display name is required"),
    hotline: Yup.string()
      .max(100)
      .min(2)
      .optional(),
    department: Yup.string()
      .max(50)
      .min(2)
      .optional(),
  });
  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };
  const formik = useFormik({
    initialValues,
    validationSchema: Schema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      saveUser(values, setStatus, setSubmitting);
    },
    onReset: (values, { resetForm }) => {
      resetForm();
    },
  });

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        100,
        100,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  let handleImageChange = async (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    setImageFile(file);
    let newImage = await resizeFile(file);
    setprofile_pic(newImage);
  };

  return (
    <form className="card card-custom" onSubmit={formik.handleSubmit}>
      {loading && <ModalProgressBar />}

      {/* begin::Header */}
      <div className="card-header py-3">
        <div className="card-title align-items-start flex-column">
          <h3 className="card-label font-weight-bolder text-dark">
            User profile
          </h3>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            Update your profile
          </span>
        </div>
        <div className="card-toolbar">
          <button
            type="submit"
            className="btn btn-success mr-2"
            disabled={
              formik.isSubmitting || (formik.touched && !formik.isValid)
            }
          >
            Save Changes
            {formik.isSubmitting}
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Form */}
      <div className="form">
        <div className="card-body w-100">
          {/* begin::Alert */}
          {isError && (
            <div
              className="alert alert-custom alert-light-danger fade show mb-10"
              role="alert"
            >
              <div className="alert-icon">
                <span className="svg-icon svg-icon-3x svg-icon-danger">
                  <div
                    className="alert-close"
                    onClick={() => setisError(false)}
                  >
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">
                        <i className="ki ki-close"></i>
                      </span>
                    </button>
                  </div>
                </span>
              </div>

              <div className="alert-text font-weight-bold mr-5">{error}</div>
            </div>
          )}
          {isSuccess && (
            <div
              className="alert alert-custom alert-light-success fade show mb-10"
              role="alert"
            >
              <div className="alert-icon">
                <span className="svg-icon svg-icon-3x svg-icon-success">
                  <div
                    className="alert-close"
                    onClick={() => setIsSuccess(false)}
                  >
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">
                        <i className="ki ki-close"></i>
                      </span>
                    </button>
                  </div>
                </span>
              </div>

              <div className="alert-text font-weight-bold mr-5">
                {"Updated Successfully"}
              </div>
            </div>
          )}
          {/* end::Alert */}
          <div className="d-flex align-items-center mb-5">
            <div className="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center">
              <div
                className="symbol-label"
                style={
                  profile_pic
                    ? {
                        backgroundImage: `url(${profile_pic})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                      }
                    : { background: user?.color }
                }
              ></div>
            </div>
            <input
              type="file"
              name=""
              id="profile_pic"
              className="d-none"
              onInput={handleImageChange}
            />
            <label
              htmlFor="profile_pic"
              className="text-primary cursor-pointer"
            >
              Change profile image
            </label>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Email
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                disabled
                type="text"
                placeholder="Email"
                className={`form-control form-control-lg form-control-solid mb-2 ${getInputClasses(
                  "email"
                )}`}
                name="email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="invalid-feedback">{formik.errors.email}</div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Username
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                disabled
                type="passwtextord"
                placeholder="New username"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "username"
                )}`}
                name="username"
                {...formik.getFieldProps("username")}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="invalid-feedback">{formik.errors.username}</div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Display Name <span className="indicatory">*</span>
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                type="text"
                placeholder="New Display Name"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "displayname"
                )}`}
                name="displayname"
                {...formik.getFieldProps("displayname")}
              />
              {formik.touched.displayname && formik.errors.displayname ? (
                <div className="invalid-feedback">
                  {formik.errors.displayname}
                </div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Hotline
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                disabled
                type="text"
                placeholder="Hotline"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "hotline"
                )}`}
                name="hotline"
                {...formik.getFieldProps("hotline")}
              />
              {formik.touched.hotline && formik.errors.hotline ? (
                <div className="invalid-feedback">{formik.errors.hotline}</div>
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">
              Department
            </label>
            <div className="col-lg-9 col-xl-6">
              <input
                disabled
                type="text"
                placeholder="Department"
                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                  "department"
                )}`}
                name="department"
                {...formik.getFieldProps("department")}
              />
              {formik.touched.department && formik.errors.department ? (
                <div className="invalid-feedback">
                  {formik.errors.department}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {/* end::Form */}
    </form>
  );
}

export default connect(null, auth.actions)(PersonalInformation);
