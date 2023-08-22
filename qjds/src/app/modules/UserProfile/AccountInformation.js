/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useSelector, shallowEqual, connect } from "react-redux";
import * as auth from "../Auth";

function AccountInformation(props) {
  const user = useSelector((state) => state.auth.user, shallowEqual);
  return (
    <div className="card card-custom">
      <div className="card-header py-3">
        <div className="card-title align-items-start flex-column">
          <h3 className="card-label font-weight-bolder text-dark">User</h3>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            User information
          </span>
        </div>
      </div>
      <div className="card-body">
        <div className="card-title align-items-start flex-column">
          <h5 className="card-label font-size-md font-weight-bold text-dark">
            Username
          </h5>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            {user.username}
          </span>
        </div>
        <div className="card-title align-items-start flex-column">
          <h5 className="card-label font-size-md font-weight-bold text-dark">
            Email
          </h5>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            {user.email}
          </span>
        </div>
        <div className="card-title align-items-start flex-column">
          <h5 className="card-label font-size-md font-weight-bold text-dark">
            Display Name
          </h5>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            {user?.displayname}
          </span>
        </div>
        <div className="card-title align-items-start flex-column">
          <h5 className="card-label font-size-md font-weight-bold text-dark">
            Role
          </h5>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            {user.role}
          </span>
        </div>
        <div className="card-title align-items-start flex-column">
          <h5 className="card-label font-size-md font-weight-bold text-dark">
            Hotline
          </h5>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            {user.hotline ? user.hotline : "Not set"}
          </span>
        </div>
        <div className="card-title align-items-start flex-column">
          <h5 className="card-label font-size-md font-weight-bold text-dark">
            Department
          </h5>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            {user.dpartment ? user.department : "Not set"}
          </span>
        </div>
        <div className="card-title align-items-start flex-column">
          <h5 className="card-label font-size-md font-weight-bold text-dark">
            Registered on
          </h5>
          <span className="text-muted font-weight-bold font-size-sm mt-1">
            {/* {user.createdAt} */}
            {Intl.DateTimeFormat("en-GB", {
              dateStyle: "short",
              timeStyle: "short",
            })
              .format(new Date(user.createdAt))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default connect(null, auth.actions)(AccountInformation);
