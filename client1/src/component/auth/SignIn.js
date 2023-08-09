import React from "react";
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
        // console.log(response.data.user.result1.EmployeeID);
        const getEmpCheck = async () => {
          try {
            const handler = await response.data.user.result1.EmployeeID;
            const response1 = await fetch(`${url}/api/get-handler-menu`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ handler }),
            });

            if (!response1.ok) {
              throw new Error("Request failed");
            }
            const data = await response1.json();
            if (response1.status === 200) {
              localStorage.setItem("handler1", data.length);
            }
          } catch (error) {}
        };
        const getEmpCheckL2 = async () => {
          try {
            const handler = await response.data.user.result1.EmployeeID;
            const response2 = await fetch(`${url}/api/get-handler-menu-l2`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ handler }),
            });

            if (!response2.ok) {
              throw new Error("Request failed");
            }
            const data1 = await response2.json();
            if (response2.status === 200) {
              localStorage.setItem("handler2", data1.length);
            }
          } catch (error) {}
        };
        getEmpCheck();
        getEmpCheckL2();
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
        </div>
      </div>
    </>
  );
}

export default SignIn;
