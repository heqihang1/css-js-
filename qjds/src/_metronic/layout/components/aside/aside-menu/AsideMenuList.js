/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { fetchRights } from "../../../../../redux/userRoleRightsSlice";
import { checkPermission } from "../../../../../app/utils/utils";
import { useHistory } from "react-router-dom";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
      "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };
  const {
    user: { role },
    rights,
  } = useSelector(
    (state) => ({ user: state.auth.user, rights: state.roleRights.rights }),
    shallowEqual
  );

  const [accessModules, setAccessModules] = React.useState([]);
  const history = useHistory();
  let dispatch = useDispatch();
  const getRole = async (role) => {
    dispatch(fetchRights(role));
  };

  useEffect(() => {
    if (role) {
      getRole(role);
    }
  }, [role]);

  useEffect(() => {
    if (rights) {
      setAccessModules(
        rights.map((module) => (module.can_read ? module.code : ""))
      );
    }
  }, [rights]);

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>

        {(accessModules.includes("USER") || accessModules.includes("ROLE")) && (
          <li className="menu-section ">
            <h4 className="menu-text">ADMIN</h4>
            <i className="menu-icon flaticon-more-v2"></i>
          </li>
        )}
        {accessModules.includes("USER") && (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/users",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/admin/users">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Group.svg")} />
              </span>
              <span className="menu-text">Users</span>
            </NavLink>
          </li>
        )}
        {accessModules.includes("ROLE") && (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/roles",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/admin/roles">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/General/Unlock.svg")} />
              </span>
              <span className="menu-text">Roles</span>
            </NavLink>
          </li>
        )}
        <li className="menu-section ">
          <h4 className="menu-text">SALES</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {accessModules.includes("CUSTOMER") && (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/customers",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/customers">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />
              </span>
              <span className="menu-text">Customer Profiles</span>
            </NavLink>
          </li>
        )}

        {accessModules.includes("QUOTATION") && (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/react-bootstrap",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/quotes">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Clipboard.svg")}
                />
              </span>
              <span className="menu-text">Quotation</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <ul className="menu-subnav">
                <ul className="menu-subnav">
                  <li
                    className="menu-item  menu-item-parent"
                    aria-haspopup="true"
                  >
                    <span className="menu-link">
                      <span className="menu-text">Quotation</span>
                    </span>
                  </li>

                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item ${getMenuItemActive("/quotes/all")}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/quotes/all">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">All</span>
                    </NavLink>
                  </li>
                  {/*end::2 Level*/}

                  {/*begin::2 Level*/}
                  {checkPermission("QUOTATION", "can_add") && (
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/quotes/new"
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink className="menu-link" to="/quotes/new">
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Create</span>
                      </NavLink>
                    </li>
                  )}
                  {/*end::2 Level*/}

                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/quotes/pending-approval"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink
                      className="menu-link"
                      to="/quotes/pending-approval"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Pending</span>
                    </NavLink>
                  </li>
                  {/*end::2 Level*/}

                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/quotes/special-pending"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink
                      className="menu-link"
                      to="/quotes/special-pending"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Special Pending</span>
                    </NavLink>
                  </li>

                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/quotes/rejects"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/quotes/rejects">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Rejected</span>
                    </NavLink>
                  </li>
                  {/*end::2 Level*/}

                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/quotes/client-reject"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/quotes/client-reject">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Client Rejected</span>
                    </NavLink>
                  </li>

                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/quotes/on-confirm"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/quotes/on-confirm">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">To be confirmed</span>
                    </NavLink>
                  </li>

                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/quotes/confirmed"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/quotes/confirmed">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Confirmed</span>
                    </NavLink>
                  </li>
                </ul>
              </ul>
            </div>
          </li>
        )}

        {accessModules.includes("CONTRACT") && (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/contracts",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/contracts">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Files/File.svg")}
                />
              </span>
              <span className="menu-text">Contracts</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <ul className="menu-subnav">
                <ul className="menu-subnav">
                  <li
                    className="menu-item  menu-item-parent"
                    aria-haspopup="true"
                  >
                    <span className="menu-link">
                      <span className="menu-text">contracts</span>
                    </span>
                  </li>

                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/contracts/all"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/contracts/all">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">All</span>
                    </NavLink>
                  </li>
                  {/*end::2 Level*/}

                  {/*begin::2 Level*/}
                  {checkPermission("CONTRACT", "can_add") && (
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/contracts/new"
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink className="menu-link" to="/contracts/new">
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Create</span>
                      </NavLink>
                    </li>
                  )}
                  {/*end::2 Level*/}

                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/contracts/pending-approval"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink
                      className="menu-link"
                      to="/contracts/pending-approval"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Pending</span>
                    </NavLink>
                  </li>
                  {/*end::2 Level*/}

                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/contracts/special-pending"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink
                      className="menu-link"
                      to="/contracts/special-pending"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Special Pending</span>
                    </NavLink>
                  </li>

                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/contracts/rejects"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/contracts/rejects">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Rejected</span>
                    </NavLink>
                  </li>
                  {/*end::2 Level*/}

                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/contracts/client-reject"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink
                      className="menu-link"
                      to="/contracts/client-reject"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Client Rejected</span>
                    </NavLink>
                  </li>

                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/contracts/on-confirm"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/contracts/on-confirm">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">To be confirmed</span>
                    </NavLink>
                  </li>

                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/contracts/confirmed"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/contracts/confirmed">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Confirmed</span>
                    </NavLink>
                  </li>

                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/contracts/terminated"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/contracts/terminated">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Terminated</span>
                    </NavLink>
                  </li>
                </ul>
              </ul>
            </div>
          </li>
        )}

        {(accessModules.includes("JOB") ||
          accessModules.includes("CREATE_JOB_REMINDER") ||
          accessModules.includes("WAITING_ARRANGEMENT_JOB_CALENDER")) && (
            <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                "/jobs",
                true
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink className="menu-link menu-toggle" to="/jobs">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Tools/Tools.svg")}
                  />
                </span>
                <span className="menu-text">Jobs</span>
                <i className="menu-arrow" />
              </NavLink>
              <div className="menu-submenu ">
                <ul className="menu-subnav">
                  <ul className="menu-subnav">
                    <li
                      className="menu-item  menu-item-parent"
                      aria-haspopup="true"
                    >
                      <span className="menu-link">
                        <span className="menu-text">Jobs</span>
                      </span>
                    </li>

                    {accessModules.includes("JOB") && (
                      <>
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/jobs/all"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink className="menu-link" to="/jobs/all">
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">All</span>
                          </NavLink>
                        </li>
                        {/*end::2 Level*/}
                        {/*begin::2 Level*/}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/jobs/pending"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink className="menu-link" to="/jobs/pending">
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Pending</span>
                          </NavLink>
                        </li>

                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/jobs/rejected"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink className="menu-link" to="/jobs/rejected">
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Rejected</span>
                          </NavLink>
                        </li>

                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/jobs/cancelled"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink className="menu-link" to="/jobs/cancelled">
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Cancelled</span>
                          </NavLink>
                        </li>

                        {/*end::2 Level*/}

                        {/*begin::2 Level*/}
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/jobs/waiting-arragement"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink
                            className="menu-link"
                            to="/jobs/waiting-arragement"
                          >
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Waiting Arrangement</span>
                          </NavLink>
                        </li>
                        {/*end::2 Level*/}
                      </>
                    )}
                    {accessModules.includes("WAITING_ARRANGEMENT_JOB_CALENDER") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/jobs/assign"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/jobs/assign">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">
                            Waiting Arrangement (Calender)
                          </span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("WAITING_ARRANGEMENT_JOB_CALENDER") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/jobs/team"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/jobs/team">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">
                            Team Calendar
                          </span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("JOB") && (
                      <>
                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/jobs/arraged-job"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink className="menu-link" to="/jobs/arraged-job">
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Arranged Job</span>
                          </NavLink>
                        </li>

                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/jobs/finished"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink className="menu-link" to="/jobs/finished">
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Finished</span>
                          </NavLink>
                        </li>

                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/quotes/job"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink className="menu-link" to="/quotes/job">
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Quotation</span>
                          </NavLink>
                        </li>

                        <li
                          className={`menu-item ${getMenuItemActive(
                            "/contracts/job"
                          )}`}
                          aria-haspopup="true"
                        >
                          <NavLink className="menu-link" to="/contracts/job">
                            <i className="menu-bullet menu-bullet-dot">
                              <span />
                            </i>
                            <span className="menu-text">Contract</span>
                          </NavLink>
                        </li>
                      </>
                    )}
                    {/*begin::2 Level*/}

                    {accessModules.includes("CREATE_JOB_REMINDER") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/jobs/create-job-reminder"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/jobs/create-job-reminder"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Create Job Reminder</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </ul>
              </div>
            </li>
          )}

        {accessModules.includes("INVOICE") && (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/invoices",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/invoices">
              <span className="svg-icon menu-icon">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Shopping/Dollar.svg")}
                />
              </span>
              <span className="menu-text">Invoices</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <ul className="menu-subnav">
                <ul className="menu-subnav">
                  <li
                    className="menu-item  menu-item-parent"
                    aria-haspopup="true"
                  >
                    <span className="menu-link">
                      <span className="menu-text">Invoices</span>
                    </span>
                  </li>

                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/invoices/all"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/invoices/all">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">All</span>
                    </NavLink>
                  </li>
                  {/*end::2 Level*/}

                  {/*begin::2 Level*/}
                  {checkPermission("INVOICED", "can_add") && (
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/invoices/new"
                      )}`}
                      aria-haspopup="true"
                    >
                      <NavLink className="menu-link" to="/invoices/new">
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Create</span>
                      </NavLink>
                    </li>
                  )}
                  {/*end::2 Level*/}

                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/invoices/pending-approval"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink
                      className="menu-link"
                      to="/invoices/pending-approval"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Pending</span>
                    </NavLink>
                  </li>
                  {/*end::2 Level*/}

                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/invoices/rejects"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/invoices/rejects">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Rejected</span>
                    </NavLink>
                  </li>
                  {/*end::2 Level*/}

                  {/*begin::2 Level*/}
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/invoices/payments-pending"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink
                      className="menu-link"
                      to="/invoices/payments-pending"
                    >
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Payments Pending</span>
                    </NavLink>
                  </li>
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/invoices/paid-list"
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/invoices/paid-list">
                      <i className="menu-bullet menu-bullet-dot">
                        <span />
                      </i>
                      <span className="menu-text">Paid</span>
                    </NavLink>
                  </li>
                </ul>
              </ul>
            </div>
          </li>
        )}

        {(accessModules.includes("PAYMENT_ITEM") ||
          accessModules.includes("DISTRICTS") ||
          accessModules.includes("COMMERCIAL_SECTOR") ||
          accessModules.includes("REJECT_REASON") ||
          accessModules.includes("TERMINATION_REASON") ||
          accessModules.includes("QUESTION") ||
          accessModules.includes("REMARK") ||
          accessModules.includes("SERVICE_ITEM") ||
          accessModules.includes("TERMS_AND_CONDITION") ||
          accessModules.includes("TEAMS")) && (
            <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                "/sets",
                true
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink className="menu-link menu-toggle" to="/sets">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Settings-2.svg")}
                  />
                </span>
                <span className="menu-text">Setting</span>
                <i className="menu-arrow" />
              </NavLink>
              <div className="menu-submenu ">
                <ul className="menu-subnav">
                  <ul className="menu-subnav">
                    <li
                      className="menu-item  menu-item-parent"
                      aria-haspopup="true"
                    >
                      <span className="menu-link">
                        <span className="menu-text">Setting</span>
                      </span>
                    </li>

                    {/*begin::2 Level*/}
                    {accessModules.includes("PAYMENT_ITEM") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/sets/payment-item"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/sets/payment-item">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Payment Item</span>
                        </NavLink>
                      </li>
                    )}
                    {/*end::2 Level*/}

                    {/*begin::2 Level*/}
                    {accessModules.includes("REMARK") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/sets/remarks"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/sets/remarks">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Remarks</span>
                        </NavLink>
                      </li>
                    )}
                    {/*end::2 Level*/}

                    {/*begin::2 Level*/}
                    {accessModules.includes("SERVICE_ITEM") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/sets/service-item"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/sets/service-item">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Services Item</span>
                        </NavLink>
                      </li>
                    )}
                    {/*end::2 Level*/}

                    {/*begin::2 Level*/}
                    {accessModules.includes("TERMS_AND_CONDITION") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/sets/terms-and-conditions"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/sets/terms-and-conditions"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Terms & Conditions</span>
                        </NavLink>
                      </li>
                    )}

                    {/*begin::2 Level*/}
                    {accessModules.includes("TEAMS") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/sets/teams"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/sets/teams">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Teams</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("DISTRICTS") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/sets/districts"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/sets/districts">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">District</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("COMMERCIAL_SECTOR") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/sets/commercial-sector"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/sets/commercial-sector"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Commercial Sector</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("REJECT_REASON") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/sets/reject-reason"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/sets/reject-reason">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Reject Reason</span>
                        </NavLink>
                      </li>
                    )}
                    {accessModules.includes("TERMINATION_REASON") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/sets/termination-reason"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/sets/termination-reason"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Termination Reason</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("QUESTION") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/sets/question"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/sets/question"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Question</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </ul>
              </div>
            </li>
          )}

        {(accessModules.includes("CONTRACT_INVOICE_REPORT") ||
          accessModules.includes("NEW_CUSTOMER_REPORT") ||
          accessModules.includes("PENDING_INVOICE_REPORT") ||
          accessModules.includes("SALES_BUSINESS_REPORT") ||
          accessModules.includes("ITEMS_SALES_STAT_REPORT") ||
          accessModules.includes("COMMING_END_REPORT") ||
          accessModules.includes("OVERDUE_AMOUNT_REPORT") ||
          accessModules.includes("FUTURE_JOB_ORDER_REPORT") ||
          accessModules.includes("SALES_PERFORMANCE_REPORT") ||
          accessModules.includes("CLIENT_REJECTED") ||
          accessModules.includes("TERMINATED_CONTRACT") ||
          accessModules.includes("UPLOAD_DOCUMENT_REPORT") ||
          accessModules.includes("SERVICE_ITEM_REPORT") ||
          accessModules.includes("UNFINISHED_JOB_REPORT") ||
          accessModules.includes("CUSTOMER_REFERRALS") ||
          accessModules.includes("BUSINESS_SOURCE_REPORT") ||
          accessModules.includes("QUOTATION_INVOICE_REPORT")) && (
            <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                "/reports",
                true
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
            >
              <NavLink className="menu-link menu-toggle" to="/reports">
                <span className="svg-icon menu-icon">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Shopping/Chart-bar1.svg")}
                  />
                </span>
                <span className="menu-text">Report</span>
                <i className="menu-arrow" />
              </NavLink>
              <div className="menu-submenu ">
                <ul className="menu-subnav">
                  <ul className="menu-subnav">
                    <li
                      className="menu-item  menu-item-parent"
                      aria-haspopup="true"
                    >
                      <span className="menu-link">
                        <span className="menu-text">Report</span>
                      </span>
                    </li>

                    {/*begin::2 Level*/}
                    {accessModules.includes("CONTRACT_INVOICE_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/contract-invoice"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/contract-invoice"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Contract Invoice</span>
                        </NavLink>
                      </li>
                    )}
                    {/*end::2 Level*/}

                    {/*begin::2 Level*/}
                    {accessModules.includes("QUOTATION_INVOICE_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/quotation-invoice"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/quotation-invoice"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Quotation Invoice</span>
                        </NavLink>
                      </li>
                    )}
                    {/*end::2 Level*/}

                    {accessModules.includes("PENDING_INVOICE_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/pending-invoice"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/pending-invoice"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Pending Invoice</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("NEW_CUSTOMER_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/new-customer"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/reports/new-customer">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">New Customer</span>
                        </NavLink>
                      </li>
                    )}
                    {accessModules.includes("SALES_BUSINESS_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/sales-business"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/sales-business"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Sales Business</span>
                        </NavLink>
                      </li>
                    )}
                    {accessModules.includes("ITEMS_SALES_STAT_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/items-sales-stat"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/items-sales-stat"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Items Sales Stat</span>
                        </NavLink>
                      </li>
                    )}
                    {accessModules.includes("COMMING_END_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/contract-end"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink className="menu-link" to="/reports/contract-end">
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Coming End Contract</span>
                        </NavLink>
                      </li>
                    )}
                    {accessModules.includes("OVERDUE_AMOUNT_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/overdue-amount"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/overdue-amount"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Overdue Amount</span>
                        </NavLink>
                      </li>
                    )}
                    {accessModules.includes("FUTURE_JOB_ORDER_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/future-job-order"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/future-job-order"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Future Job Order</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("SALES_PERFORMANCE_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/sales-performance"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/sales-performance"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Sales Performance</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("CLIENT_REJECTED") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/client-rejected"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/client-rejected"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Client Rejected</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("TERMINATED_CONTRACT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/terminated-contract"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/terminated-contract"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Terminated Contract</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("CUSTOMER_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/customer-report"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/customer-report"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Customer</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("UPLOAD_DOCUMENT_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/upload-document-report"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/upload-document-report"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Upload Document</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("SERVICE_ITEM_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/service-item-report"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/service-item-report"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Service Item</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("UNFINISHED_JOB_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/unfinished-job-report"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/unfinished-job-report"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Unfinished Job</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("CUSTOMER_REFERRALS") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/customer-referrals-report"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/customer-referrals-report"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Customer Referrals</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("BUSINESS_SOURCE_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/business-source-report"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/business-source-report"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Business Source</span>
                        </NavLink>
                      </li>
                    )}

                    {accessModules.includes("SALES_INVOICE_REPORT") && (
                      <li
                        className={`menu-item ${getMenuItemActive(
                          "/reports/sales-invoice-report"
                        )}`}
                        aria-haspopup="true"
                      >
                        <NavLink
                          className="menu-link"
                          to="/reports/sales-invoice-report"
                        >
                          <i className="menu-bullet menu-bullet-dot">
                            <span />
                          </i>
                          <span className="menu-text">Sales Invoice</span>
                        </NavLink>
                      </li>
                    )}

                  </ul>
                </ul>
              </div>
            </li>
          )}

        {/*end::1 Level*/}

        {/* Applications */}
        {/* begin::section */}
        {/* <li className="menu-section ">
          <h4 className="menu-text">Applications</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li> */}
        {/* end:: section */}

        {/* <li
          className={`menu-item ${getMenuItemActive("/user-profile", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/user-profile">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Communication/Add-user.svg"
                )}
              />
            </span>
            <span className="menu-text">User Profile</span>
          </NavLink>
        </li> */}
        {/*end::1 Level*/}

        {/* Custom */}
        {/* begin::section */}
        {/* <li className="menu-section ">
          <h4 className="menu-text">Custom</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li> */}
        {/* end:: section */}

        {/* Error Pages */}
        {/*begin::1 Level*/}

        {/*end::1 Level*/}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
