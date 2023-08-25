import React from "react";
import logo from "./images/logo_new.png";
import { Link, useLocation } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import "./css/Responsive.css";
import { isAuth } from "./component/auth/helpers";
const Menu = () => {
  const location = useLocation();
  return (
    <>
      <aside
        // style={{ fontSize: "12px" }}
        className="main-sidebar sidebar-dark-primary elevation-4"
      >
        <Link to="#" className="brand-link" style={{ backgroundColor: 'whitesmoke' }}>
          <img
            src={logo}
            alt="Logo"

            className="brand-image"
            style={{ opacity: "5", maxHeight: "43px", marginLeft: '4.1rem' }}
          />
        </Link>
        <div className="sidebar">
          <nav className="mt-4">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item  mb-2 ">
                <Link
                  to="/request-form"
                  className={`nav-link ${location.pathname === "/request-form" ? "active" : ""
                    }`}
                >
                  <i
                    className="nav-icon far fa-file"
                    style={{
                      color: "white",
                      fontSize: "12px",
                      marginRight: "20px",
                    }}
                  />
                  <p style={{ color: "white", fontSize: "12px" }}>
                    Requester's Form
                  </p>
                </Link>
              </li>
              <li className="nav-item  mb-2 ">
                <Link
                  to="/request-status"
                  className={`nav-link ${location.pathname === "/request-status" ? "active" : ""
                    }`}
                >
                  <i
                    className="nav-icon fas fa-tachometer-alt"
                    style={{
                      color: "white",
                      fontSize: "12px",
                      marginRight: "20px",
                    }}
                  />
                  <p style={{ color: "white", fontSize: "12px" }}>
                    Requester's Status
                  </p>
                </Link>
              </li>
              {isAuth().flagHandlerL1 === 1 ? <>
                <li className="nav-item mb-2">
                  <Link
                    to="/handlers-form"
                    className={`nav-link ${location.pathname === "/handlers-form" ||
                      location.pathname === "/handlers-form"
                      ? "active"
                      : ""
                      }`}
                  >
                    <i
                      style={{
                        color: "white",
                        fontSize: "12px",
                        marginRight: "20px",
                      }}
                      className="nav-icon fas fa-list "
                    ></i>
                    <p style={{ color: "white", fontSize: "12px" }}>Handler L1</p>
                  </Link>
                </li>
              </> : null}
              {isAuth().flagHandlerL2 === 1 ? <>
                <li className="nav-item mb-2">
                  <Link
                    to="/handlers-form-l2"
                    className={`nav-link ${location.pathname === "/handlers-form-l2" ||
                      location.pathname === "/handlers-form-l2"
                      ? "active"
                      : ""
                      }`}
                  >
                    <i
                      style={{
                        color: "white",
                        fontSize: "12px",
                        marginRight: "20px",
                      }}
                      className="nav-icon fas fa-list "
                    ></i>
                    <p style={{ color: "white", fontSize: "12px" }}>Handler L2</p>
                  </Link>
                </li>
              </> : null}
              {isAuth().flagHandlerL2 === 1 || isAuth().flagHandlerL1 === 1 ? <>
                <li className="nav-item mb-2">
                  <Link
                    to="/dashboard"
                    className={`nav-link ${location.pathname === "/dashboard" ||
                      location.pathname === "/dashboard"
                      ? "active"
                      : ""
                      }`}
                  >
                    <i
                      style={{
                        color: "white",
                        fontSize: "12px",
                        marginRight: "20px",
                      }}
                      className="nav-icon fas fa-user"
                    ></i>
                    <p style={{ color: "white", fontSize: "12px" }}>Dashboard</p>
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link
                    to="/get-report"
                    className={`nav-link ${location.pathname === "/get-report" ||
                      location.pathname === "/get-report"
                      ? "active"
                      : ""
                      }`}
                  >
                    <i
                      style={{
                        color: "white",
                        fontSize: "12px",
                        marginRight: "20px",
                      }}
                      className="nav-icon fas fa-file-alt"
                    ></i>
                    <p style={{ color: "white", fontSize: "12px" }}>Report</p>
                  </Link>
                </li>
              </> : null}

              {isAuth().flagAdmin === 1 ? <>
                <Dropdown
                  style={{ marginLeft: "2px" }}
                  className={`mb-3 nav-item ${location.pathname.includes("/master/") ? "active" : ""
                    }`}
                >
                  <Dropdown.Toggle
                    style={{ color: "white", fontSize: "14px" }}
                    id="dropdown-button-dark-example1"
                    to="#"
                    variant="dark"
                  >
                    <i
                      className="nav-icon fas fa-poll"
                      style={{
                        color: "white",
                        fontSize: "11px",
                        marginRight: "20px",
                      }}
                    />{" "}
                    <b style={{ color: "white", fontSize: "12px" }}>Master </b>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    variant="dark"
                    style={{ background: "#212529", margin: "0" }}
                  >
                    <ul className="nav abc">
                      <li className="nav-item ">
                        <Link
                          to="/master/issue-master"
                          className={`nav-link ${location.pathname === "/master/issue-master" ||
                            location.pathname === "/master/issue-master"
                            ? "active"
                            : ""
                            }`}
                        >
                          <i
                            style={{
                              color: "white",
                              fontSize: "12px",
                              marginRight: "20px",
                            }}
                            className="nav-icon fas fa-list "
                          ></i>
                          <p style={{ color: "white", fontSize: "12px" }}>
                            Belongs To Master
                          </p>
                        </Link>
                      </li>
                    </ul>
                    <ul className="nav abc">
                      <li className="nav-item ">
                        <Link
                          to="/master/sub-issue-master"
                          className={`nav-link ${location.pathname === "/master/sub-issue-master" ||
                            location.pathname === "/master/sub-issue-master"
                            ? "active"
                            : ""
                            }`}
                        >
                          <i
                            style={{
                              color: "white",
                              fontSize: "12px",
                              marginRight: "20px",
                            }}
                            className="nav-icon fas fa-list "
                          ></i>
                          <p style={{ color: "white", fontSize: "12px" }}>
                            Request Type Master
                          </p>
                        </Link>
                      </li>
                    </ul>
                    <ul className="nav abc">
                      <li className="nav-item ">
                        <Link
                          to="/master/handler-master"
                          className={`nav-link ${location.pathname === "/master/handler-master" ||
                            location.pathname === "/master/handler-master"
                            ? "active"
                            : ""
                            }`}
                        >
                          <i
                            style={{
                              color: "white",
                              fontSize: "12px",
                              marginRight: "20px",
                            }}
                            className="nav-icon fas fa-list "
                          ></i>
                          <p style={{ color: "white", fontSize: "12px" }}>
                            Handler Master
                          </p>
                        </Link>
                      </li>
                    </ul>
                    <ul className="nav abc">
                      <li className="nav-item ">
                        <Link
                          to="/master/process-handler-mapping"
                          className={`nav-link ${location.pathname ===
                            "/master/process-handler-mapping" ||
                            location.pathname ===
                            "/master/process-handler-mapping"
                            ? "active"
                            : ""
                            }`}
                        >
                          <i
                            style={{
                              color: "white",
                              fontSize: "12px",
                              marginRight: "20px",
                            }}
                            className="nav-icon fas fa-list "
                          ></i>
                          <p style={{ color: "white", fontSize: "12px" }}>
                            Process Handler Mapping
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </Dropdown.Menu>
                </Dropdown>
              </> : null}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Menu;
