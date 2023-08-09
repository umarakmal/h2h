import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import Header from "../Header";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Menu from "../Menu";
import { isAuth, getCookie, signout } from "./auth/helpers";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
const HandlersForm = () => {
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
                  : row.row.flag === 1
                    ? "btn btn-sm btn-info"
                    : row.row.status === "Pending"
                      ? "btn btn-sm btn-danger"
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
  ];
  const [getids, setIds] = useState("");
  const handleModal = async (e, id) => {
    e.preventDefault();
    setIds(id);
    setModalShow(true);
    const assignHandler = async () => {
      try {
        let HandlerL1 = isAuth().result1.EmployeeID;
        let HandlerL1Name = isAuth().result1.EmployeeName;
        const response = await fetch(`${url}/api/assign-handler`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ HandlerL1, HandlerL1Name, id }),
        });
        if (!response.ok) {
          toast.error("Error Occured");
        }
        const data = await response.json();
        if (response.status === 200) {
          if (data.length > 0) {
            // setData(data)
          } else {
            // setData([])
          }
        }
      } catch (error) { }
    };
    assignHandler();
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
      ah: element.result.AH,
      flag: element.result.flag,
      requesterStatus: element.result.requesterStatus,
      requestdate: formatDate(new Date(element.result.createdAt)),
    }))
    : null;

  //
  const getIssue = async () => {
    try {
      const handlerL1 = isAuth().result1.EmployeeID;
      const response = await fetch(`${url}/api/get-raise-issue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ handlerL1 }),
      });
      if (!response.ok) {
        toast.error("Error Occured");
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
    const [getLength, setLength] = useState("");
    const [getReqId, setReqId] = useState("");
    const [remarkHandlerL1, setRemarkHandlerL1] = useState({});
    const [ReferRemark, setReferringRemark] = useState("");
    const [payout, setPayOut] = useState({});
    const [payoutInput, setPayOutInput] = useState({});
    const [validSelect, setValidSelect] = useState(false);
    const [validReferRemark, setValidReferredRemark] = useState(false);
    const [showRemark, setShowRemark] = useState(false);
    const [showReqRem, setShowReqRem] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [validRemarks, setValidRemarks] = useState({});
    const [validPayout, setValidPayout] = useState({});
    const [validPayoutInput, setValidPayoutInput] = useState({});
    const [modalShowHistory, setModalShowHistory] = React.useState(false);

    const handleRemarkChange = (event, id) => {
      const newValue = event.target.value;
      setRemarkHandlerL1((prevRemarks) => ({
        ...prevRemarks,
        [id]: newValue,
      }));
      setValidRemarks((prevValidRemarks) => ({
        ...prevValidRemarks,
        [id]: newValue !== "",
      }));
    };
    const handleChangeReferringRemark = (event) => {
      setReferringRemark(event.target.value);
      setValidReferredRemark(false);
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
              setLength(data.concern.length);

              if (data.RequestersRemark) {
                setShowReqRem(true);
              }
              setStatus("");
            }
          } catch (error) { }
        };
        getData();
      }
    }, [props.ids]);

    const handleUpdate = async (e, id) => {
      e.preventDefault();
      // const isAnyInvalid = Object.values(validRemarks).filter(valid => valid);
      // const isAnyInvalidPayout = Object.values(validPayout).filter(valid => valid);
      if (!status) {
        setValidSelect(true);
        return false;
      }
      // else if (modalData.belongsTo === "Attendance" || parseInt(isAnyInvalidPayout.length) !== parseInt(getLength)) {
      //     return false
      // }
      else {
        if (status === "Refer To L2") {
          if (!ReferRemark) {
            setValidReferredRemark(true);
            return false;
          } else {
            try {
              const id = modalData._id;
              const cm_id = isAuth().result1.cm_id;
              const subissue = modalData.issue;
              const referred_Remark = ReferRemark;
              const response = await fetch(
                `${url}/api/update-raise-issue-by-id`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id,
                    status,
                    cm_id,
                    subissue,
                    referred_Remark,
                  }),
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
        } else {
          try {
            const id = modalData._id;
            const cm_id = isAuth().result1.cm_id;
            const subissue = modalData.issue;
            const response = await fetch(
              `${url}/api/update-raise-issue-by-id`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, status, cm_id, subissue }),
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
                throw new Error("Request failed");
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
          size="xl"
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
            const remarksArray = Object.entries(remarkHandlerL1).map(
              ([subIssueId, handlerL1remark]) => ({
                subIssueId,
                handlerL1remark,
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
                  let toasterDisplayed = false;
                  data.concern.map((element) => {
                    updates.map(async (el) => {
                      if (idSub === element._id) {
                        const subIssueId = idSub;
                        const handlerL1Data = ` | ${formattedDate} - ${el.handlerL1remark}`;
                        const handlerL1remark =
                          element.handlerL1remark + handlerL1Data;

                        const response = await fetch(
                          `${url}/api/update-raise-issue-handlerremark`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              id,
                              subIssueId,
                              handlerL1remark,
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
                                  //   setRemarkHandlerL1({});
                                  setReqId(data.requestby);
                                  setLength(data.concern.length);
                                  setStatus("");
                                  if (data.RequestersRemark) {
                                    setShowReqRem(true);
                                  }
                                  if (!toasterDisplayed) {
                                    toast.success("Remark Updated!");
                                    toasterDisplayed = true;
                                  }
                                  var zz = "#remark" + idSub;
                                  $(zz).val("");
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
          } catch (error) { }
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
          {/* <div style={{ fontSize: "1rem" }}>
            {isAuth().result1.EmployeeID !== modalData.HandlerL1
              ? "Someone is working on this Request."
              : null}
          </div> */}
        </Modal.Header>
        <Modal.Body>
          <MyVerticallyCenteredModalHistory
            show={modalShowHistory}
            empid={getReqId}
            onHide={() => setModalShowHistory(false)}
          />
          <div className="row" style={{ fontSize: ".7rem" }}>

            <center className="col-sm-12">
              <div className="form-group">
                <label htmlFor="validationCustom01">{/* Process : */}</label>

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
                <label htmlFor="validationCustom01">Contact :</label>

                <label className="ml-1">
                  {modalData ? modalData.mobile_no : null}
                </label>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">
                  Requester's Contact :
                </label>

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
                <label htmlFor="validationCustom01">Status :</label>
                <label className="ml-1">
                  {modalData ? modalData.status : null}
                </label>
              </div>
            </div>
            {showReqRem ? (
              <div className="col-sm-11">
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
                  <th>Previous Remark</th>
                  {modalData.flag === 1 ? <th>Handler L2 Remark</th> : null}
                  <th>Remark</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: ".8rem" }}>
                {modalData.concern
                  ? modalData.concern.map((el, ind) => {
                    console.log(el);
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
                              max="1"
                              step="0.5"
                              placeholder={el.payoutDays}
                              value={payout[el._id] || ""}
                              className="form-control form-control-sm"
                              disabled={
                                modalData ? modalData.flag === 1 : false
                              }
                            ></input>
                            {/* {validPayout[el._id] ? null : <span className='text-danger'>*Required</span>} */}
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
                              disabled={
                                modalData ? modalData.flag === 1 : false
                              }
                            ></input>
                            {/* {validPayout[el._id] ? null : <span className='text-danger'>*Required</span>} */}
                          </td>
                        ) : null}
                        <td>
                          {el.handlerL1remark.split("|").map((str) => (
                            <div>{str}</div>
                          ))}
                        </td>
                        {modalData.flag === 1 ? (
                          <td>
                            {el.handlerL2remark.split("|").map((str) => (
                              <div>{str}</div>
                            ))}
                          </td>
                        ) : null}
                        <td>
                          <textarea
                            onChange={(event) =>
                              handleRemarkChange(event, el._id)
                            }
                            id={"remark" + el._id}
                            rows="1"
                            className="form-control form-control-sm"
                            disabled={
                              modalData ? modalData.flag === 1 : false
                            }
                          ></textarea>
                          {modalData.flag === 0 ? (
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
                            disabled={
                              modalData.flag === 1
                                ? true
                                : isAuth().result1.EmployeeID ===
                                  modalData.HandlerL1
                                  ? false
                                  : true
                            }
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

          <div className="row">
            <div className="col-sm-4">
              <div className="form-group">
                <label
                  htmlFor="validationCustom01"
                  style={{ fontSize: ".7rem" }}
                >
                  Status :
                </label>
                <label className="ml-1">
                  <select
                    name="status"
                    id="validationCustom01"
                    onChange={(e) => (
                      setStatus(e.target.value),
                      setValidSelect(false),
                      e.target.value === "Refer To L2"
                        ? setShowRemark(true)
                        : setShowRemark(false)
                    )}
                    value={status}
                    className="form-control form-control-sm form-control-border"
                    disabled={modalData ? modalData.flag === 1 : false}
                  >
                    <option value="">Select</option>
                    {modalData.checkRemarkHandler1 === 1 ? (
                      <option>In Progress L1</option>
                    ) : (
                      false
                    )}
                    {modalData.flag === 1 ? (
                      <option>In Progress L2</option>
                    ) : (
                      false
                    )}
                    {modalData.checkRemarkHandler1 === 1 ? (
                      <option>Refer To L2</option>
                    ) : (
                      false
                    )}
                    {modalData.checkRemarkHandler1 === 1 ? (
                      <option>Resolved</option>
                    ) : (
                      false
                    )}
                  </select>
                </label>
                {validSelect ? (
                  <span className="text-danger">*Required</span>
                ) : null}
              </div>
            </div>
            {showRemark ? (
              <div className="col-sm-5 ">
                <div className="row">
                  <div className="form-group">
                    <label
                      htmlFor="validationCustom03"
                      style={{ fontSize: ".7rem" }}
                    >
                      Remark :
                    </label>
                  </div>
                  <div className="ml-1">
                    <textarea
                      onChange={(event) => handleChangeReferringRemark(event)}
                      rows="1"
                      type="text"
                      className="form-control form-control-sm "
                    ></textarea>
                    {validReferRemark ? (
                      <span
                        className="text-danger"
                        style={{ fontSize: ".8rem" }}
                      >
                        *Required
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {modalData.checkRemarkHandler1 === 1 ? (
            <Button
              id="btnid"
              onClick={handleUpdate}
              className="btn btn-sm btn-primary"
              disabled={
                modalData.flag === 1
                  ? true
                  : isAuth().result1.EmployeeID === modalData.HandlerL1
                    ? false
                    : true
              }
            >
              Submit
            </Button>
          ) : null}
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
                      Handler's Form
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

export default HandlersForm;
