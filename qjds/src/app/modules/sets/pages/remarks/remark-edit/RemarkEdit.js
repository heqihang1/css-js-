/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/remarks/remarksActions";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { useSubheader } from "../../../../../../_metronic/layout";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { RemarkEditForm } from "./RemardEditForm";
import SuccessErrorAlert from "../../../../../components/SuccessErrorAlert";

// const initProduct = {
//   remark_name: "",
//   remark_content: "",
// };

export function RemarkEdit({
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
      actionsLoading: state.remarks.actionsLoading,
      productForEdit: state.remarks.remarkForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchRemark(id));
  }, [id, dispatch]);

  useEffect(() => {
    let _title = id ? "" : "New Remark";
    if (productForEdit && id) {
      _title = `Edit Remark '${productForEdit.remark_name}'`;
    }

    setTitle(_title);
    suhbeader.setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productForEdit, id]);

  const [isSuccess, setisSuccess] = useState({ success: 0, message: "This" });

  const saveProduct = (values) => {
    if (!id) {
      setLoader(true)
      dispatch(actions.createRemark(values)).then(
        (res) => {
          setLoader(false)
          setisSuccess({
            success: 2,
            message: "Remark created successfully",
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
      dispatch(actions.updateRemark(values)).then(
        (res) => {
          setLoader(false)
          setisSuccess({
            success: 2,
            message: "Remark updated successfully",
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
    history.push(`/sets/remarks`);
  };

  return (
    <Card className="h-100">
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
      <CardBody className="h-100">
        {isSuccess.success !== 0 && (
          <SuccessErrorAlert
            isSuccess={isSuccess}
            setisSuccess={setisSuccess}
          />
        )}
        <div className="mt-5 h-100">
          <RemarkEditForm
            saveremark={saveProduct}
            remark={productForEdit}
            btnRef={btnRef}
            btnResRef={btnResRef}
          />
        </div>
      </CardBody>
    </Card>
  );
}
