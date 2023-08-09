import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Header from "../Header";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Menu from "../Menu";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { isAuth, getCookie, signout } from "./auth/helpers";
import { encode as base64_encode } from "base-64";
import $ from "jquery";
function CustomToolbar({ setFilterButtonEl }) {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}
const url = `${process.env.REACT_APP_BACKEND_URL}`;
const HandlersFormL2 = () => {
  const navigate = useNavigate();
  const [datas, setData] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    if (!getCookie('token'))
      signout(() => {
        navigate("/");
      })
  }, []);

  const columns = [
    {
      field: "view",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Action",
      width: 80,
      renderCell: (row) => (
        <td>
          <div>
            <Button
              style={{ fontSize: ".8rem" }}
              variant={
                row.row.requesterStatus === "Re-Open"
                  ? "btn btn-sm btn-warning"
                  : "btn btn-sm btn-primary"
              }
              onClick={(e) => handleModal(e, row.row._id)}
            >
              View
            </Button>
          </div>
        </td>
      ),
    },
    {
      field: "caseid",
      headerName: "Case ID",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 70,
    },
    {
      field: "issuetype",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Belongs To",
      width: 150,
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
      field: "status",
      headerName: "Status",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 100,
    },
    {
      field: "location",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Location",
      width: 100,
    },
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
      field: "name",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Name",
      width: 150,
    },
    {
      field: "process",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Process",
      width: 150,
    },
    {
      field: "ah",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "AH",
      width: 90,
    },
    {
      field: "reportsto",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "ReportsTo",
      width: 90,
    },

    // {
    //     field: "contactno",
    //     headerClassName: "font-weight-bold small",
    //     cellClassName: "small ",
    //     headerName: "Contact No.",
    //     width: 140,
    // },
    {
      field: "handlerL1",
      headerName: "Handler L1",
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


  ];

  const [getids, setIds] = useState("");

  const handleModal = async (e, id) => {
    e.preventDefault();
    try {
      const EmployeeID = isAuth().result1.EmployeeID;
      const EmployeeName = isAuth().result1.EmployeeName;
      const lock = await fetch(`${url}/api/lock-at-handler2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ EmployeeID, id, EmployeeName }),
      });
      if (!lock.ok) {
        toast.error("Case is already being handled by another Handler");
        throw new Error("Request failed");
      } else {
        setIds(id);
        setModalShow(true);
      }
    } catch (err) {
      console.log(err);
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

  const rows = datas
    ? datas.map((element, index) => ({
      id: index + 1,
      _id: element.result._id,
      caseid: element.result.caseId,
      communicatedname: element.result.communicated_with,
      communicatedcontactno: element.result.mobile_no,
      issuetype: element.result.belongsTo,
      issuesubtype: element.result.issue,
      status: element.result.status,
      name: element.result.name,
      process: element.result.Process,
      location: element.result.location,
      reportsto: element.result.reportto,
      requesterStatus: element.result.requesterStatus,
      handlerL1: element.result.HandlerL1,
      referredDate: formatDate(new Date(element.result.referredDate)),
      ah: element.result.AH,
      requestdate: formatDate(new Date(element.result.createdAt)),
    }))
    : null;

  //
  const getIssue = async () => {
    try {
      const EmployeeID = isAuth().result1.EmployeeID;
      const response = await fetch(`${url}/api/get-raise-issue-handler2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ EmployeeID }),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      if (response.status === 200) {
        if (data.length > 0) {
          setData(data);
        } else {
          setData([]);
        }
      }
    } catch (error) { }
  };
  useEffect(() => {
    getIssue();
  }, []);

  function MyVerticallyCenteredModal(props) {
    const [status, setStatus] = useState("");
    const [l1Remark, setHandlerL1Remark] = useState("");
    const [remarkHandlerL2, setRemarkHandlerL2] = useState({});
    const [payout, setPayOut] = useState({});
    const [payoutInput, setPayOutInput] = useState({});
    const [showReqRem, setShowReqRem] = useState(false);
    const [validSelect, setValidSelect] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [validRemarks, setValidRemarks] = useState({});
    const [validPayout, setValidPayout] = useState({});
    const [validPayoutInput, setValidPayoutInput] = useState({});
    const [getReqId, setReqId] = useState("");
    const [modalShowHistory, setModalShowHistory] = React.useState(false);

    const handleRemarkChange = (event, id) => {
      const newValue = event.target.value;

      setRemarkHandlerL2((prevRemarks) => ({
        ...prevRemarks,
        [id]: newValue,
      }));
      setValidRemarks((prevValidRemarks) => ({
        ...prevValidRemarks,
        [id]: newValue.trim() !== "", // Perform validation logic here
      }));
    };

    const handleChangePayout = (event, id) => {
      let newValue = event.target.value;
      // Perform the validation check
      if (newValue < 0) {
        newValue = 0;
      } else if (newValue > 1) {
        newValue = 1;
      }
      setPayOut((prevRemarks) => ({
        ...prevRemarks,
        [id]: newValue,
      }));
      setValidPayout((prevValidRemarks) => ({
        ...prevValidRemarks,
        [id]: newValue !== "", // Perform validation logic here
      }));
    };

    const handleChangePayoutInput = (event, id) => {
      let newValue = event.target.value;

      setPayOutInput((prevRemarks) => ({
        ...prevRemarks,
        [id]: newValue,
      }));
      setValidPayoutInput((prevValidRemarks) => ({
        ...prevValidRemarks,
        [id]: newValue !== "", // Perform validation logic here
      }));
    };

    useEffect(() => {
      const id = props.ids;
      if (id) {
        const getData = async () => {
          try {
            const response = await fetch(`${url}/api/get-raise-issue-by-id`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id }),
            });
            if (!response.ok) {
              toast.error("Error Occured");
            }
            const data = await response.json();
            if (response.status === 200) {
              setModalData(data);
              setReqId(data.requestby);
              setHandlerL1Remark(data.handlersL1Remark.slice(2));
              if (data.RequestersRemark) {
                setShowReqRem(true);
              }
              // if (data.checkRemarkHandler2 === 1) {
              setStatus("");
              // }
            }
          } catch (error) { }
        };
        getData();
      }
    }, [props.ids]);

    const handleUpdate = async (e, id) => {
      e.preventDefault();
      // const isAnyInvalid = Object.values(validRemarks).filter(valid => valid);
      if (!status) {
        setValidSelect(true);
        return false;
      } else {
        try {
          const id = modalData._id;
          const cm_id = isAuth().result1.cm_id;
          const response = await fetch(
            `${url}/api/update-master-issue-by-id-l2`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id, status, cm_id }),
            }
          );
          if (!response.ok) {
            toast.error("Error Occured");
          }
          const data = await response.json();
          if (response.status === 200) {
            toast.success("Request Updated!");
            props.onHide();
            getIssue();
          }
        } catch (error) { }
      }
    };

    function MyVerticallyCenteredModalHistory(props) {
      const [empData, setEmpData] = useState("");
      useEffect(() => {
        const requestby = props.empid;
        if (requestby) {
          const getData = async () => {
            try {
              const response = await fetch(
                `${url}/api/get-requesters-history`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ requestby }),
                }
              );
              if (!response.ok) {
                toast.error("Error Occured");
              }
              const data = await response.json();
              if (response.status === 200) {
                setEmpData(data);
              }
            } catch (error) { }
          };
          getData();
        }
      }, [props.empid]);

      return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title
              style={{ fontSize: "1rem" }}
              id="contained-modal-title-vcenter"
            >
              Requesters History
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div style={{ overflow: "auto" }}>
              <Table striped size="sm" bordered hover>
                <thead>
                  <tr style={{ fontSize: ".7rem" }}>
                    <th>Action</th>
                    <th>CaseID</th>
                    <th>Requester's EmployeeID</th>
                    <th>Requester's Name</th>
                    <th>Process</th>
                    <th>Location</th>
                    <th>Belongs To</th>
                    <th>Request Type</th>
                    <th>Status</th>
                    <th>Communicated With</th>
                    <th>Handler L1</th>
                    <th>Handler L2</th>
                    <th>Requesters status</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: ".8rem" }}>
                  {empData
                    ? empData.map((el, ind) => {
                      return (
                        <tr key={el._id}>
                          <td>
                            {
                              <NavLink
                                target="_blank"
                                to={`/requester-history/${base64_encode(
                                  el._id
                                )}`}
                                style={{ fontSize: ".8rem" }}
                              >
                                View
                              </NavLink>
                            }
                          </td>
                          <td>{el.caseId}</td>
                          <td>{el.requestby}</td>
                          <td>{el.name}</td>
                          <td>{el.Process}</td>
                          <td>{el.location}</td>
                          <td>{el.belongsTo}</td>
                          <td>{el.issue}</td>
                          <td>{el.status}</td>
                          <td>{el.communicated_with}</td>
                          <td>{el.HandlerL1}</td>
                          <td>{el.HandlerL2}</td>
                          <td>{el.RequestersFeedback}</td>
                        </tr>
                      );
                    })
                    : null}
                </tbody>
              </Table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
    const handleRemarkSubmit = async (e, idSub) => {
      const isAnyInvalid = Object.values(validRemarks).some((valid) => valid);
      if (isAnyInvalid === false) {
        return false;
      } else {
        const getDataUpdate = async () => {
          try {
            const remarksArray = Object.entries(remarkHandlerL2).map(
              ([subIssueId, handlerL2remark]) => ({
                subIssueId,
                handlerL2remark,
              })
            );
            var final_remarksArray = [];
            remarksArray.map((e1) => {
              if (e1.subIssueId === idSub) {
                final_remarksArray.push(e1);
              }
            });
            const payoutArray = Object.entries(payout).map(
              ([payoutid, payoutDays]) => ({ payoutid, payoutDays })
            );
            const payoutInputArray = Object.entries(payoutInput).map(
              ([payoutinputid, payoutInput]) => ({ payoutinputid, payoutInput })
            );
            const id = modalData._id;
            const updates = final_remarksArray;
            const getDataUpdateFind = async () => {
              try {
                const response = await fetch(
                  `${url}/api/get-raise-issue-by-id`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                  }
                );

                const data = await response.json();
                if (response.status === 200) {
                  //Date
                  const currentDate = new Date();
                  const year = currentDate.getFullYear();
                  const month = String(currentDate.getMonth() + 1).padStart(
                    2,
                    "0"
                  );
                  const day = String(currentDate.getDate()).padStart(2, "0");
                  const formattedDate = `${day}-${month}-${year}`;
                  data.concern.map((element) => {
                    updates.map(async (el) => {
                      if (element._id === idSub) {
                        const subIssueId = idSub;
                        const handlerL2Data = ` | ${formattedDate} - ${el.handlerL2remark}`;
                        const handlerL2remark =
                          element.handlerL2remark + handlerL2Data;
                        const response = await fetch(
                          `${url}/api/update-raise-issue-handlerremark-l2`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              id,
                              subIssueId,
                              handlerL2remark,
                            }),
                          }
                        );

                        const data = await response.json();
                        if (response.status === 200) {
                          if (id) {
                            const getData = async () => {
                              try {
                                const response = await fetch(
                                  `${url}/api/get-raise-issue-by-id`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ id }),
                                  }
                                );

                                const data = await response.json();
                                if (response.status === 200) {
                                  setModalData(data);
                                  toast.success("Remark Updated!");
                                  var zz = "#remark" + idSub;
                                  $(zz).val("");
                                  setReqId(data.requestby);
                                  setHandlerL1Remark(
                                    data.handlersL1Remark.slice(2)
                                  );
                                  if (data.RequestersRemark) {
                                    setShowReqRem(true);
                                  }
                                }
                              } catch (error) { }
                            };
                            getData();
                          }
                        }
                      }
                    });
                  });
                  if (data.belongsTo === "Attendance") {
                    data.concern.map((element) => {
                      payoutArray.map(async (el) => {
                        if (idSub === el.payoutid) {
                          const payoutid = el.payoutid;
                          const payoutDays = el.payoutDays;
                          const response = await fetch(
                            `${url}/api/update-raise-issue-payout-days`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                id,
                                payoutid,
                                payoutDays,
                              }),
                            }
                          );

                          const data = await response.json();
                          if (response.status === 200) {
                            setPayOut({});
                          }
                        }
                      });
                    });
                    data.concern.map((element) => {
                      payoutInputArray.map(async (el) => {
                        if (idSub === el.payoutinputid) {
                          const payoutid = el.payoutinputid;
                          const payoutInput = el.payoutInput;
                          const response = await fetch(
                            `${url}/api/update-raise-issue-payout-days`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                id,
                                payoutid,
                                payoutInput,
                              }),
                            }
                          );
                          const data = await response.json();
                          if (response.status === 200) {
                            setPayOutInput({});
                          }
                        }
                      });
                    });
                  }
                }
              } catch (error) { }
            };
            getDataUpdateFind();
          } catch (error) {
            toast.error("Error Occured");
          }
        };
        getDataUpdate();
      }
    };
    return (
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title
            style={{ fontSize: "1rem" }}
            id="contained-modal-title-vcenter"
          >
            Request
          </Modal.Title>
        </Modal.Header>
        <MyVerticallyCenteredModalHistory
          show={modalShowHistory}
          empid={getReqId}
          onHide={() => setModalShowHistory(false)}
        />
        <Modal.Body>
          <div className="row" style={{ fontSize: ".7rem" }}>

            <center className="col-sm-12">
              <div className="form-group">
                <label htmlFor="validationCustom01"></label>

                <NavLink
                  target="_blank"
                  to={`/handlers-form/view-roaster/${base64_encode(
                    modalData.requestby
                  )}/${base64_encode(modalData.name)}`}
                >
                  Check Biometric and Roster{" "}
                </NavLink>
              </div>
            </center>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Name :</label>

                <label className="ml-1">
                  {" "}
                  <button onClick={() => setModalShowHistory(true)} className="btn btn-sm btn-primary">
                    {modalData ? modalData.name : null}
                  </button>
                </label>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Case ID :</label>

                <label className="ml-1">
                  {modalData ? modalData.caseId : null}
                </label>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Process :</label>
                <label className="ml-1">
                  {modalData ? modalData.Process : null}
                </label>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Location :</label>

                <label className="ml-1">
                  {modalData ? modalData.location : null}
                </label>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Communicated With :</label>

                <label className="ml-1">
                  {modalData ? modalData.communicated_with : null}
                </label>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Contact No. :</label>

                <label className="ml-1">
                  {modalData ? modalData.mobile_no : null}
                </label>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Requester's Contact :</label>

                <label className="ml-1">
                  {modalData ? modalData.requester_mobile_no : null}
                </label>
              </div>
            </div>

            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Belongs To :</label>

                <label className="ml-1">
                  {modalData ? modalData.belongsTo : null}
                </label>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Request Type :</label>
                <label className="ml-1">
                  {modalData ? modalData.issue : null}
                </label>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Request Date :</label>

                <label className="ml-1">
                  {modalData ? formatDate(new Date(modalData.createdAt)) : null}
                </label>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Handler L1 :</label>
                <label className="ml-1">
                  {modalData ? modalData.HandlerL1Name : null}
                </label>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Status :</label>
                <label className="ml-1">
                  {modalData ? modalData.status : null}
                </label>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label
                  htmlFor="validationCustom01"
                  style={{ fontSize: "12.4px" }}
                >
                  Handler's Remark :
                </label>
                <label className="ml-1">
                  {modalData ? modalData.referred_Remark : null}
                </label>
              </div>
            </div>
            {showReqRem ? (
              <div className="col-sm-6">
                <div className="form-group">
                  <label
                    htmlFor="validationCustom01"
                    style={{ fontSize: "12.4px" }}
                  >
                    Requester's Remark :
                  </label>
                  <label className="ml-1">
                    {modalData ? modalData.RequestersRemark : null}
                  </label>
                </div>
              </div>
            ) : null}
          </div>
          <div style={{ overflow: "auto" }}>
            <Table striped bordered hover size="sm" className="table ">
              <thead>
                <tr style={{ fontSize: ".7rem" }}>
                  <th>#</th>
                  <th>Concern</th>
                  <th>Concern Date</th>
                  {modalData.belongsTo === "Attendance" ? (
                    <th>Payout Days</th>
                  ) : null}
                  {modalData.belongsTo === "Attendance" ? (
                    <th>Payout Type</th>
                  ) : null}
                  <th>Handler L1 Remark</th>
                  <th>Handler L2 Remark</th>
                  <th>Remark</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: ".8rem" }}>
                {modalData.concern
                  ? modalData.concern.map((el, ind) => {
                    // setPayOut(el.payout)
                    return (
                      <tr key={el._id}>
                        <td>{ind + 1}</td>
                        <td>{el.remark}</td>
                        <td>{formatDate(new Date(el.concernof))}</td>
                        {modalData.belongsTo === "Attendance" ? (
                          <td>
                            <input
                              onChange={(event) =>
                                handleChangePayout(event, el._id)
                              }
                              type="number"
                              min="0"
                              placeholder={el.payoutDays}
                              max="1"
                              step="0.5"
                              value={payout[el._id] || ""}
                              className="form-control form-control-sm"
                            ></input>
                          </td>
                        ) : null}
                        {modalData.belongsTo === "Attendance" ? (
                          <td>
                            <input
                              onChange={(event) =>
                                handleChangePayoutInput(event, el._id)
                              }
                              value={payoutInput[el._id] || ""}
                              placeholder={el.payoutType}
                              type="text"
                              className="form-control form-control-sm"
                            ></input>
                            {/* {validPayout[el._id] ? null : <span className='text-danger'>*Required</span>} */}
                          </td>
                        ) : null}
                        <td>{el.handlerL1remark.split('|').map(str => <div>{str}</div>)}</td>

                        <td>{el.handlerL2remark.split('|').map(str => <div>{str}</div>)}</td>
                        <td>
                          <textarea
                            onChange={(event) =>
                              handleRemarkChange(event, el._id)
                            }
                            // disabled={el ? el.handlerL2remark !== "" : false}
                            id={"remark" + el._id}
                            rows="1"
                            className="form-control form-control-sm"
                          ></textarea>
                          {modalData.checkRemarkHandler2 === 0 ? (
                            validRemarks[el._id] ? null : (
                              <span className="text-danger">*Required</span>
                            )
                          ) : null}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={(e) => handleRemarkSubmit(e, el._id)}
                            className="btn btn-sm btn-primary"
                          // disabled={el ? el.handlerL2remark !== "" : false}
                          >
                            Submit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                  : null}
              </tbody>
            </Table>
          </div>
          <div className="col-md-5">
            <div className="form-group">
              <label style={{ fontSize: ".7rem" }} htmlFor="validationCustom01">
                Status :
              </label>
              <label className="ml-1">
                <select
                  name="status"
                  id="validationCustom01"
                  onChange={(e) => (
                    setStatus(e.target.value), setValidSelect(false)
                  )}
                  value={status}
                  className="form-control form-control-sm form-control-border"
                >
                  <option value="">Select</option>
                  {/* {modalData.checkRemarkHandler2 === 0 ? <option>In Progress L2</option> : null} */}
                  <option>Resolved</option>
                </select>
              </label>
              {validSelect ? (
                <span className="text-danger">*Required</span>
              ) : null}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleUpdate}
            className="btn btn-sm btn-primary"
            disabled={modalData.checkRemarkHandler2 === 0 ? true : false}
          >
            Submit
          </Button>
          <Button className="btn btn-sm btn-primary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

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
                    <h5 className="card-title" style={{ fontSize: "1.1rem" }}>
                      Handler's Form L2
                    </h5>
                    <br />
                    <hr />
                    <MyVerticallyCenteredModal
                      show={modalShow}
                      ids={getids}
                      onHide={() => setModalShow(false)}
                    />
                    <form>
                      <div className="card mt-2">
                        <DataGrid
                          style={{ fontWeight: "400" }}
                          slots={{
                            toolbar: CustomToolbar,
                          }}
                          density="compact"
                          autoHeight
                          experimentalFeatures={{ columnGrouping: true }}
                          getRowId={(element) => element._id}
                          rows={rows}
                          disableRowSelectionOnClick
                          columns={columns}
                          initialState={{
                            pagination: {
                              paginationModel: {
                                pageSize: 8,
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

export default HandlersFormL2;
