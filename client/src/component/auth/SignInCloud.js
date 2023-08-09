import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { authenticate, isAuth } from "./helpers";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const url = `${process.env.REACT_APP_BACKEND_URL}`;
function SignInCloud() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  let navigate = useNavigate();

  const location = useLocation();

  // Access the query parameters from the location object
  const params = new URLSearchParams(location.search);

  // Get the value of a specific query parameter, e.g., "id"
  const employeeid = params.get("employeeid");
  const password = params.get("password");

  const headers = {
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (employeeid === null || password === null) {
      navigate("/");
    } else {
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
    }
  }, []);

  return <></>;
}

export default SignInCloud;
