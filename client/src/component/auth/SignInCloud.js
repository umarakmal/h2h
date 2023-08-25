import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
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
