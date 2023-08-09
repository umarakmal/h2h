import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Header from "../../Header";
import Footer from "../../Footer";
import { ErrorMessage } from "@hookform/error-message";
import { ToastContainer, toast } from "react-toastify";
import Menu from "../../Menu";
import { useNavigate } from "react-router-dom";
import { isAuth, getCookie, signout } from "../auth/helpers";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
function CustomToolbar({ setFilterButtonEl }) {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}
const url = `${process.env.REACT_APP_BACKEND_URL}`;
function ProcessHandlerMapping() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      formdata: [
        {
          process: "",
          subissue: "",
          issue: "",
          HandlerL1: "",
          HandlerL2: "",
        },
      ],
    },
  });
  const navigate = useNavigate();
  const [getIssueBind, setIssueBind] = useState([]);
  const [datas, setData] = useState([]);
  const [datasProcess, setDataProcess] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    if (!getCookie('token'))
      signout(() => {
        navigate("/");
      })
  }, []);

  const getIssueForBind = async () => {
    try {
      const response = await fetch(`${url}/api/get-master-issue-active`, {
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
          setIssueBind(data);
        }
      }
    } catch (error) { }
  };
  const [handlerBind, setHandlerBind] = useState([]);
  const getHandlerForBind = async () => {
    try {
      const response = await fetch(`${url}/api/get-master-handler-active`, {
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
          setHandlerBind(data);
        }
      }
    } catch (error) { }
  };
  useEffect(() => {
    getIssueForBind();
    getHandlerForBind();
  }, []);

  const onSubmit = async (data) => {
    try {
      const issue = data.formdata[0].issue;
      const subissue1 = data.formdata[0].subissue;
      var handler1 = data.formdata[0].HandlerL1.split("-");
      var handler2 = data.formdata[0].HandlerL2.split("-");
      const HandlerL1 = handler1[1];
      const HandlerL2 = handler2[1];
      const HandlerL1Name = handler1[0];
      const HandlerL2Name = handler2[0];
      const proces = data.formdata[0].process;
      let proces1 = proces.split("|");
      const process = proces1[0] + "|" + proces1[1] + "|" + proces1[2];
      const cm_id = proces1[3];
      let toasterDisplayed = false;
      subissue1.map(async (el) => {
        const subissue = el;
        const response = await fetch(`${url}/api/create-handler-mapping`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issue,
            subissue,
            HandlerL1,
            HandlerL1Name,
            HandlerL2Name,
            HandlerL2,
            process,
            cm_id,
          }),
        });

        if (!response.ok) {
          toast.error("Already Exists");
        }

        await response.json();
        if (response.status === 200) {
          // reset()
          reset({
            formdata: [
              {
                process: "",
                subissue: "",
                issue: "",
                HandlerL1: "",
                HandlerL2: "",
              },
            ],
          });

          if (!toasterDisplayed) {
            toast.success("Issue Mapped!");
            toasterDisplayed = true;
            setSubIssue([]);
            getIssueHandler();
          }
        }
      });
    } catch (error) {
      toast.error("Already Exists");
    }
  };

  const getIssueHandler = async () => {
    try {
      const response = await fetch(`${url}/api/find-handler-mapping`, {
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
          setData(data);
        }
      }
    } catch (error) { }
  };
  const getProcess = async () => {
    try {
      const response = await fetch(`${url}/api/get-process`, {
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
  useEffect(() => {
    getIssueHandler();
    getProcess();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "S. No.",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      width: 60,
    },
    {
      field: "view",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Action",
      width: 70,
      renderCell: (row) => (
        <td>
          <div>
            <button
              style={{ fontSize: ".8rem" }}
              className="btn btn-sm btn-primary"
              onClick={(e) => handleModal(e, row.row._id, row.row.empid, row.row.empid2, row.row.issue, row.row.cm_id)}
            >
              View
            </button>
          </div>
        </td>
      ),
    },
    {
      field: "process",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Process",
      width: 150,
    },
    {
      field: "issue",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Belongs To",
      width: 130,
    },
    {
      field: "subissue",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Request Type",
      width: 150,
    },

    {
      field: "empidname",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Handler L1 Name",
      width: 160,
    },

    {
      field: "empid2name",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Handler L2 Name",
      width: 160,
    },
    {
      field: "empid",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Handler L1",
      width: 100,
    },
    {
      field: "empid2",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Handler L2",
      width: 100,
    },
    {
      field: "status",
      headerClassName: "font-weight-bold small",
      cellClassName: "small ",
      headerName: "Status",
      width: 100,
    },
  ];
  const [getids, setIds] = useState("");
  const [getHandler1, setHandler1] = useState("")
  const [getHandler2, setHandler2] = useState("")
  const [getIss, setIss] = useState("")
  const [getCmid, setCmid] = useState("")
  const handleModal = async (e, id, handler1, handler2, issue, cm_id) => {
    e.preventDefault();
    setIds(id);
    setHandler1(handler1)
    setIss(issue)
    setCmid(cm_id)
    setHandler2(handler2)
    setModalShow(true);
  };
  const rows = datas
    ? datas.map((element, index) => ({
      id: index + 1,
      _id: element._id,
      empid: element.HandlerL1,
      empidname: element.HandlerL1Name,
      empid2name: element.HandlerL2Name,
      empid2: element.HandlerL2,
      issue: element.issue,
      cm_id: element.cm_id,
      subissue: element.subissue,
      process: element.process,
      status: element.status,
    }))
    : null;

  const [subIssue, setSubIssue] = useState([]);
  const belongsto = async (event) => {
    try {
      const belongsTo = event.target.value;
      const response = await fetch(`${url}/api/get-master-by-name-active`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ belongsTo }),
      });

      if (!response.ok) {
        toast.error("error occured");
      }

      const data = await response.json();
      if (response.status === 200) {
        setSubIssue(data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  function MyVerticallyCenteredModal(props) {
    const [handlerid, setHandlerId] = useState("");
    const [handlerL2, setHandlerL2] = useState("");
    const [issue, setIssue] = useState("");
    const [subIssueModal, setSubIssueModal] = useState("");
    const [status, setStatus] = useState("");
    const [process, setProcess] = useState("");
    const [subissue, setSubIssues] = useState([])
    const [delId, setDelId] = useState([])
    const [validRemark, setValidRemark] = useState(false);
    const [validRemark1, setValidRemark1] = useState(false);
    const [validHandlerL2, setValidHandleL2] = useState(false);
    const [validRemarkProcess, setValidSelectProcess] = useState(false);
    const [validRemarkSubIssue, setValidSelectSubIssue] = useState(false);
    const [validSelect, setValidSelect] = useState(false);
    const [modalData, setModalData] = useState([]);

    const handleHandlerId = (e) => {
      e.preventDefault();
      setValidRemark(false);
      setHandlerId(e.target.value);
    };
    const handleHandlerL2 = (e) => {
      e.preventDefault();
      setValidHandleL2(false);
      setHandlerL2(e.target.value);
    };

    const handleSubIssue = (e) => {
      e.preventDefault()
      setValidSelectSubIssue(false)
      let value = Array.from(e.target.selectedOptions, option => option.value);
      setSubIssues(value);
    }

    const handleIssue = async (e) => {
      e.preventDefault();
      setValidRemark1(false);
      setIssue(e.target.value);
    };

    useEffect(() => {
      const id = props.ids;
      if (id) {
        const id = props.ids
        const issue = props.issue
        const cm_id = props.cm_id
        const handlerL1 = props.handler1
        const handlerL2 = props.handler2
        const getData = async () => {
          try {
            const response = await fetch(
              `${url}/api/get-particular-handler-mapping`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, issue, cm_id, handlerL1, handlerL2 }),
              }
            );

            if (!response.ok) {
              toast.error("Error Occured");
            }

            const data = await response.json();
            if (response.status === 200) {
              setModalData(data[0])
              setSubIssues(data[0].subissue)
              setHandlerId(data[0].HandlerL1Name + "-" + data[0].HandlerL1)
              setStatus(data[0].status)
              setIssue(data[0].issue)
              setDelId(data[0].id)
              const abc = data[0].process + "|" + data[0].cm_id
              setProcess(abc)
              setHandlerL2(data[0].HandlerL2Name + "-" + data[0].HandlerL2)
            }
          } catch (error) { }
        };
        getData();
      }
    }, [props.ids, props.issue, props.cm_id, props.handler1]);

    useEffect(() => {
      if (issue) {
        const getData1 = async () => {
          try {
            const belongsTo = issue;
            const response = await fetch(
              `${url}/api/get-master-by-name-active`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ belongsTo }),
              }
            );

            if (!response.ok) {
              toast.error("Error Occured");
            }

            const data = await response.json();
            if (response.status === 200) {
              setSubIssueModal(data);
            }
          } catch (error) {
            toast.error("Error Occured");
          }
        };
        getData1();
      }
    }, [issue]);
    const handleUpdate = async (e, id) => {
      e.preventDefault();
      if (!status) {
        setValidSelect(true);
        return false;
      } else if (!handlerid) {
        setValidRemark(true);
        return false;
      } else if (!process) {
        setValidSelectProcess(true);
        return false;
      } else if (!subissue) {
        setValidSelectSubIssue(true);
        return false;
      } else if (!issue) {
        setValidRemark1(true);
        return false;
      } else if (!handlerL2) {
        setValidRemark1(true);
        return false;
      } else {
        let toasterDisplayed = false;
        let toasterDisplayedErr = false;
        subissue.map(async (el) => {
          try {
            var handler1 = handlerid.split("-");
            var handler2 = handlerL2.split("-");
            const HandlerL1 = handler1[1];
            const HandlerL2 = handler2[1];
            const HandlerL1Name = handler1[0];
            const HandlerL2Name = handler2[0];
            const id = modalData._id;
            let subissue = el
            let proces1 = process.split("|");
            const Process = proces1[0] + "|" + proces1[1] + "|" + proces1[2];
            const cm_id = proces1[3];
            const response = await fetch(`${url}/api/create-handler-mapping`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id,
                status,
                HandlerL1,
                HandlerL2,
                HandlerL1Name,
                HandlerL2Name,
                issue,
                subissue,
                Process,
                cm_id, delId
              }),
            });

            if (!response.ok) {
              if (!toasterDisplayedErr) {
                toast.error("Already Exists!");
                toasterDisplayedErr = true;
              }
            }

            const data = await response.json();
            if (response.status === 200) {
              if (!toasterDisplayed) {
                toast.success("Updated!");
                props.onHide()
                getIssueHandler()
                toasterDisplayed = true;
              }
            }
          } catch (error) { }
        })
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
          <Modal.Title id="contained-modal-title-vcenter">
            Handler Master
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ fontSize: ".7rem" }}>
            <div className=" form-group row">
              <div className="col-md-4">
                <label
                  htmlFor="validationCustom01"
                  style={{ fontSize: "12.4px" }}
                >
                  Handler L1 :
                </label>
              </div>
              <div className="col-md-6">
                {/* <input onChange={handleHandlerId} value={handlerid} className='form-control form-control-sm'></input> */}
                <select
                  name="Handler L1"
                  id="validationCustom01"
                  value={handlerid}
                  onChange={handleHandlerId}
                  className="form-control form-control-sm"
                >
                  <option value="">Select</option>
                  {handlerBind
                    ? handlerBind.map((el) => {
                      return (
                        <option
                          value={el.EmployeeName + "-" + el.EmployeeID}
                          key={el._id}
                        >
                          {el.EmployeeName + "-" + el.EmployeeID}
                        </option>
                      );
                    })
                    : null}
                </select>
                {validRemark ? (
                  <span className="text-danger">*Required</span>
                ) : null}
              </div>
            </div>
            <div className=" form-group row">
              <div className="col-md-4">
                <label
                  htmlFor="validationCustom01"
                  style={{ fontSize: "12.4px" }}
                >
                  Handler L2 :
                </label>
              </div>
              <div className="col-md-6">
                {/* <input onChange={handleHandlerL2} value={handlerL2} className='form-control form-control-sm'></input> */}
                <select
                  name="handler L2"
                  id="validationCustom01"
                  value={handlerL2}
                  onChange={handleHandlerL2}
                  className="form-control form-control-sm"
                >
                  <option value="">Select</option>
                  {handlerBind
                    ? handlerBind.map((el) => {
                      return (
                        <option
                          value={el.EmployeeName + "-" + el.EmployeeID}
                          key={el._id}
                        >
                          {el.EmployeeName + "-" + el.EmployeeID}
                        </option>
                      );
                    })
                    : null}
                </select>
                {validHandlerL2 ? (
                  <span className="text-danger">*Required</span>
                ) : null}
              </div>
            </div>
            <div className=" form-group row">
              <div className="col-md-4">
                <label htmlFor="validationCustom01">Process : </label>
              </div>
              <div className="col-md-6">
                <select
                  name="status"
                  id="validationCustom01"
                  onChange={(e) => (
                    setProcess(e.target.value), setValidSelectProcess(false)
                  )}
                  value={process}
                  className="form-control form-control-sm"
                >
                  <option value="">Select</option>
                  {datasProcess
                    ? datasProcess.map((el) => {
                      return (
                        <option
                          value={el.Process + "|" + el.cm_id}
                          key={el.cm_id}
                        >
                          {el.Process + "|" + el.location}
                        </option>
                      );
                    })
                    : null}
                </select>
                {validRemarkProcess ? (
                  <span className="text-danger">*Required</span>
                ) : null}
              </div>
            </div>
            <div className=" form-group row">
              <div className="col-md-4">
                <label htmlFor="validationCustom01">Belongs To : </label>
              </div>
              <div className="col-md-6">
                <select
                  name="issue"
                  id="validationCustom01"
                  onChange={handleIssue}
                  value={issue}
                  className="form-control form-control-sm"
                >
                  <option value="">Select</option>
                  {getIssueBind
                    ? getIssueBind.map((el) => {
                      return (
                        <option value={el.issue} key={el._id}>
                          {el.issue}
                        </option>
                      );
                    })
                    : null}
                </select>
                {validRemark1 ? (
                  <span className="text-danger">*Required</span>
                ) : null}
              </div>
            </div>
            <div className=" form-group row">
              <div className="col-md-4">
                <label htmlFor="validationCustom01">Request Type : </label>
              </div>
              <div className="col-md-6">
                <select
                  name="subissue"
                  id="validationCustom01"
                  onChange={handleSubIssue}
                  multiple
                  value={subissue}
                  className="form-control form-control-sm"
                >
                  <option value="">Select</option>
                  {subIssueModal
                    ? subIssueModal.map((el) => {
                      return (
                        <option key={el._id} value={el.subissue}>
                          {el.subissue}
                        </option>
                      );
                    })
                    : null}
                </select>
                {validRemarkSubIssue ? (
                  <span className="text-danger">*Required</span>
                ) : null}
              </div>
            </div>
            <div className=" form-group row">
              <div className="col-md-4">
                <label htmlFor="validationCustom01">Status : </label>
              </div>
              <div className="col-md-6">
                <select
                  name="status"
                  id="validationCustom01"
                  onChange={(e) => (
                    setStatus(e.target.value), setValidSelect(false)
                  )}
                  value={status}
                  className="form-control form-control-sm"
                >
                  <option value="">Select</option>
                  <option>active</option>
                  <option>inactive</option>
                </select>
                {validSelect ? (
                  <span className="text-danger">*Required</span>
                ) : null}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdate} className="btn btn-sm btn-primary">
            Update
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
                    <h5 className="card-title">Process Handler Mapping</h5>
                    <MyVerticallyCenteredModal
                      show={modalShow}
                      ids={getids}
                      handler1={getHandler1}
                      handler2={getHandler2}
                      cm_id={getCmid}
                      issue={getIss}
                      onHide={() => setModalShow(false)}
                    />
                    <br />
                    <hr />
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row">
                        <div className="col-sm-4">
                          {/* text input */}
                          <div className="form-group">
                            <label style={{ fontSize: ".7rem" }}>Process</label>
                            <select
                              style={{ fontSize: ".8rem" }}
                              className="form-control form-control-sm"
                              {...register(`formdata[0].process`, {
                                required: "Process is required.",
                              })}
                              aria-invalid={
                                errors.formdata?.[0].process ? "true" : "false"
                              }
                            //   onChange={belongsto}
                            >
                              <option value="">Select Process</option>
                              {datasProcess
                                ? datasProcess.map((el) => {
                                  return (
                                    <option
                                      value={el.Process + "|" + el.cm_id}
                                      key={el.cm_id}
                                    >
                                      {el.Process + "|" + el.location}
                                    </option>
                                  );
                                })
                                : null}
                            </select>
                            <ErrorMessage
                              errors={errors}
                              name="formdata[0].process"
                              render={({ message }) => (
                                <p style={{ color: "red", fontSize: "0.8rem" }}>
                                  {message}
                                </p>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          {/* textarea */}
                          <div className="form-group">
                            <label style={{ fontSize: ".7rem" }}>
                              Handler L1
                            </label>

                            <select
                              style={{ fontSize: ".8rem" }}
                              className="form-control form-control-sm"
                              {...register(`formdata[0].HandlerL1`, {
                                required: "HandlerL1 is required.",
                              })}
                              aria-invalid={
                                errors.formdata?.[0].HandlerL1
                                  ? "true"
                                  : "false"
                              }
                            //   onChange={belongsto}
                            >
                              <option value="">Select HandlerL1</option>
                              {handlerBind
                                ? handlerBind.map((el) => {
                                  return (
                                    <option
                                      value={
                                        el.EmployeeName + "-" + el.EmployeeID
                                      }
                                      key={el._id}
                                    >
                                      {el.EmployeeName + "-" + el.EmployeeID}
                                    </option>
                                  );
                                })
                                : null}
                            </select>
                            <ErrorMessage
                              errors={errors}
                              name="formdata[0].HandlerL1"
                              render={({ message }) => (
                                <p style={{ color: "red", fontSize: "0.8rem" }}>
                                  {message}
                                </p>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          {/* textarea */}
                          <div className="form-group">
                            <label style={{ fontSize: ".7rem" }}>
                              Handler L2
                            </label>
                            <select
                              style={{ fontSize: ".8rem" }}
                              className="form-control form-control-sm"
                              {...register(`formdata[0].HandlerL2`, {
                                required: "HandlerL2 is required.",
                              })}
                              aria-invalid={
                                errors.formdata?.[0].HandlerL2
                                  ? "true"
                                  : "false"
                              }
                            //   onChange={belongsto}
                            >
                              <option value="">Select HandlerL2</option>
                              {handlerBind
                                ? handlerBind.map((el) => {
                                  return (
                                    <option
                                      value={
                                        el.EmployeeName + "-" + el.EmployeeID
                                      }
                                      key={el._id}
                                    >
                                      {el.EmployeeName + "-" + el.EmployeeID}
                                    </option>
                                  );
                                })
                                : null}
                            </select>
                            <ErrorMessage
                              errors={errors}
                              name="formdata[0].HandlerL2"
                              render={({ message }) => (
                                <p style={{ color: "red", fontSize: "0.8rem" }}>
                                  {message}
                                </p>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          {/* text input */}
                          <div className="form-group">
                            <label style={{ fontSize: ".7rem" }}>
                              Belongs To
                            </label>
                            <select
                              style={{ fontSize: ".8rem" }}
                              className="form-control form-control-sm"
                              {...register(`formdata[0].issue`, {
                                required: "Issue is required.",
                              })}
                              aria-invalid={
                                errors.formdata?.[0].issue ? "true" : "false"
                              }
                              onChange={belongsto}
                            >
                              <option value="">Select Belongs To</option>
                              {getIssueBind
                                ? getIssueBind.map((el) => {
                                  return (
                                    <option value={el.issue} key={el._id}>
                                      {el.issue}
                                    </option>
                                  );
                                })
                                : null}
                            </select>
                            <ErrorMessage
                              errors={errors}
                              name="formdata[0].issue"
                              render={({ message }) => (
                                <p style={{ color: "red", fontSize: "0.8rem" }}>
                                  {message}
                                </p>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          {/* text input */}
                          <div className="form-group">
                            <label style={{ fontSize: ".7rem" }}>
                              Request Type
                            </label>
                            <select
                              style={{ fontSize: ".8rem" }}
                              className="form-control form-control-sm"
                              multiple
                              {...register(`formdata[0].subissue`, {
                                required: "Sub Issue is required.",
                              })}
                              aria-invalid={
                                errors.formdata?.[0].subissue ? "true" : "false"
                              }
                            //   onChange={belongsto}
                            >
                              {/* <option value="">Select Issue</option> */}
                              {subIssue
                                ? subIssue.map((el) => {
                                  return (
                                    <option key={el._id} value={el.subissue}>
                                      {el.subissue}
                                    </option>
                                  );
                                })
                                : null}
                            </select>
                            <ErrorMessage
                              errors={errors}
                              name="formdata[0].subissue"
                              render={({ message }) => (
                                <p style={{ color: "red", fontSize: "0.8rem" }}>
                                  {message}
                                </p>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group mt-4">
                            <button
                              type="submit"
                              style={{ fontSize: ".8rem" }}
                              className="btn btn-sm btn-primary mt-2"
                            >
                              Map
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div className="card mt-4">
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
}

export default ProcessHandlerMapping;
