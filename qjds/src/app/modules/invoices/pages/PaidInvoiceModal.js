import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { FormLabel, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import * as actions from "../_redux/invoice/invoiceActions";
import * as paymentActions from "../../sets/_redux/payment-items/paymentMethodActions";
import SuccessErrorAlert from "../../../components/SuccessErrorAlert";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Input } from "../../../../_metronic/_partials/controls";
import SearchSelect from "react-select";

import { Field, Form, Formik } from "formik";

const PaidInvoiceModal = ({ doc, show, onHide }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [banks, setBanks] = useState([])
  const [paymentClearMethods, setPaymentClearMethods] = useState([])
  const [isSuccess, setisSuccess] = useState({ success: 0, message: "" });
  const [paidAmt, setPaidAmt] = useState(0)

  let [payment_term, setpayment_term] = useState({});
  let [bank, setBank] = useState({});

  useEffect(() => {
    if (!doc) {
      onHide();
    }
  }, [doc]);

  useEffect(() => {
    if (show) {
      dispatch(actions.fetchInvoicePaidAmt(doc?._id)).then(
        (res) => {
          setPaidAmt(res.data.paid_amt)
        }
      );
    }
  }, [show]);

  useEffect(() => {
    dispatch(paymentActions.findbanks({})).then(
      (res) => {
        setBanks(res.data.banks)
      }
    );
    dispatch(paymentActions.findpaymentClearMethods({})).then(
      (res) => {
        setPaymentClearMethods(res.data.payment_clear_methods)
      }
    );
  }, [])

  const PaidInvoiceSchema = Yup.object().shape({
    payment_date: Yup.string().required("Payment date is required"),
    payment_amount: Yup.number().required("Payment amount is required")
  });

  function InvoicePayment(values) {
    console.log('value', values)
    dispatch(actions.invoicePayment(values)).then(
      (res) => {
        if (res.status == 200) {
          setisSuccess({
            success: 2,
            message: "Invoice payment created successfully",
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 3000);
          onHide('yes'); 
        } else {
          setisSuccess({
            success: 1,
            message: res.data.message,
          });
          setTimeout(() => {
            setisSuccess({ success: 0, message: "" });
          }, 5000);
        }
      },
      (err) => {
        let myerr = err.response.data.message;
        setisSuccess({
          success: 1,
          message: myerr || "An unknown error occured",
        });
        setTimeout(() => {
          setisSuccess({ success: 0, message: "" });
        }, 5000);
      }
    );
  }

  return (
    <>
      {isSuccess.success == 2 && (
        <SuccessErrorAlert isSuccess={isSuccess} setisSuccess={setisSuccess} />
      )}
      <Modal
        show={show}
        onHide={onHide}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Confirmation
          </Modal.Title>
        </Modal.Header>
        <Formik
            enableReinitialize={true}        
            validationSchema={PaidInvoiceSchema}
            initialValues={{
              payment_date: '',
              payment_amount: '',
              remark: '',
              payment_clear_method_id: '',
              bank_id: '',
              invoice_id: doc?._id
            }}
            onSubmit={(values) => {   
              InvoicePayment(values)
            }}
          >
          {({ handleSubmit, setFieldValue }) => (
            <Form className="form form-label-right">
              <Modal.Body>
                <div className="col form-group">
                  {isSuccess.success == 1 && (
                    <div className="form-group ">
                      <SuccessErrorAlert isSuccess={isSuccess} setisSuccess={setisSuccess} />
                    </div>
                  )}
                  <div className="form-group ">
                    <FormLabel>Confirm that the following invoice has been paid?</FormLabel>
                    <br></br>
                    <b>{doc?.invoice_no}</b>
                  </div>
                  <div className="form-group">
                    <FormLabel>Invoice Amount</FormLabel>
                    <br></br>
                    <b>${doc?.amount}</b>
                  </div>
                  <div className="form-group ">
                    <FormLabel>Outstanding amount</FormLabel>
                    <br></br>
                    <b>${parseFloat(doc?.amount) - parseFloat(paidAmt)}</b>
                  </div>
                  <div className="form-group ">
                    <FormLabel>Amount paid</FormLabel>
                    <br></br>
                    <b>${paidAmt}</b>
                  </div>
                  <div className="form-group ">
                    <FormLabel>Payment Date</FormLabel>
                    <Field     
                      name="payment_date"                          
                      type="date"
                      component={Input}
                    /> 
                  </div>
                  <div className="form-group ">
                    <FormLabel>Payment Amount</FormLabel>
                    <Field
                      name="payment_amount"
                      type="text"
                      customFeedbackLabel={true}
                      component={Input}
                      placeholder="Payment Amount"
                    />
                  </div>
                  <div className="form-group ">
                    <FormLabel>Payment method</FormLabel>
                    <SearchSelect
                      value={payment_term}
                      name="payment_clear_method_id"
                      options={
                        paymentClearMethods &&
                        paymentClearMethods.map((paymentMethod) => ({
                          value: paymentMethod._id,
                          label: paymentMethod.name,
                        }))
                      }
                      onChange={(opt) => {
                        setpayment_term(opt);
                        setFieldValue("payment_clear_method_id", opt?.value);
                      }}
                    /> 
                  </div>

                  <div className="form-group ">
                    <FormLabel>Paying Bank</FormLabel>
                    <SearchSelect
                      value={bank}
                      name="bank_id"
                      options={
                        banks &&
                        banks.map((item) => ({
                          value: item._id,
                          label: item.bank_eng_name,
                        }))
                      }
                      onChange={(opt) => {
                        setBank(opt);
                        setFieldValue("bank_id", opt?.value);
                      }}
                    /> 
                  </div>

                  <div className="form-group ">
                    <FormLabel>Remark</FormLabel>
                    <Field
                      name="remark"
                      type="text"
                      customFeedbackLabel={true}
                      component={Input}
                      placeholder="(cheque number/transaction number)"
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div>
                  <button
                    type="button"
                    onClick={onHide}
                    className="btn btn-secondary btn-elevate"
                  >
                    Close
                  </button>
                  <> </>
                  <button
                    type="submit"
                    className="btn btn-primary btn-elevate"
                    onClick={handleSubmit}
                  >
                    Confirm Paid
                  </button>
                </div>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default PaidInvoiceModal;
