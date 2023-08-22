import React from "react";
import { FormattedMessage } from "react-intl";

function Verify() {
  return (
    <div className="" id="">
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="VERIFICATION EMAIL" />
        </h3>
        <p className="text-muted font-weight-bold">
          Check your email to verify your account!
        </p>
      </div>
      {/* end::Head */}
    </div>
  );
}

export default Verify;
