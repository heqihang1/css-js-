/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../_redux/job/jobActions";
import { ProductEditForm } from "./ProductEditForm";
import SuccessErrorAlert from "../../../../components/SuccessErrorAlert";
import { useLocation } from "react-router-dom";
import * as serviceActions from "../../../sets/_redux/services/servicesActions";

const initProduct = {};

export function ProductEdit({
  history,
  match: {
    params: { id },
  },
}) {
  const [loader, setLoader] = useState(false);
  const location = useLocation();

  const dispatch = useDispatch();

  const {
    productForEdit,
    services
  } = useSelector(
    (state) => ({
      productForEdit: state.job.productForEdit,
      services: state.services.entities,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.getJobDetails(id));
    dispatch(serviceActions.fetchservices({ pageSize: 100000 }));
  }, [id, dispatch]);

  const saveProduct = (values) => {
    setLoader(true);
    dispatch(actions.updatejob({ ...values, id })).then(
      (res) => {
        setLoader(false);
        setisSuccess({
          success: 2,
          message: "Job updated successfully",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
          history.push(`/jobs/${id}/details`);
        }, 3000);
      },
      (err) => {
        setLoader(false);
        let myerr = err.response.data.message;
        console.log(myerr.response);
        setisSuccess({
          success: 1,
          message: myerr || "An unknow error occured",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 5000);
      }
    );
  };

  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });

  return (
    <>
      {isSuccess.success !== 0 && (
        <SuccessErrorAlert isSuccess={isSuccess} setisSuccess={setisSuccess} />
      )}
      <ProductEditForm
        product={id ? productForEdit || initProduct : initProduct}
        saveProduct={saveProduct}
        loader={loader}
        location={location}
        productForEdit={productForEdit}
        services={services?.filter((x) => x.status === true)}
      />
    </>
  );
}
