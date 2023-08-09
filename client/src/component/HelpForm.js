import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { ToastContainer, toast } from 'react-toastify';
import Menu from "../Menu";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { isAuth, getCookie, signout } from "./auth/helpers";
const url = `${process.env.REACT_APP_BACKEND_URL}`
const HelpForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getCookie('token'))
      signout(() => {
        navigate("/");
      })
  }, [navigate]);

  const initialConcern = { concernof: '', remark: '' };
  const [formData, setFormData] = useState({
    belongsTo: "",
    issue: "",
    communicated_with: "",
    requester_mobile_no: "",
    mobile_no: "",
    concerns: [initialConcern],
  });
  const [issue, setIssue] = useState([]);
  const [subIssue, setSubIssue] = useState([]);
  const [belongstoEr, setShowBelonstoEr] = useState(false);
  const [showIssueEr, setShowIssueEr] = useState(false);
  const [showCommunicatedNameEr, setShowCommunicatedNameEr] = useState(false);
  const [showCommunicateMobileEr, setShowCommunicateMobileEr] = useState(false);
  const [showReqMobileEr, setShowReqMobileEr] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorsRemark, setErrorsRemark] = useState([]);
  const maxConcerns = 4
  const handleInputChange = (index, field, value) => {
    const updatedConcerns = [...formData.concerns];
    updatedConcerns[index][field] = value;
    setFormData({
      ...formData,
      concerns: updatedConcerns,
    });
    setErrors([])
    setErrorsRemark([])
  };

  const handleAddConcern = () => {
    if (formData.concerns.length < maxConcerns) {
      setFormData({
        ...formData,
        concerns: [...formData.concerns, { ...initialConcern }],
      });
    }
  };

  const handleRemoveConcern = (index) => {
    if (index === 0) return;
    const updatedConcerns = formData.concerns.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      concerns: updatedConcerns,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Basic validation
    if (formData.belongsTo === '') {
      setShowBelonstoEr(true)
      return;
    } else if (formData.issue === '') {
      setShowIssueEr(true)
      return
    }
    else if (formData.communicated_with === '') {
      setShowCommunicatedNameEr(true)
      return
    }
    else if (formData.mobile_no === '') {
      setShowCommunicateMobileEr(true)
      return
    }
    else if (formData.requester_mobile_no === '') {
      setShowReqMobileEr(true)
      return
    } else {
      const concernsErrors = [];
      const concernRemarkErrors = [];
      for (let i = 0; i < formData.concerns.length; i++) {
        const concern = formData.concerns[i];
        if (concern.concernof === '') {
          concernsErrors[i] = 'Required';
        }
        if (concern.remark === "") {
          concernRemarkErrors[i] = 'Required';
        }
      }

      setErrors({
        concerns: concernsErrors,
      });
      setErrorsRemark({
        concerns: concernRemarkErrors,
      });
      if (concernsErrors.some((error) => error === 'Required')) {
        return;
      } else if (concernRemarkErrors.some((error) => error === 'Required')) {
        return
      }
      const requester_mobile_no = formData.requester_mobile_no
      const mobile_no = formData.mobile_no
      if (mobile_no.length < 10) {
        toast.error("Mobile number should be of 10 digits")
        return false
      } else if (requester_mobile_no.length < 10) {
        toast.error("Mobile number should be of 10 digits")
        return false
      } else {

        const belongsTo = formData.belongsTo
        const issue = formData.issue
        const concern = formData.concerns
        const communicated_with = formData.communicated_with
        const requestby = isAuth().result1.EmployeeID
        const AH = isAuth().result1.AH
        const Process = isAuth().result1.Process
        const location = isAuth().result1.location
        const name = isAuth().result1.EmployeeName
        const reportto = isAuth().result1.ReportTo
        const cm_id = isAuth().result1.cm_id
        const designation = isAuth().result1.designation
        const response = await fetch(`${url}/api/raise-issue`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ requester_mobile_no, issue, mobile_no, concern, belongsTo, requestby, communicated_with, AH, Process, name, reportto, location, designation, cm_id })
        });

        if (!response.ok) {
          toast.error('Error Occured')
        }

        await response.json();
        if (response.status === 200) {
          // Reset the form
          setFormData({
            belongsTo: "",
            issue: "",
            communicated_with: "",
            requester_mobile_no: "",
            mobile_no: "",
            concerns: [initialConcern],
          });
          setErrors([])
          setErrorsRemark([])
          toast.success("Request Raised!")
        }
      }
    }
  };

  function getOneMonthAgo() {
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return oneMonthAgo.toISOString().split("T")[0];
  }

  const issueChange = (e) => {
    setFormData({ ...formData, issue: e.target.value })
    setShowIssueEr(false)
  }
  const communicatedWithChange = (e) => {
    setFormData({ ...formData, communicated_with: e.target.value })
    setShowCommunicatedNameEr(false)
  }
  const communicatedWithMobileChange = (e) => {
    setFormData({ ...formData, mobile_no: e.target.value })
    setShowCommunicateMobileEr(false)
  }
  const requestMobileChange = (e) => {
    setFormData({ ...formData, requester_mobile_no: e.target.value })
    setShowReqMobileEr(false)
  }

  const belongsto = async (event) => {
    setFormData({ ...formData, belongsTo: event.target.value })
    setShowBelonstoEr(false)
    try {
      const belongsTo = event.target.value;
      const response = await fetch(`${url}/api/get-master-by-name-active`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ belongsTo })
      });

      if (!response.ok) {
        toast.error('Error Occured')
      }

      const data = await response.json();
      if (response.status === 200) {
        setSubIssue(data);
      }
    } catch (error) {
      toast.error("Error Occured")
    }
  };

  const getIssues = async (event) => {

    try {
      const response = await fetch(`${url}/api/get-master-issue-active`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        toast.error('Error Occured')
      }

      const data = await response.json();
      if (response.status === 200) {
        setIssue(data);
      }
    } catch (error) {
      toast.error("Error Occured")
    }
  };
  useEffect(() => {
    getIssues()
  }, [])
  return (
    <>
      <Header />
      <Menu />
      <ToastContainer />
      <div className="content-wrapper">
        <div className="content-header"></div>
        {/* /.content-header */}

        {/* Main content */}
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="card card-primary card-outline">
                  <div className="card-body">
                    <h5 className="card-title">Happy to Help</h5>
                    <br />
                    <hr />
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-sm-5">
                          {/* text input */}
                          <div className="form-group">
                            <label style={{ fontSize: ".7rem" }}>
                              Belongs To
                            </label>
                            <select
                              type="text"
                              style={{ fontSize: ".8rem" }}
                              className="form-control form-control-sm"
                              value={formData.belongsTo}
                              onChange={belongsto}
                            >
                              <option value="">Select Belongs To</option>
                              {issue ? issue.map((el) => {
                                return <option key={el._id}>{el.issue}</option>
                              }) : null}
                            </select>
                            {belongstoEr ? <span style={{ fontSize: '.7rem' }} className="text-danger">*Required</span> : null}
                          </div>
                        </div>
                        <div className="col-sm-5">
                          <div className="form-group">
                            <label style={{ fontSize: ".7rem" }}>Request Type</label>
                            <select
                              style={{ fontSize: ".8rem" }}
                              className="form-control form-control-sm"
                              value={formData.issue}
                              onChange={issueChange}
                            >
                              <option value="">Select Request Type</option>
                              {subIssue
                                ? subIssue.map((element) => {
                                  return (
                                    <option value={element.subissue} key={element._id}>
                                      {element.subissue}
                                    </option>
                                  );
                                })
                                : ""}
                            </select>
                            {showIssueEr ? <span style={{ fontSize: '.7rem' }} className="text-danger">*Required</span> : null}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-5">
                          {/* textarea */}
                          <div className="form-group">
                            <label style={{ fontSize: ".7rem" }}>
                              Communicated With
                            </label>
                            <input
                              style={{ fontSize: ".8rem" }}
                              type="text"
                              className="form-control form-control-sm form-control-border"
                              id="exampleInputBorder"
                              value={formData.communicated_with}
                              placeholder="Communicated With"
                              onChange={communicatedWithChange}
                            />
                            {showCommunicatedNameEr ? <span style={{ fontSize: '.7rem' }} className="text-danger">*Required</span> : null}
                          </div>
                        </div>
                        <div className="col-sm-5">
                          <div className="form-group">
                            <label style={{ fontSize: ".7rem" }}>
                              Communicated Mobile No
                            </label>
                            <input
                              style={{ fontSize: ".8rem" }}
                              type="text"
                              maxLength={"10"}
                              onInput={(event) => {
                                event.target.value = event.target.value.replace(/\D/, "");
                              }}
                              value={formData.mobile_no}
                              onChange={communicatedWithMobileChange}
                              className="form-control form-control-sm form-control-border"
                              id="exampleInputBorder"
                              placeholder="Communicated Mobile No"
                            />
                            {showCommunicateMobileEr ? <span style={{ fontSize: '.7rem' }} className="text-danger">*Required</span> : null}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-5">
                          <div className="form-group">
                            <label style={{ fontSize: ".7rem" }}>
                              Mobile No
                            </label>
                            <input
                              style={{ fontSize: ".8rem" }}
                              type="text"
                              maxLength={"10"}
                              onInput={(event) => {
                                event.target.value = event.target.value.replace(/\D/, "");
                              }}
                              className="form-control form-control-sm form-control-border"
                              id="exampleInputBorder"
                              placeholder="Mobile No"
                              value={formData.requester_mobile_no}
                              onChange={requestMobileChange}
                            />
                            {showReqMobileEr ? <span style={{ fontSize: '.7rem' }} className="text-danger">*Required</span> : null}
                          </div>
                        </div>
                      </div>
                      {formData.concerns.map((concern, index) => (
                        <div
                          className="card card-outline"
                          style={{ borderLeft: "2px solid  #007bff" }}
                          key={index}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-5">
                                {/* textarea */}
                                <div className="form-group">
                                  <label style={{ fontSize: ".7rem" }}>
                                    {index + 1}. Concern of
                                  </label>
                                  <input
                                    style={{ fontSize: ".8rem" }}
                                    type="date"
                                    max={new Date().toISOString().split("T")[0]}
                                    min={getOneMonthAgo()}
                                    value={concern.concernof}
                                    onChange={(e) => handleInputChange(index, 'concernof', e.target.value)}
                                    className="form-control form-control-sm form-control-border"
                                  />
                                  {errors.concerns && errors.concerns[index] === 'Required' && (
                                    <span style={{ fontSize: '.7rem' }} className="text-danger">*Required</span>
                                  )}
                                </div>
                              </div>
                              <div className="col-sm-5">
                                <div className="form-group">
                                  <label style={{ fontSize: ".7rem" }}>
                                    Remark
                                  </label>
                                  <textarea
                                    className="form-control form-control-sm form-control-border"
                                    style={{ height: "2rem", fontSize: ".8rem" }}
                                    placeholder="Remark"
                                    value={concern.remark}
                                    onChange={(e) => handleInputChange(index, 'remark', e.target.value)}
                                  />
                                  {errorsRemark.concerns && errorsRemark.concerns[index] === 'Required' && (
                                    <span style={{ fontSize: '.7rem' }} className="text-danger">*Required</span>
                                  )}
                                </div>
                              </div>
                              {index > 0 ? (
                                <div className="col-sm-2">
                                  <button
                                    type="button"
                                    style={{ fontSize: ".8rem", }}
                                    className="btn btn-sm btn-danger remove_btn mt-4"
                                    onClick={() => handleRemoveConcern(index)}
                                  >
                                    <i className="nav-icon fas fa-minus " />
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="row">
                        <div className="col">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            style={{ float: "right" }}
                            onClick={handleAddConcern}
                          >
                            <i
                              className="nav-icon fas fa-plus"
                              style={{ fontSize: ".8rem" }}
                            />{" "}
                            Add Concern
                          </button>
                        </div>
                      </div>
                      <div className="">
                        <button type="submit" style={{ fontSize: ".8rem" }} className="btn btn-sm btn-primary">
                          Request
                        </button>
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

export default HelpForm;
