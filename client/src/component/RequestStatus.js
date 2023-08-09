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
import { useNavigate } from "react-router-dom";
import { isAuth, getCookie, signout } from "../component/auth/helpers";
import { BsFillHandThumbsUpFill, BsHandThumbsDownFill } from "react-icons/bs";
import $ from "jquery";
function CustomToolbar({ setFilterButtonEl }) {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton ref={setFilterButtonEl} />
    </GridToolbarContainer>
  );
}
const url = `${process.env.REACT_APP_BACKEND_URL}`;
const RequestStatus = () => {
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
      headerClassName: " small font-weight-bold",
      cellClassName: "small ",
      headerName: "View",
      width: 100,
      renderCell: (row) => (
        <td>
          <div>
            <Button
              variant="btn btn-sm btn-primary"
              style={{ fontSize: ".7rem" }}
              onClick={(e) => handleModal(e, row.row._id)}
            >
              View Request
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
      width: 60,
    },

    {
      field: "employeeid",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "EmployeeID",
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
      field: "communicatedname",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Communicated With",
      width: 140,
    },

    {
      field: "issuetype",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Belongs To",
      width: 140,
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
      width: 90,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 100,
    },
  ];
  const [getids, setIds] = useState("");
  const handleModal = async (e, id) => {
    e.preventDefault();
    setIds(id);
    setModalShow(true);
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
      _id: element._id,
      caseid: element.caseId,
      employeeid: element.requestby,
      communicatedname: element.communicated_with,
      communicatedcontactno: element.mobile_no,
      issuetype: element.belongsTo,
      issuesubtype: element.issue,
      status: element.status,
      name: element.name,
      process: element.Process,
      location: element.location,
      reportsto: element.reportto,
      ah: element.AH,
      requestdate: formatDate(new Date(element.createdAt)),
    }))
    : null;

  //
  const getIssue = async () => {
    try {
      const requestby = isAuth().result1.EmployeeID;
      const response = await fetch(`${url}/api/get-raise-issue-requester`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestby }),
      });
      if (!response.ok) {
        toast.error("Error Occured");
      }
      const data = await response.json();
      if (response.status === 200) {
        if (data.length > 0) {
          setData(data);
        }
      }
    } catch (error) { }
  };
  useEffect(() => {
    getIssue();
  }, []);

  function MyVerticallyCenteredModal(props) {
    const [remark, setRemark] = useState("");
    const [status, setStatus] = useState("");
    const [feedback, setFeedback] = useState("");
    const [l1Remark, setHandlerL1Remark] = useState("");
    const [l2Remark, setHandlerL2Remark] = useState("");
    const [validRemark, setValidRemark] = useState(false);
    const [validRemarkFeed, setValidRemarkFeed] = useState(false);
    const [validStatus, setValidStatus] = useState(false);
    const [showFeed, setShowFeed] = useState(false);
    const [showFeedBut, setShowFeedBut] = useState(false);
    const [showClose, setShowClose] = useState(false);
    const [showReOpen, setShowReOpen] = useState(false);
    const [showDiv, setShowDiv] = useState(false);
    const [showStatusReOpen, setShowStatusReOpen] = useState(false);
    const [modalData, setModalData] = useState([]);
    const handleRemark = (e) => {
      e.preventDefault();
      setValidRemark(false);
      setRemark(e.target.value);
    };

    const handleFeedback = (e) => {
      // e.preventDefault()
      setValidRemarkFeed(false);
      setFeedback(e.target.value);
    };
    const handleStatus = (e) => {
      e.preventDefault();
      setValidStatus(false);
      setStatus(e.target.value);
      if (e.target.value === "Close") {
        setShowClose(true);
        setShowReOpen(false);
      } else if (e.target.value === "Re-Open") {
        setShowReOpen(true);
        setShowClose(false);
      } else {
        setShowReOpen(false);
        setShowClose(false);
      }
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
              setStatus(data.requesterStatus);
              if (data.requesterStatus === "" && data.status === "Resolved") {
                setShowFeed(true);
                setShowStatusReOpen(true);
                setShowFeedBut(true);
                setRemark(data.RequestersRemark);
                setFeedback(data.RequestersFeedback);
                if (!data.RequestersFeedback) {
                } else {
                  setShowClose(true);
                  setShowFeedBut(false);
                }
                if (!data.RequestersRemark) {
                } else {
                  if (data.requesterStatus === "Re-Open") {
                    setShowReOpen(true);
                    setShowFeedBut(false);
                  }
                }
              } else if (
                data.requesterStatus === "Close" &&
                data.status === "Close"
              ) {
                setShowFeed(true);
                setShowStatusReOpen(true);
                setShowFeedBut(true);
                setRemark(data.RequestersRemark);
                setFeedback(data.RequestersFeedback);
                if (!data.RequestersFeedback) {
                } else {
                  setShowClose(true);
                  setShowFeedBut(false);
                }
                if (!data.RequestersRemark) {
                } else {
                  if (data.requesterStatus === "Re-Open") {
                    setShowReOpen(true);
                    setShowFeedBut(false);
                  }
                }
              } else if (
                data.requesterStatus === "Re-Open" &&
                data.status !== "Resolved"
              ) {
                setShowFeed(true);
                setShowFeedBut(true);
                setShowStatusReOpen(true);
                setRemark(data.RequestersRemark);
                setFeedback(data.RequestersFeedback);
                $("#reqstatus").attr("disabled", true);
                $("#reqremark").attr("disabled", true);
                if (!data.RequestersFeedback) {
                } else {
                  setShowClose(true);
                  setShowFeedBut(false);
                }
                if (!data.RequestersRemark) {
                } else {
                  if (data.requesterStatus === "Re-Open") {
                    setShowReOpen(true);
                    setShowFeedBut(false);
                  }
                }
              } else if (
                data.requesterStatus === "Re-Open" &&
                data.status === "Resolved"
              ) {
                setShowFeed(true);
                setStatus("");
                setShowFeedBut(true);
                setShowStatusReOpen(false);
                setRemark("");
                setShowReOpen(false);
              }
              if (data.handlerL2Remark) {
                setShowDiv(true);
              }
              setModalData(data);
              setHandlerL1Remark(data.handlersL1Remark.slice(2));
              setHandlerL2Remark(data.handlerL2Remark.slice(2));
            }
          } catch (error) { }
        };
        getData();
      }
    }, [props.ids]);

    const handleUpdate = async (e, id) => {
      e.preventDefault();

      if (!status) {
        setValidStatus(true);
        return false;
      } else if (status === "Re-Open") {
        if (!remark) {
          setValidRemark(true);
          return false;
        } else {
          try {
            const RequestersRemark = remark;
            const id = modalData._id;
            const cm_id = isAuth().result1.cm_id;
            const requesterStatus = status;
            const response = await fetch(
              `${url}/api/update-raise-issue-by-id-requesterstatus`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id,
                  RequestersRemark,
                  cm_id,
                  feedback,
                  requesterStatus,
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Request failed");
            }

            const data = await response.json();
            if (response.status === 200) {
              toast.success("Request Updated!");
              props.onHide();
              getIssue();
            }
          } catch (error) { }
        }
      } else if (status === "Close") {
        if (!feedback) {
          setValidRemarkFeed(true);
          return false;
        } else if (!remark) {
          setValidRemark(true);
          return false;
        } else {
          try {
            const RequestersRemark = remark;
            const id = modalData._id;
            const cm_id = isAuth().result1.cm_id;
            const requesterStatus = status;
            const response = await fetch(
              `${url}/api/update-raise-issue-by-id-requesterstatus`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id,
                  RequestersRemark,
                  cm_id,
                  feedback,
                  requesterStatus,
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Request failed");
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
            Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row" style={{ fontSize: ".7rem" }}>
            <div className="col-sm-4">
              <div className="form-group">
                <label
                  // className="text-muted"
                  htmlFor="validationCustom01"
                >
                  Case ID :
                </label>
                <label className="ml-1">
                  {modalData ? modalData.caseId : null}
                </label>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label
                  // className="text-muted"
                  htmlFor="validationCustom01"
                >
                  Name :
                </label>
                <label className="ml-1">
                  {modalData ? modalData.name : null}
                </label>
              </div>
            </div>
            <div className=" col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Belongs To :</label>

                <label className="ml-1">
                  {modalData ? modalData.belongsTo : null}
                </label>
              </div>
            </div>
            <div className=" col-sm-4">
              <div className="form-group">
                <label
                  // className="text-muted"
                  htmlFor="validationCustom01"
                >
                  Request Type :
                </label>
                <label className="ml-1">
                  {modalData ? modalData.issue : null}
                </label>
              </div>
            </div>
            <div className=" col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Request Date :</label>
                <label className="ml-1">
                  {" "}
                  {modalData ? formatDate(new Date(modalData.createdAt)) : null}
                </label>
              </div>
            </div>

            <div className=" col-sm-4">
              <div className="form-group">
                <label
                  // className="text-muted"
                  htmlFor="validationCustom01"
                >
                  Communicated With :
                </label>
                <label className="ml-1">
                  {modalData ? modalData.communicated_with : null}
                </label>
              </div>
            </div>
            <div className=" col-sm-4">
              <div className="form-group">
                <label
                  // className="text-muted"
                  htmlFor="validationCustom01"
                >
                  Contact No. :
                </label>
                <label className="ml-1">
                  {modalData ? modalData.mobile_no : null}
                </label>
              </div>
            </div>
            <div className=" col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Location :</label>
                <label className="ml-1">
                  {modalData ? modalData.location : null}
                </label>
              </div>
            </div>
            <div className=" col-sm-4">
              <div className="form-group">
                <label htmlFor="validationCustom01">Status :</label>
                <label className="ml-1">
                  {modalData ? modalData.status : null}
                </label>
              </div>
            </div>
            {showFeed ? (
              <div className=" col-sm-4">
                <div className="form-group">
                  <label htmlFor="validationCustom01">
                    Requester's Status :
                  </label>
                  <select
                    name="status"
                    id="reqstatus"
                    onChange={handleStatus}
                    value={status}
                    className="form-control form-control-sm"
                    disabled={
                      modalData ? modalData.requesterStatus === "Close" : false
                    }
                  >
                    <option value="">Select</option>
                    {showStatusReOpen ? <option>Re-Open</option> : false}
                    <option>Close</option>
                  </select>
                  {validStatus ? (
                    <span className="text-danger">*Required</span>
                  ) : null}
                </div>
              </div>
            ) : null}

            {showClose ? (
              <>
                {" "}
                <div className=" col-sm-4">
                  <div className="form-group">
                    <label>Feedback :</label>

                    <div className="row">
                      <div className="icheck-primary ml-2">
                        <input
                          type="radio"
                          id="radioPrimary1"
                          name="feedback"
                          checked={feedback === "Satisfied"}
                          value="Satisfied"
                          onChange={handleFeedback}
                          disabled={
                            modalData ? modalData.RequestersFeedback : false
                          }
                        />

                        <label htmlFor="radioPrimary1">
                          <BsFillHandThumbsUpFill
                            style={{
                              color: "green",
                              fontSize: "1.1rem",
                            }}
                          />
                        </label>
                      </div>
                      <div className="icheck-primary ml-2">
                        <input
                          type="radio"
                          id="radioPrimary2"
                          value="Not Satisfied"
                          checked={feedback === "Not Satisfied"}
                          name="feedback"
                          onChange={handleFeedback}
                          disabled={
                            modalData ? modalData.RequestersFeedback : false
                          }
                        />
                        <label htmlFor="radioPrimary2">
                          <BsHandThumbsDownFill
                            style={{
                              color: "red",
                              fontSize: "1.1rem",
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    {validRemarkFeed ? (
                      <span className="text-danger">*Required</span>
                    ) : null}
                  </div>
                </div>
                <div className=" col-sm-4">
                  <div className="form-group">
                    <label
                      htmlFor="validationCustom01"
                      style={{ fontSize: "12.4px" }}
                    >
                      Requester's Remark :
                    </label>

                    <textarea
                      id="reqremark"
                      onChange={handleRemark}
                      value={remark}
                      className="form-control form-control-sm"
                      disabled={
                        modalData
                          ? modalData.requesterStatus === "Close"
                          : false
                      }
                    ></textarea>
                    {validRemark ? (
                      <span className="text-danger">*Required</span>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}
            {showReOpen ? (
              <div className=" col-sm-4">
                <div className="form-group">
                  <label
                    htmlFor="validationCustom01"
                    style={{ fontSize: "12.4px" }}
                  >
                    Requester's Remark :
                  </label>
                  <textarea
                    id="reqremark"
                    onChange={handleRemark}
                    value={remark}
                    className="form-control form-control-sm"
                    disabled={
                      modalData ? modalData.requesterStatus === "Close" : false
                    }
                  ></textarea>
                  {validRemark ? (
                    <span className="text-danger">*Required</span>
                  ) : null}
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
                  <th>Handlers L1 Remark</th>
                  {modalData.checkRemarkHandler2 === 1 ? (
                    <th>Handlers L2 Remark</th>
                  ) : null}
                </tr>
              </thead>
              <tbody style={{ fontSize: ".8rem" }}>
                {modalData.concern
                  ? modalData.concern.map((el, ind) => {
                    return (
                      <tr key={el._id}>
                        <td>{ind + 1}</td>
                        <td>{el.remark}</td>
                        <td>{formatDate(new Date(el.concernof))}</td>
                        <td>
                          {el.handlerL1remark.split('|').map(str => <div>{str}</div>)}
                        </td>
                        {modalData.checkRemarkHandler2 === 1 ? (
                          <td>
                            {el.handlerL2remark.split('|').map(str => <div>{str}</div>)}
                          </td>
                        ) : null}
                      </tr>
                    );
                  })
                  : null}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {showFeedBut ? (
            <Button
              onClick={handleUpdate}
              className="btn btn-sm btn-primary"
              hidden={modalData ? modalData.RequestersFeedback : false}
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
                      Request Status
                    </h5>
                    <br />
                    <hr />
                    <MyVerticallyCenteredModal
                      show={modalShow}
                      ids={getids}
                      onHide={() => setModalShow(false)}
                    />
                    <form>
                      {/* onSubmit={handleSubmit(onSubmit)} */}
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
                          // columnGroupingModel={columnGroupingModel}
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

export default RequestStatus;
