/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/services/servicesActions";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ProductEditForm } from "./ProductEditForm";
import { useSubheader } from "../../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import SuccessErrorAlert from "../../../../../components/SuccessErrorAlert";

const initProduct = {
  service_name: "",
  service_content: "",
  service_type: "",
  service_price: "",
  service_minimum_consumption: ""
};

export function ProductEdit({
  history,
  match: {
    params: { id },
  },
}) {
  // Subheader
  const suhbeader = useSubheader();

  const [loader, setLoader] = useState(false)
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  // const layoutDispatch = useContext(LayoutContext.Dispatch);
  const { actionsLoading, productForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.customers.actionsLoading,
      productForEdit: state.services.serviceForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchservice(id));
  }, [id, dispatch]);

  useEffect(() => {
    let _title = id ? "" : "New Service Item";
    if (productForEdit && id) {
      _title = `Edit Service Item '${productForEdit.service_name}'`;
    }

    setTitle(_title);
    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productForEdit, id]);
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "This" });

  const saveProduct = (values) => {
    if (!id) {
      setLoader(true)
      dispatch(actions.createservice(values)).then(
        (res) => {
          setLoader(false)
          setisSuccess({
            success: 2,
            message: "Service item created successfully",
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
            backToProductsList();
          }, 3000);
        },
        (err) => {
          setLoader(false)
          let myerr = err.response.data.message;
          setisSuccess({ success: 1, message: myerr });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 5000);
        }
      );
    } else {
      setLoader(true)
      dispatch(actions.updateservice(values)).then(
        (res) => {
          setLoader(false)
          setisSuccess({
            success: 2,
            message: "Service item edited successfully",
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
            backToProductsList();
          }, 3000);
        },
        (err) => {
          setLoader(false)
          let myerr = err.response.data.message;
          setisSuccess({ success: 1, message: myerr });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 5000);
        }
      );
    }
  };

  const btnRef = useRef();
  const btnResRef = useRef();
  const saveProductClick = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };
  const resetProductClick = () => {
    if (btnResRef && btnResRef.current) {
      btnResRef.current.click();
    }
  };

  const backToProductsList = () => {
    history.push(`/sets/service-item`);
  };

  return (
    <Card>
      {actionsLoading && <ModalProgressBar />}
      <CardHeader title={title}>
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToProductsList}
            className="btn btn-light"
          >
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          {`  `}
          <button className="btn btn-light ml-2" onClick={resetProductClick}>
            <i className="fa fa-redo"></i>
            Reset
          </button>
          {`  `}
          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveProductClick}
            disabled={loader}
          >
            Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {isSuccess.success !== 0 && (
          <SuccessErrorAlert
            isSuccess={isSuccess}
            setisSuccess={setisSuccess}
          />
        )}
        <div className="mt-5">
          <ProductEditForm
            actionsLoading={actionsLoading}
            product={productForEdit || initProduct}
            btnRef={btnRef}
            btnResRef={btnResRef}
            saveProduct={saveProduct}
          />
        </div>
      </CardBody>
    </Card>
  );
}
