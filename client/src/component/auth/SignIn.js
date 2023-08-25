import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { authenticate, isAuth } from "./helpers";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const url = `${process.env.REACT_APP_BACKEND_URL}`;
function SignIn() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  let navigate = useNavigate();

  // const [ip, setIP] = useState("");
  const [show, setShow] = useState(false)

  const getData = async (event) => {
    try {
      const response = await fetch(`${url}/ip`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        toast.error('Error Occured')
      }

      const data = await response.json();
      if (response.status === 200) {
        console.log(data);
        // setIP(data);
        if (data === 1) {
          setShow(true)
        }
      }
    } catch (error) {
      toast.error("Error Occured")
    }
  };

  // console.log(ip);
  useEffect(() => {
    getData();
  }, []);
  const onSubmit = async (data) => {
    var employeeid = data.employeeid;
    var password = data.password;

    axios({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${url}/api/signin`,
      data: { employeeid, password },
    })
      .then((response) => {
        // save the response (user, token) localstorage/cookie
        authenticate(response, () => {
          isAuth() ? navigate("/request-form") : navigate("/");
        });

        window.location.reload();
      })
      .catch((error) => {
        // if (error.response.status === 500) {
        //   console.log(error.response.status);
        toast.error("Invalid Credentials!");
        // }
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="login-page">
        <img src="images/logo3.png" alt="Logo" />
        <div className="login-box">
          <div className="login-logo"></div>
          {/* /.login-logo */}
          {show ? <>
            <div className="card">
              <div className="card-body login-card-body">
                <p className="login-box-msg">Sign in to start your session</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Employee ID"
                      {...register(`employeeid`, {
                        required: "Employee ID is required.",
                      })}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-id-card"></span>
                      </div>
                    </div>
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="employeeid"
                    render={({ message }) => (
                      <p style={{ color: "red", fontSize: "0.8rem" }}>
                        {message}
                      </p>
                    )}
                  />
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      {...register(`password`, {
                        required: "Password is required.",
                      })}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-lock"></span>
                      </div>
                    </div>
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="password"
                    render={({ message }) => (
                      <p style={{ color: "red", fontSize: "0.8rem" }}>
                        {message}
                      </p>
                    )}
                  />
                  <div className="row">
                    <div className="col-8"></div>
                    {/* /.col */}
                    <div className="col-4">
                      <button type="submit" className="btn btn-primary btn-block">
                        Sign In
                      </button>
                    </div>
                    {/* /.col */}
                  </div>
                </form>

                {/* /.social-auth-links */}
              </div>
              {/* /.login-card-body */}
            </div>
          </> : <center>
            <div className='text-muted mt-lg-5' >
              <h2>You are not authorised to access this.</h2>
            </div>
          </center>}
        </div>
      </div>
    </>
  );
}

export default SignIn;
