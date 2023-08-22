import React from "react";
import { FormattedMessage } from "react-intl";

function Verified() {
  return (
    <div className="" id="">
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="ACCOUNT VERIFIED ✔️" />
        </h3>
        <p className="text-muted font-weight-bold">
          You can now login with your credentials
        </p>
        <a className="btn btn-primary font-weight-bold mt-5" href="/auth/login">
          LOGIN
        </a>
      </div>
      {/* end::Head */}
    </div>
  );
}

export default Verified;
