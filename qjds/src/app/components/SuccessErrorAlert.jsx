import React from "react";
import { Alert } from "react-bootstrap";

export default function SuccessErrorAlert({ isSuccess, setisSuccess }) {
  return (
    <Alert
      variant={isSuccess.success === 1 ? "danger" : "success"}
      dismissible
      onClose={() => setisSuccess({ success: 0, message: "" })}
    >
      <strong>{isSuccess.message}</strong>
    </Alert>
  );
}
