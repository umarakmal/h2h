import { useState, useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import Menu from "../Menu";
import { ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import { getCookie, signout } from "./auth/helpers";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import "react-datepicker/dist/react-datepicker.css";
function CustomToolbar({ setFilterButtonEl }) {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}
const url = `${process.env.REACT_APP_BACKEND_URL}`;
const Report = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getCookie('token'))
      signout(() => {
        navigate("/");
      })
  }, []);

  const columns = [
    {
      field: "caseid",
      headerName: "Case ID",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 60,
    },
    {
      field: "name",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Requester Name",
      width: 150,
    },
    {
      field: "empid",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Requester EmployeeID",
      width: 100,
    },
    {
      field: "process",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Process",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 80,
    },
    {
      field: "ah",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "AH",
      width: 70,
    },
    {
      field: "reportsto",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "ReportsTo",
      width: 100,
    },
    {
      field: "location",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Location",
      width: 100,
    },
    // {
    //     field: "contactno",
    //     headerClassName: "font-weight-bold small",
    //     cellClassName: "small ",
    //     headerName: "Contact No.",
    //     width: 140,
    // },
    {
      field: "communicatedname",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Communicated With",
      width: 140,
    },
    {
      field: "communicatedcontactno",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Communicated With Contact",
      width: 100,
    },

    {
      field: "issuetype",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Belongs To",
      width: 130,
    },
    {
      field: "issuesubtype",
      headerName: "Request Type",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 150,
    },
    {
      field: "requestdate",
      headerName: "Request Date",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 100,
    },
    {
      field: "concern",
      headerName: "Concern",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 250,
    },
    {
      field: "concernDate",
      headerName: "Concern Date",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 100,
    },
    {
      field: "payoutDays",
      headerName: "Payout Days",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 60,
    },
    {
      field: "payoutType",
      headerName: "Payout Type",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 100,
    },
    {
      field: "handlerL1remark",
      headerName: "Handler L1 Remark",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 150,
    },
    {
      field: "handlerL1RemarkDate",
      headerName: "Handler L1 Remark Date",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 100,
    },
    {
      field: "handlerL2Remark",
      headerName: "Handler L2 Remark",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 150,
    },
    {
      field: "handlerL2RemarkDate",
      headerName: "Handler L2 Remark Date",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 100,
    },
    {
      field: "referredDate",
      headerName: "Referred Date",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 100,
    },
    {
      field: "requesterFeedback",
      headerName: "Requester Feedback",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 80,
    },
    {
      field: "RequestersRemark",
      headerName: "Requester Remark",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 150,
    },
    {
      field: "handlerL1",
      headerName: "Handler L1",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 100,
    },
    {
      field: "HandlerL1Name",
      headerName: "Handler L1 Name",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 150,
    },
    {
      field: "handlerL2",
      headerName: "Handler L2",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 100,
    },
    {
      field: "HandlerL2Name",
      headerName: "Handler L2 Name",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 150,
    },
  ];
  const [getuserdata, setUserdata] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [show, setShow] = useState(false);

  const postData = async (e) => {
    e.preventDefault();

    if ($("#date1").val() === "") {
      $("#date1err").show();
    }
    if ($("#date1").val() !== "") {
      $("#date1err").hide();
    }
    if ($("#date2").val() === "") {
      $("#date2err").show();
    }
    if ($("#date2").val() !== "") {
      $("#date2err").hide();
    }
    if (!startDate || !endDate) {
      return false;
    } else {
      const date1 = startDate
      const date2 = endDate

      const res = await fetch(`${url}/api/get-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date1,
          date2,
        }),
      });
      {
        const data = await res.json();
        if (data.length > 0) {
          setUserdata(data);
        } else {
          setUserdata([])
        }
      }
      setShow(true);
    }
  };
  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("-");
  }
  // console.log(getuserdata);
  const rows = getuserdata.map((element, index) => ({
    id: index + 1,
    _id: element._id,
    caseid: element.caseId,
    empid: element.requestby,
    communicatedname: element.communicated_with,
    communicatedcontactno: element.mobile_no,
    issuetype: element.belongsTo,
    issuesubtype: element.issue,
    status: element.status,
    name: element.name,
    process: element.Process,
    location: element.location,
    reportsto: element.reportto,
    requesterStatus: element.requesterStatus,
    handlerL1: element.HandlerL1,
    HandlerL1Name: element.HandlerL1Name,
    handlerL2: element.HandlerL2,
    HandlerL2Name: element.HandlerL2Name,
    handlerL1remark: element.handlerL1Remark,
    payoutDays: element.payoutDays,
    payoutType: element.payoutType,
    handlerL1RemarkDate: element.handlerL1RemarkDate
      ? formatDate(new Date(element.handlerL1RemarkDate))
      : null,
    handlerL2Remark: element.handlerL2Remark,
    handlerL2RemarkDate: element.handlerL2RemarkDate
      ? formatDate(new Date(element.handlerL2RemarkDate))
      : null,
    concern: element.concern,
    concernDate: formatDate(new Date(element.concernDate)),
    RequestersRemark: element.RequestersRemark,
    referredDate: element.referredDate
      ? formatDate(new Date(element.referredDate))
      : null,
    requesterFeedback: element.RequestersFeedback,
    ah: element.AH,
    requestdate: formatDate(new Date(element.createdAt)),
  }));

  return (
    <>
      <Header />
      <Menu />
      <ToastContainer />
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header"></div>
        {/* /.content-header */}

        {/* Main content */}
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="card card-primary card-outline">
                  <div className="card-body">
                    <h5 style={{ fontSize: "1rem" }} className="card-title">
                      Report
                    </h5>
                    <br />
                    <hr />
                    <form>
                      <div className="row">
                        <div className="form-group">
                          {/* text input */}
                          <div className="col-sm-12">
                            <label style={{ fontSize: ".7rem" }}>From</label>
                            <div>
                              <DatePicker
                                selected={startDate}
                                selectsStart
                                className="form-control form-control-sm"
                                placeholderText="Select Date"
                                value={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="yyyy-MM-dd"
                                id="date1"
                                autoComplete="off"
                                required
                              />
                              <div
                                style={{ display: "none", color: "red" }}
                                id="date1err"
                                className="invalid-feedback"
                              >
                                Please choose a date.
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-sm-12">
                            <label
                              style={{ fontSize: ".7rem" }}
                              htmlFor="date2"
                            >
                              To:
                            </label>
                            {/* <input className="form-control form-control-sm"
                                                        /> */}
                            <div>
                              <DatePicker
                                selected={endDate}
                                dateFormat="yyyy-MM-dd"
                                className="form-control form-control-sm"
                                selectsEnd
                                placeholderText="Select Date"
                                minDate={startDate}
                                value={endDate}
                                onChange={(date) => setEndDate(date)}
                                id="date2"
                                autoComplete="off"
                                required
                              />
                              <div
                                style={{ display: "none", color: "red" }}
                                id="date2err"
                                className="invalid-feedback"
                              >
                                Please choose a date.
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="mt-1 col-sm-12">
                            <label
                              style={{ fontSize: ".7rem" }}
                              htmlFor="date2"
                            ></label>
                            <div>
                              <button
                                type="submit"
                                onClick={postData}
                                className="btn btn-primary btn-sm"
                                id="submit"
                              >
                                Get Data
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card mt-2">
                        {show ? (
                          <DataGrid
                            style={{ fontWeight: "400" }}
                            slots={{
                              toolbar: CustomToolbar,
                            }}
                            density="compact"
                            autoHeight
                            getRowId={(element) => element._id}
                            rows={rows}
                            columns={columns}
                            initialState={{
                              pagination: {
                                paginationModel: {
                                  pageSize: 8,
                                },
                              },
                            }}
                          />
                        ) : null}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Report;
