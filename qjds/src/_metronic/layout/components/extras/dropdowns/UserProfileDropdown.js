/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { useSelector } from "react-redux";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";

export function UserProfileDropdown() {
  const { user } = useSelector((state) => state.auth);
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      light:
        objectPath.get(uiService.config, "extras.user.dropdown.style") ===
        "light",
    };
  }, [uiService]);

  return (
    <Dropdown drop="down" alignRight>
      <Dropdown.Toggle
        as={DropdownTopbarItemToggler}
        id="dropdown-toggle-user-profile"
      >
        <div
          className={
            "btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
          }
        >
          <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">
            Hi,
          </span>{" "}
          <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
            {user?.displayname ? user?.displayname : user?.username}
          </span>
          <span className="symbol symbol-35">
            <span className="symbol-label font-size-h5 font-weight-bold">
              <Avatar
                src={user?.profile_pic}
                alt={user.username}
                style={{ width: 35, height: 35 }}
              />
            </span>
          </span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
        <>
          {/** ClassName should be 'dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
          {layoutProps.light && (
            <>
              <div className="d-flex align-items-center p-8 rounded-top">
                <div className="symbol symbol-md bg-light-primary mr-3 flex-shrink-0">
                  <img src={toAbsoluteUrl("/media/users/300_21.jpg")} alt="" />
                </div>
                <div className="text-dark m-0 flex-grow-1 mr-3 font-size-h5">
                  {user?.displayname ? user?.displayname : user?.username}
                </div>
                {/* <span className="label label-light-success label-lg font-weight-bold label-inline">
                  3 messages
                </span> */}
              </div>
              <div className="separator separator-solid"></div>
            </>
          )}

          {!layoutProps.light && (
            <div
              className="d-flex align-items-center justify-content-between flex-wrap p-8 bgi-size-cover bgi-no-repeat rounded-top"
              style={{
                backgroundImage: `url(${toAbsoluteUrl(
                  "/media/misc/bg-1.jpg"
                )})`,
              }}
            >
              <div className="symbol bg-white-o-15 mr-3">
                <Avatar
                  src={user?.profile_pic}
                  alt={user.username}
                  style={{ width: 40, height: 40 }}
                />
              </div>
              <div className="text-white m-0 flex-grow-1 mr-3 font-size-h5">
                {user?.displayname ? user?.displayname : user?.username}
              </div>
              {/* <span className="label label-success label-lg font-weight-bold label-inline">
                3 messages
              </span> */}
            </div>
          )}
        </>

        <div className="navi navi-spacer-x-0 pt-5">
          <Link to="/user-profile" className="navi-item px-8 cursor-pointer">
            <div className="navi-link">
              <div className="navi-icon mr-2">
                <i className="flaticon2-calendar-3 text-success" />
              </div>
              <div className="navi-text">
                <div className="font-weight-bold cursor-pointer">
                  My Profile
                </div>
                <div className="text-muted">
                  Account settings and more
                  {/* <span className="label label-light-danger label-inline font-weight-bold">
                    update
                  </span> */}
                </div>
              </div>
            </div>
          </Link>

          <div className="navi-separator mt-3"></div>

          <div className="navi-footer  px-8 py-5">
            <Link
              to="/logout"
              className="btn btn-light-primary font-weight-bold"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}