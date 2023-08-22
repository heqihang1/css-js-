/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/districts/districtsActions";
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
  district_eng_name: "",
  district_chi_name: "",
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
      actionsLoading: state.districts.actionsLoading,
      productForEdit: state.districts.districtForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchDistrictByID(id));
  }, [id, dispatch]);

  useEffect(() => {
    let _title = id ? "Edit District Details" : "New District";

    setTitle(_title);
    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productForEdit, id]);
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "This" });

  const saveProduct = (values) => {
    if (!id) {
      setLoader(true)
      dispatch(actions.createDistrict(values)).then(
        (res) => {
          setLoader(false)
          setisSuccess({
            success: 2,
            message: "District created successfully",
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
      dispatch(
        actions.updateDistrict({
          _id: id,
          ...values,
        })
      ).then(
        (res) => {
          setLoader(false)
          setisSuccess({
            success: 2,
            message: "District updated successfully",
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
  const saveProductClick = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };
  const btnResRef = useRef();
  const resetForm = () => {
    if (btnResRef && btnResRef.current) {
      btnResRef.current.click();
    }
  };

  const backToProductsList = () => {
    history.push(`/sets/districts`);
  };

  return (
    <>
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
            <button className="btn btn-light ml-2" onClick={(e) => resetForm()}>
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
              saveProduct={saveProduct}
              btnResRef={btnResRef}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
