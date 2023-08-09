import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import Header from "../Header";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import { isAuth, getCookie, signout } from "./auth/helpers";
import { ToastContainer, toast } from "react-toastify";
import Menu from "../Menu";
function CustomToolbar({ setFilterButtonEl }) {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}
const url = `${process.env.REACT_APP_BACKEND_URL}`;
const Dashboard = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [datasProcess, setDataProcess] = useState([]);
  const [dataLocation, setDataLocation] = useState([]);
  const [dataHandler, setDataHandler] = useState([]);
  const [datasTotal, setDataTotal] = useState([]);
  const [dataHandlerSatisfied, setDataHandlerSatisfied] = useState([]);
  const [dataHandlerSatisfiedLocation, setDataHandlerSatisfiedLocation] =
    useState([]);
  const [dataHandlerSatisfiedProcess, setDataHandlerSatisfiedProcess] =
    useState([]);

  useEffect(() => {
    if (!getCookie('token'))
      signout(() => {
        navigate("/");
      })
  }, []);

  const columnsTotalAssigned = [
    {
      field: "assigned",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Assigned",
      width: 120,
    },
    {
      field: "pending",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Pending",
      width: 120,
    },
    {
      field: "inprogress",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "In Progress",
      width: 120,
    },
    {
      field: "resolved",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Resolved",
      width: 120,
    },
    {
      field: "closed",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Closed",
      width: 120,
    },
  ];
  const columnsHandler = [
    {
      field: "handler",
      headerName: "Handler L1",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 120,
      renderCell: (row) => (
        <td>{row.row.handler !== "" ? row.row.handler : "Not Assigned"}</td>
      ),
    },
    {
      field: "assigned",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Assigned",
      width: 70,
    },
    {
      field: "pending",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Pending",
      width: 70,
    },
    {
      field: "inprogress",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "In Progress",
      width: 90,
    },
    {
      field: "resolved",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Resolved",
      width: 70,
    },
    {
      field: "closed",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Closed",
      width: 60,
    },
  ];
  const columnsLocation = [
    {
      field: "location",
      headerName: "Location",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 80,
    },
    {
      field: "assigned",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Assigned",
      width: 70,
    },
    {
      field: "pending",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Pending",
      width: 70,
    },
    {
      field: "inprogress",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "In Progress",
      width: 90,
    },
    {
      field: "resolved",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Resolved",
      width: 70,
    },
    {
      field: "closed",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Closed",
      width: 60,
    },
  ];
  const columnsProcess = [
    {
      field: "process",
      headerName: "Process",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 120,
    },
    {
      field: "assigned",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Assigned",
      width: 70,
    },
    {
      field: "pending",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Pending",
      width: 70,
    },
    {
      field: "inprogress",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "In Progress",
      width: 90,
    },
    {
      field: "resolved",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Resolved",
      width: 70,
    },
    {
      field: "closed",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Closed",
      width: 60,
    },
  ];

  const columnsHandlerSatisfied = [
    {
      field: "handler",
      headerName: "Handler",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 150,
      renderCell: (row) => (
        <td>{row.row.handler !== "" ? row.row.handler : "Not Assigned"}</td>
      ),
    },
    {
      field: "satisfied",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Satisfied",
    },
    {
      field: "notSatisfied",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Not Satisfied",
    },
  ];
  const columnsHandlerSatisfiedLocation = [
    {
      field: "handler",
      headerName: "Handler",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      renderCell: (row) => (
        <td>{row.row.handler !== "" ? row.row.handler : "Not Assigned"}</td>
      ),
    },
    {
      field: "location",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Location",
    },
    {
      field: "satisfied",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Satisfied",
    },
    {
      field: "notSatisfied",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Not Satisfied",
    },
  ];
  const columnsHandlerSatisfiedProcess = [
    {
      field: "handler",
      headerName: "Handler",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      renderCell: (row) => (
        <td>{row.row.handler !== "" ? row.row.handler : "Not Assigned"}</td>
      ),
    },
    {
      field: "process",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Process",
    },
    {
      field: "satisfied",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Satisfied",
    },
    {
      field: "notSatisfied",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Not Satisfied",
    },
  ];

  let inprogProcess;
  let pendingProcess;
  let inprogLocation;
  let pendingLocation;
  let inprogHandler;
  let pendingHandler;
  let inprogTotal;
  let pendingTotal;
  const rowsProcess = datasProcess
    ? datasProcess.map((element, index) => ({
      id: index + 1,
      _id: element._id,
      abc: (inprogProcess = element.inprogressL1 + element.inprogressL2),
      inprogress: inprogProcess,
      bcd: (pendingProcess =
        element.pending + element.refer_count + element.reopen_count),
      pending: pendingProcess,
      process: element.process,
      assigned: element.totalAssigned,
      resolved: element.resolved_count,
      closed: element.close,
      status: element.status,
    }))
    : null;

  const rowsTotalAssigned = datasTotal
    ? datasTotal.map((element, index) => ({
      id: index + 1,
      _id: element._id,
      abc: (inprogTotal = element.inprogressL1 + element.inprogressL2),
      inprogress: inprogTotal,
      bcd: (pendingTotal =
        parseInt(element.pending) +
        parseInt(element.refer_count) +
        parseInt(element.reopen_count)),
      pending: parseInt(pendingTotal),
      process: element.process,
      assigned: element.totalAssigned,
      resolved: element.resolved_count,
      closed: element.close,
      status: element.status,
    }))
    : null;

  const rowsLocation = dataLocation
    ? dataLocation.map((element, index) => ({
      id: index + 1,
      _id: element._id,
      abc: (inprogLocation = element.inprogressL1 + element.inprogressL2),
      inprogress: inprogLocation,
      bcd: (pendingLocation =
        element.pending + element.refer_count + element.reopen_count),
      pending: pendingLocation,
      location: element.location,
      assigned: element.totalAssigned,
      resolved: element.resolved_count,
      closed: element.close,
      status: element.status,
    }))
    : null;

  const rowsHandler = dataHandler
    ? dataHandler.map((element, index) => ({
      id: index + 1,
      _id: element._id,
      abc: (inprogHandler = element.inprogressL1),
      inprogress: inprogHandler,
      bcd: (pendingHandler = element.pending + element.reopen_count),
      pending: pendingHandler,
      handler: element.handlername,
      assigned: element.totalAssigned,
      resolved: element.resolved_count,
      closed: element.close,
      status: element.status,
    }))
    : null;

  const rowsHandlerSatisfied = dataHandlerSatisfied
    ? dataHandlerSatisfied.map((element, index) => ({
      id: index + 1,
      _id: element._id,
      handler: element.handlername,
      satisfied: element.satisfiedcount,
      notSatisfied: element.notsatisfiedcount,
    }))
    : null;

  const rowsHandlerSatisfiedLocation = dataHandlerSatisfiedLocation
    ? dataHandlerSatisfiedLocation.map((element, index) => ({
      id: index + 1,
      _id: element._id,
      handler: element.handlername,
      location: element.location,
      satisfied: element.satisfiedcount,
      notSatisfied: element.notsatisfiedcount,
    }))
    : null;

  const rowsHandlerSatisfiedProcess = dataHandlerSatisfiedProcess
    ? dataHandlerSatisfiedProcess.map((element, index) => ({
      id: index + 1,
      _id: element._id,
      handler: element.handlername,
      process: element.process,
      satisfied: element.satisfiedcount,
      notSatisfied: element.notsatisfiedcount,
    }))
    : null;
  //
  const getDashProcessCount = async () => {
    try {
      const response = await fetch(`${url}/api/dash-process-count`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Error Occured");
      }

      const data = await response.json();
      if (response.status === 200) {
        if (data.length > 0) {
          setDataProcess(data);
        }
      }
    } catch (error) { }
  };
  const getDashTotalCount = async () => {
    try {
      const response = await fetch(`${url}/api/dashboard-total-count`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Error Occured");
      }

      const data = await response.json();
      if (response.status === 200) {
        if (data.length > 0) {
          setDataTotal(data);
        }
      }
    } catch (error) { }
  };
  const getDashLocationCount = async () => {
    try {
      const response = await fetch(`${url}/api/dash-location-count`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Error Occured");
      }

      const data = await response.json();
      if (response.status === 200) {
        if (data.length > 0) {
          setDataLocation(data);
        }
      }
    } catch (error) { }
  };
  const getDashHandlerCount = async () => {
    try {
      const response = await fetch(`${url}/api/dash-handler-l1-count`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Error Occured");
      }

      const data = await response.json();
      if (response.status === 200) {
        if (data.length > 0) {
          setDataHandler(data);
        }
      }
    } catch (error) { }
  };
  const getDashHandlerSatisfiedCount = async () => {
    try {
      const response = await fetch(
        `${url}/api/dash-handler-l1-satisfied-count`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error("Error Occured");
      }

      const data = await response.json();
      if (response.status === 200) {
        if (data.length > 0) {
          setDataHandlerSatisfied(data);
        }
      }
    } catch (error) { }
  };
  const getDashHandlerSatisfiedLocationCount = async () => {
    try {
      const response = await fetch(
        `${url}/api/dash-handler-l1-satisfied-location-count`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error("Error Occured");
      }

      const data = await response.json();
      if (response.status === 200) {
        if (data.length > 0) {
          setDataHandlerSatisfiedLocation(data);
        }
      }
    } catch (error) { }
  };
  const getDashHandlerSatisfiedProcessCount = async () => {
    try {
      const response = await fetch(
        `${url}/api/dash-handler-l1-satisfied-process-count`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error("Error Occured");
      }

      const data = await response.json();
      if (response.status === 200) {
        if (data.length > 0) {
          setDataHandlerSatisfiedProcess(data);
        }
      }
    } catch (error) { }
  };
  useEffect(() => {
    getDashProcessCount();
    getDashHandlerCount();
    getDashLocationCount();
    getDashHandlerSatisfiedCount();
    getDashHandlerSatisfiedLocationCount();
    getDashHandlerSatisfiedProcessCount();
    getDashTotalCount();
  }, []);

  const handleCalendar = async (e) => {
    setStartDate(e.target.value)

    // setIsLoading(true);

    if (e.target.name === "Aggregation") {
      let date = e.target.value
      try {
        const response = await fetch(`${url}/api/dashboard-total-count`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ date })
        });

        if (!response.ok) {
          toast.error("Error Occured")
        }
        const data = await response.json();
        if (response.status === 200) {
          // setIsLoading(false);
          if (data.length > 0) {
            setDataTotal(data)

          } else {
            setDataTotal([])
          }
        }
      } catch (error) {

      }

    } else if (e.target.name === "HandlervsAllocation") {
      try {
        let date = e.target.value
        const response = await fetch(`${url}/api/dash-handler-l1-count`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ date })
        });

        if (!response.ok) {
          toast.error("Error Occured")
        }

        const data = await response.json();
        if (response.status === 200) {
          if (data.length > 0) {
            setDataHandler(data)
          } else {
            setDataHandler([])
          }
        }
      } catch (error) {

      }
    }
    else if (e.target.name === "HandlervsFeedback") {
      let date = e.target.value
      try {
        const response = await fetch(
          `${url}/api/dash-handler-l1-satisfied-count`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            }, body: JSON.stringify({ date })
          }
        );

        if (!response.ok) {
          toast.error("Error Occured");
        }

        const data = await response.json();
        if (response.status === 200) {
          if (data.length > 0) {
            setDataHandlerSatisfied(data);
          } else {
            setDataHandlerSatisfied([]);
          }
        }
      } catch (error) { }
    }
    else if (e.target.name === "ProcessvsAllocation") {
      let date = e.target.value
      try {
        const response = await fetch(`${url}/api/dash-process-count`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }, body: JSON.stringify({ date })
        });

        if (!response.ok) {
          toast.error("Error Occured");
        }

        const data = await response.json();
        if (response.status === 200) {
          if (data.length > 0) {
            setDataProcess(data);
          } else {
            setDataProcess([])
          }
        }
      } catch (error) { }
    }
    else if (e.target.name === "LocationvsAllocation") {
      let date = e.target.value
      try {
        const response = await fetch(`${url}/api/dash-location-count`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }, body: JSON.stringify({ date })
        });
        if (!response.ok) {
          toast.error("Error Occured");
        }
        const data = await response.json();
        if (response.status === 200) {
          if (data.length > 0) {
            setDataLocation(data);
          } else {
            setDataLocation([])
          }
        }
      } catch (error) { }
    }
    else if (e.target.name === "HandlervsLocationvsFeedback") {
      let date = e.target.value
      try {
        const response = await fetch(
          `${url}/api/dash-handler-l1-satisfied-location-count`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            }, body: JSON.stringify({ date })
          }
        );

        if (!response.ok) {
          toast.error("Error Occured");
        }

        const data = await response.json();
        if (response.status === 200) {
          if (data.length > 0) {
            setDataHandlerSatisfiedLocation(data);
          } else {
            setDataHandlerSatisfiedLocation([])
          }
        }
      } catch (error) { }
    }
    else if (e.target.name === "HandlervsProcessvsFeedback") {
      let date = e.target.value
      try {
        const response = await fetch(
          `${url}/api/dash-handler-l1-satisfied-process-count`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            }, body: JSON.stringify({ date })
          }
        );

        if (!response.ok) {
          toast.error("Error Occured");
        }

        const data = await response.json();
        if (response.status === 200) {
          if (data.length > 0) {
            setDataHandlerSatisfiedProcess(data);
          } else {
            setDataHandlerSatisfiedProcess([])
          }
        }
      } catch (error) { }
    }

  }
  const [maxMonth, setMaxMonth] = useState(
    new Date().toISOString().split("-").slice(0, 2).join("-")
  );

  const currentDate = new Date();
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const formattedLastDay = lastDayOfMonth.toISOString().slice(0, 10); // Convert to YYYY-MM-DD format

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
              <div className="col-md-12">
                <div className="card card-primary card-outline">
                  <div className="card-body">
                    {/* <h5 className="card-title">According To Location</h5> */}
                    <form>

                      <div className="card mt-2">

                        <div className='row col-md-12'>
                          <h5 className="col-md-6 card-title mb-2">Aggregation</h5>
                          <div className=" col-md-3">
                            {/* <div className="col-md-12"> */}
                            <label style={{ fontSize: ".7rem" }}>
                              Change Month
                            </label>
                          </div>
                          <div className=" col">
                            <input
                              style={{ fontSize: ".8rem" }}
                              type="date"
                              name="Aggregation"
                              max={formattedLastDay}
                              onChange={handleCalendar}
                              className="form-control form-control-sm form-control-border"
                            />
                          </div>
                        </div>
                        <DataGrid
                          style={{ fontWeight: "400" }}
                          density="compact"
                          autoHeight
                          experimentalFeatures={{ columnGrouping: true }}
                          getRowId={(element) => element._id}
                          rows={rowsTotalAssigned}
                          disableRowSelectionOnClick
                          columns={columnsTotalAssigned}
                          initialState={{
                            pagination: {
                              paginationModel: {
                                pageSize: 5,
                              },
                            },
                          }}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                {/* /.card */}
              </div>
              <div className="col-md-6">
                <div className="card card-primary card-outline">
                  <div className="card-body">
                    <form>
                      <div className="card mt-2">
                        <div className="row col-md-12">
                          <h5 className="col-md-5 card-title mb-2">
                            Handler vs Allocation
                          </h5>
                          <div className=" col-md-3">
                            {/* <div className="col-md-12"> */}
                            <label style={{ fontSize: ".7rem" }}>
                              Change Month
                            </label>
                          </div>
                          <div className=" col">
                            <input
                              style={{ fontSize: ".8rem" }}
                              type="date"
                              name="HandlervsAllocation"
                              max={formattedLastDay}
                              onChange={handleCalendar}
                              className="form-control form-control-sm form-control-border"
                            />
                          </div>
                        </div>
                        <DataGrid
                          style={{ fontWeight: "400" }}
                          // slots={{
                          //     toolbar: CustomToolbar,
                          // }}
                          density="compact"
                          autoHeight
                          experimentalFeatures={{ columnGrouping: true }}
                          getRowId={(element) => element._id}
                          rows={rowsHandler}
                          disableRowSelectionOnClick
                          columns={columnsHandler}
                          initialState={{
                            pagination: {
                              paginationModel: {
                                pageSize: 5,
                              },
                            },
                          }}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                {/* /.card */}
              </div>
              <div className="col-md-6">
                <div className="card card-primary card-outline">
                  <div className="card-body">
                    <form>
                      {/* onSubmit={handleSubmit(onSubmit)} */}
                      <div className="card mt-2">
                        <div className="row col-md-12">
                          <h5 className="col-md-5 card-title mb-2">
                            Handler vs Feedback
                          </h5>
                          <div className=" col-md-3">
                            {/* <div className="col-md-12"> */}
                            <label style={{ fontSize: ".7rem" }}>
                              Change Month
                            </label>
                          </div>
                          <div className=" col">
                            <input
                              style={{ fontSize: ".8rem" }}
                              type="date"
                              name="HandlervsFeedback"
                              max={formattedLastDay}
                              onChange={handleCalendar}
                              className="form-control form-control-sm form-control-border"
                            />
                          </div>
                        </div>
                        <DataGrid
                          style={{ fontWeight: "400" }}
                          // slots={{
                          //     toolbar: CustomToolbar,
                          // }}
                          density="compact"
                          autoHeight
                          experimentalFeatures={{ columnGrouping: true }}
                          getRowId={(element) => element._id}
                          rows={rowsHandlerSatisfied}
                          disableRowSelectionOnClick
                          columns={columnsHandlerSatisfied}
                          initialState={{
                            pagination: {
                              paginationModel: {
                                pageSize: 5,
                              },
                            },
                          }}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                {/* /.card */}
              </div>
              <div className="col-md-6">
                <div className="card card-primary card-outline">
                  <div className="card-body">

                    <form>
                      <div className="card mt-2">
                        <div className="row col-md-12">
                          <h5 className="col-md-5 card-title mb-2">
                            Process vs Allocation
                          </h5>
                          <div className=" col-md-3">
                            {/* <div className="col-md-12"> */}
                            <label style={{ fontSize: ".7rem" }}>
                              Change Month
                            </label>
                          </div>
                          <div className=" col">
                            <input
                              style={{ fontSize: ".8rem" }}
                              type="date"
                              name="ProcessvsAllocation"
                              max={formattedLastDay}
                              onChange={handleCalendar}
                              className="form-control form-control-sm form-control-border"
                            />
                          </div>
                        </div>
                        <DataGrid
                          style={{ fontWeight: "400" }}
                          // slots={{
                          //     toolbar: CustomToolbar,
                          // }}
                          density="compact"
                          autoHeight
                          experimentalFeatures={{ columnGrouping: true }}
                          getRowId={(element) => element._id}
                          rows={rowsProcess}
                          disableRowSelectionOnClick
                          columns={columnsProcess}
                          initialState={{
                            pagination: {
                              paginationModel: {
                                pageSize: 5,
                              },
                            },
                          }}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                {/* /.card */}
              </div>
              <div className="col-md-6">
                <div className="card card-primary card-outline">
                  <div className="card-body">

                    <form>
                      <div className="card mt-2">
                        <div className="row col-md-12">
                          <h5 className="col-md-5 card-title mb-2">
                            Location vs Allocation
                          </h5>
                          <div className=" col-md-3">
                            {/* <div className="col-md-12"> */}
                            <label style={{ fontSize: ".7rem" }}>
                              Change Month
                            </label>
                          </div>
                          <div className=" col">
                            <input
                              style={{ fontSize: ".8rem" }}
                              type="date"
                              name="LocationvsAllocation"
                              max={formattedLastDay}
                              onChange={handleCalendar}
                              className="form-control form-control-sm form-control-border"
                            />
                          </div>
                        </div>
                        <DataGrid
                          style={{ fontWeight: "400" }}
                          // slots={{
                          //     toolbar: CustomToolbar,
                          // }}
                          density="compact"
                          autoHeight
                          experimentalFeatures={{ columnGrouping: true }}
                          getRowId={(element) => element._id}
                          rows={rowsLocation}
                          disableRowSelectionOnClick
                          columns={columnsLocation}
                          initialState={{
                            pagination: {
                              paginationModel: {
                                pageSize: 5,
                              },
                            },
                          }}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                {/* /.card */}
              </div>
              <div className="col-md-6">
                <div className="card card-primary card-outline">
                  <div className="card-body">
                    <form>
                      <div className="card mt-2">

                        <div className="row col-md-12">
                          <h5 className="col-md-5 card-title mb-2">
                            Handler vs Location vs Feedback
                          </h5>
                          <div className=" col-md-3">
                            {/* <div className="col-md-12"> */}
                            <label style={{ fontSize: ".7rem" }}>
                              Change Month
                            </label>
                          </div>
                          <div className=" col">
                            <input
                              style={{ fontSize: ".8rem" }}
                              type="date"
                              name="HandlervsLocationvsFeedback"
                              max={formattedLastDay}
                              onChange={handleCalendar}
                              className="form-control form-control-sm form-control-border"
                            />
                          </div>
                        </div>
                        <DataGrid
                          style={{ fontWeight: "400" }}
                          // slots={{
                          //     toolbar: CustomToolbar,
                          // }}
                          density="compact"
                          autoHeight
                          experimentalFeatures={{ columnGrouping: true }}
                          getRowId={(element) => element._id}
                          rows={rowsHandlerSatisfiedLocation}
                          disableRowSelectionOnClick
                          columns={columnsHandlerSatisfiedLocation}
                          initialState={{
                            pagination: {
                              paginationModel: {
                                pageSize: 5,
                              },
                            },
                          }}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                {/* /.card */}
              </div>
              <div className="col-md-6">
                <div className="card card-primary card-outline">
                  <div className="card-body">
                    <form>
                      <div className="card mt-2">

                        <div className="row col-md-12">
                          <h5 className="col-md-5 card-title mb-2">
                            Handler vs Process vs Feedback
                          </h5>
                          <div className=" col-md-3">
                            {/* <div className="col-md-12"> */}
                            <label style={{ fontSize: ".7rem" }}>
                              Change Month
                            </label>
                          </div>
                          <div className=" col">
                            <input
                              style={{ fontSize: ".8rem" }}
                              type="date"
                              name="HandlervsProcessvsFeedback"
                              max={formattedLastDay}
                              onChange={handleCalendar}
                              className="form-control form-control-sm form-control-border"
                            />
                          </div>
                        </div>
                        <DataGrid
                          style={{ fontWeight: "400" }}
                          // slots={{
                          //     toolbar: CustomToolbar,
                          // }}
                          density="compact"
                          autoHeight
                          experimentalFeatures={{ columnGrouping: true }}
                          getRowId={(element) => element._id}
                          rows={rowsHandlerSatisfiedProcess}
                          disableRowSelectionOnClick
                          columns={columnsHandlerSatisfiedProcess}
                          initialState={{
                            pagination: {
                              paginationModel: {
                                pageSize: 5,
                              },
                            },
                          }}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                {/* /.card */}
              </div>
              {/* /.col-md-5 */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content */}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
