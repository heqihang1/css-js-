import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createuser, updateuser } from "../../../_redux/users/usersActions";
import Axios from "axios";
import _ from "lodash";
import { API_URL } from "../../../../../API_URL";
import { useDispatch } from "react-redux";
import InputColor from 'react-input-color'

const initialValues = {
  email: "",
  username: "",
  displayname: "",
  password: "masterclean",
  role: "",
  hotline: "",
  department: "",
};

function Registration({ btnRef, resetRef, productForEdit }) {
  const [loader, setLoader] = useState(false);
  const [roles, setroles] = useState([{ rolename: "Seller" }]);
  const [color, setColor] = useState('')
  const [reIntial, setReIntial] = useState(true);
  const [loading, setLoading] = useState(false);

  let dispatch = useDispatch();

  const getRoles = async () => {
    Axios.get(API_URL + "roles").then((data) => {
        setroles(data.data.docs);
      }).catch((err) => console.log(err));
  };

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (productForEdit?.color) {
      setColor(productForEdit?.color)
    }
  }, [productForEdit]);

  const EditSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .optional(),
    username: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(),
    displayname: Yup.string().required(),
    role: Yup.string().required(),
    hotline: Yup.string()
      .min(3)
      .max(100)
      .required(),
    department: Yup.string()
      .min(3)
      .max(100)
      .required(),
  });

  const RegistrationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .optional(),
    username: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(),
    displayname: Yup.string().required(),
    role: Yup.string().required(),
    hotline: Yup.string()
      .required()
      .min(3)
      .max(100),
    department: Yup.string()
      .required()
      .min(3)
      .max(100),
    password: Yup.string()
      .min(6, "Minimum 6 symbols")
      .max(50, "Maximum 50 symbols")
      .required(),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

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
    initialValues: productForEdit
      ? {
          ..._.pick(productForEdit, [
            "email",
            "displayname",
            "username",
            "hotline",
            "department",
            "role",
          ]),
          password: "",
        }
      : initialValues,
    validationSchema: productForEdit ? EditSchema : RegistrationSchema,
    enableReinitialize: reIntial,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setSubmitting(true);
      setLoader(true);
      enableLoading();
      let user = _.pick(values, [
        "email",
        "username",
        "displayname",
        "password",
        "role",
        "hotline",
        "department",
      ]);
      user.color = color ? color : ''
      dispatch(
        productForEdit
          ? updateuser({ ...user, id: productForEdit._id })
          : createuser(user)
      ).then(() => {
          setLoader(false);
          window.location.href = "/admin/users";
          disableLoading();
          setSubmitting(false);
      }).catch((err) => {
        setLoader(false);
        setSubmitting(false);
        setStatus(
          err?.response?.data?.message ||
            "AN error occurred while registering"
        );
        disableLoading();
      });
    },
  });

  const handleColorInput = (e) => {
    if (e.hex !== color) {
      setColor(e.hex)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setReIntial(false)
    }, [1000])
  }, [])

  return (
    <div className="login-form login-signin" style={{ display: "block" }}>
      <form
        id="kt_login_signin_form"
        className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
        onSubmit={formik.handleSubmit}
      >
        {/* begin: Alert */}
        {formik.status && (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}
        {/* end: Alert */}

        {/* begin: Email */}
        <div className="form-group fv-plugins-icon-container">
          <label htmlFor="">Email</label>
          <input
            placeholder="Email"
            type="email"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "email"
            )}`}
            name="email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.email}</div>
            </div>
          ) : null}
        </div>
        {/* end: Email */}

        {/* begin: Username */}
        <div className="form-group fv-plugins-icon-container">
          <label htmlFor="">Username <span className="indicatory">*</span></label>
          <input
            placeholder="Username"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "username"
            )}`}
            name="username"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.username}</div>
            </div>
          ) : null}
        </div>
        {/* end: Username */}

        {/* begin: Displayname */}
        <div className="form-group fv-plugins-icon-container">
          <label htmlFor="">Display Name <span className="indicatory">*</span></label>
          <input
            placeholder="Display Name"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "displayname"
            )}`}
            name="displayname"
            {...formik.getFieldProps("displayname")}
          />
          {formik.touched.displayname && formik.errors.displayname ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.displayname}</div>
            </div>
          ) : null}
        </div>
        {/* end: Displayname */}

        <div className="form-group fv-plugins-icon-container">
          <label htmlFor="">Role <span className="indicatory">*</span></label>
          <select
            name="role"
            required=""
            className="form-control form-control-solid h-auto py-5 px-6"
            {...formik.getFieldProps("role")}
          >
            <option value="">Select Role</option>
            {roles.map((role, index) => (
              <option
                key={index}
                value={role.rolename}
                style={{ textTransform: "capitalize" }}
              >
                {role.rolename}
              </option>
            ))}
          </select>
          {formik.touched.role && formik.errors.role && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.role}</div>
            </div>
          )}
        </div>

        <div className="form-group fv-plugins-icon-container">
          <label htmlFor="">Hotline <span className="indicatory">*</span></label>
          <input
            placeholder="Hotline"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "hotline"
            )}`}
            name="hotline"
            {...formik.getFieldProps("hotline")}
          />
          {formik.touched.hotline && formik.errors.hotline ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.hotline}</div>
            </div>
          ) : null}
        </div>

        <div className="form-group fv-plugins-icon-container">
          <label htmlFor="">Department <span className="indicatory">*</span></label>

          <input
            placeholder="Department"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "department"
            )}`}
            name="department"
            {...formik.getFieldProps("department")}
          />
          {formik.touched.department && formik.errors.department ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.department}</div>
            </div>
          ) : null}
        </div>

        <div className="form-group fv-plugins-icon-container">
          <label>Color</label>
          <br></br>
          <InputColor
            name="color"
            style={{minHeight:'40px', minWidth:'100px'}}
            id="color"
            initialValue={color}
            onChange={handleColorInput}
          />
        </div>

        {/* begin: Password */}
        <div className="form-group fv-plugins-icon-container">
          <label htmlFor="">Password { productForEdit ? '' : <span className="indicatory">*</span>}</label>
          <input
            placeholder="Password"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "password"
            )}`}
            name="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
        </div>
        {/* end: Password */}

        {/* begin: Confirm Password */}
        {/* <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Confirm Password"
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "changepassword"
            )}`}
            name="changepassword"
            {...formik.getFieldProps("changepassword")}
          />
          {formik.touched.changepassword && formik.errors.changepassword ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.changepassword}
              </div>
            </div>
          ) : null}
        </div> */}
        {/* end: Confirm Password */}

        <div className="form-group flex-wrap flex-center d-none">
          <button
            type="submit"
            ref={loader ? null : btnRef}
            disabled={loader}
            className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
          >
            <span>Submit</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
          <button
            type="button"
            ref={resetRef}
            onClick={() => { formik.resetForm({ values: initialValues }); setColor('') }}
            style={{ display: "none" }}
          ></button>
        </div>
      </form>
    </div>
  );
}

export default Registration;
