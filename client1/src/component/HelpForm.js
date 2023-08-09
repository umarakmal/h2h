import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Header from "../Header";
import Footer from "../Footer";
import { ErrorMessage } from "@hookform/error-message";
import { ToastContainer, toast } from 'react-toastify';
import Menu from "../Menu";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { isAuth, getCookie, signout } from "./auth/helpers";
const url = `${process.env.REACT_APP_BACKEND_URL}`
function HelpForm() {
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
          belongsTo: "",
          issue: "",
          concern: [{ concernof: "", remark: "" }],
          communicated_with: "",
          requester_mobile_no: "",
          mobile_no: "",
        },
      ],
    },
  });
  const navigate = useNavigate();
  const [issue, setIssue] = useState([]);
  const [subIssue, setSubIssue] = useState([]);

  useEffect(() => {
    if (!getCookie('token'))
      signout(() => {
        navigate("/");
      })
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formdata.[0].concern",
  });

  const onSubmit = async (data) => {

    try {
      const requester_mobile_no = data.formdata[0].requester_mobile_no
      const mobile_no = data.formdata[0].mobile_no
      const belongsTo = data.formdata[0].belongsTo
      const issue = data.formdata[0].issue
      const concern = data.formdata[0].concern
      const communicated_with = data.formdata[0].communicated_with
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
        // reset()
        reset({
          formdata: [
            {
              belongsTo: "",
              issue: "",
              concern: [{ concernof: "", remark: "" }
              ],
              communicated_with: "",
              requester_mobile_no: "",
              mobile_no: "",
            }
          ]
        });
        toast.success("Request Raised!")
      }
    } catch (error) {
      toast.error("Error Occured!")
    }
  };

  const belongsto = async (event) => {
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
      setError(error.message);
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
      setError(error.message);
    }
  };
  useEffect(() => {
    getIssues()
  }, [])

  function getOneMonthAgo() {
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return oneMonthAgo.toISOString().split("T")[0];
  }

  return (
    <>
      <Header />
      <Menu />
      <ToastContainer />
      <div className="content-wrapper" >
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
                    <h5 className="card-title">Happy to Help</h5>
                    <br />
                    <hr />
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row">
                        <div className="col-sm-5">
                          {/* text input */}
                          <div className="form-group">
                            <label style={{ fontSize: ".7rem" }}>
                              Belongs To
                            </label>
                            <select
                              style={{ fontSize: ".8rem" }}
                              className="form-control form-control-sm"
                              {...register(`formdata[0].belongsTo`, {
                                required: "Belongs To is required.",
                              })}
                              aria-invalid={
                                errors.formdata?.[0].belongsTo
                                  ? "true"
                                  : "false"
                              }
                              onChange={belongsto}
                            >
                              <option value="">Select Belongs To</option>
                              {issue ? issue.map((el) => {
                                return <option key={el._id}>{el.issue}</option>
                              }) : null}
                            </select>
                            <ErrorMessage
                              errors={errors}
                              name="formdata[0].belongsTo"
                              render={({ message }) => (
                                <p style={{ color: "red", fontSize: "0.8rem" }}>
                                  {message}
                                </p>
                              )}
                            />

                          </div>
                        </div>
                        <div className="col-sm-5">
                          <div className="form-group">
                            <label style={{ fontSize: ".7rem" }}>Request Type</label>
                            <select
                              style={{ fontSize: ".8rem" }}
                              className="form-control form-control-sm"
                              {...register(`formdata[0].issue`, {
                                required: "Issue is required.",
                              })}
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
                              placeholder="Communicated With"
                              {...register(`formdata[0].communicated_with`, {
                                required: "Communicated With is required.",
                              })}
                              aria-invalid={
                                errors.communicated_with ? "true" : "false"
                              }
                            />
                            <ErrorMessage
                              errors={errors}
                              name="formdata[0].communicated_with"
                              render={({ message }) => (
                                <p style={{ color: "red", fontSize: "0.8rem" }}>
                                  {message}
                                </p>
                              )}
                            />
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
                              className="form-control form-control-sm form-control-border"
                              id="exampleInputBorder"
                              placeholder="Communicated Mobile No"
                              {...register(`formdata[0].mobile_no`, {
                                required: "Mobile No  is required.",
                              })}
                            />
                            <ErrorMessage
                              errors={errors}
                              name="formdata[0].mobile_no"
                              render={({ message }) => (
                                <p style={{ color: "red", fontSize: "0.8rem" }}>
                                  {message}
                                </p>
                              )}
                            />
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
                              {...register(`formdata[0].requester_mobile_no`, {
                                required: "Mobile No  is required.",
                              })}
                            />
                            <ErrorMessage
                              errors={errors}
                              name="formdata[0].requester_mobile_no"
                              render={({ message }) => (
                                <p style={{ color: "red", fontSize: "0.8rem" }}>
                                  {message}
                                </p>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      {fields.map((item, index) => (
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
                                    className="form-control form-control-sm form-control-border"
                                    {...register(
                                      `formdata[0].concern[${index}].concernof`,
                                      { required: "Concern of is required." }
                                    )}
                                  />

                                  {errors.formdata?.[0].concern[index] && errors.formdata?.[0].concern[index].concernof && (
                                    <p style={{ color: "red", fontSize: "0.8rem" }} role="alert">Concern of is required</p>
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
                                    {...register(
                                      `formdata[0].concern[${index}].remark`,
                                      { required: "Remark  is required." }
                                    )}
                                  />
                                  {errors.formdata?.[0].concern[index] && errors.formdata?.[0].concern[index].remark && (
                                    <p style={{ color: "red", fontSize: "0.8rem" }} role="alert">Remark is required</p>
                                  )}
                                </div>
                              </div>
                              {index > 0 ? (
                                <div className="col-sm-2">
                                  <button
                                    type="button"
                                    style={{ fontSize: ".8rem", }}
                                    className="btn btn-sm btn-danger remove_btn mt-4"
                                    onClick={() => remove(index)}
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
                            onClick={() => append()}
                          >
                            <i
                              className="nav-icon fas fa-plus"
                              style={{ fontSize: ".8rem" }}
                            />{" "}
                            Add Concern
                          </button>
                        </div>
                      </div>
                      <br />
                      <div className="">
                        <button type="submit" style={{ fontSize: ".8rem" }} className="btn btn-sm btn-primary">
                          Request
                        </button>
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
}

export default HelpForm;
