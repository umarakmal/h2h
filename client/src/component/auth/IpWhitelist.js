import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, Outlet } from 'react-router-dom';

const IpWhitelist = () => {
  const [ip, setIP] = useState("");
  const ipAddresses = ['61.12.86.105', '182.75.225.83']
  const getData = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    console.log(res.data);
    setIP(res.data.ip);
  };
  console.log(ip);
  let flag = 0
  ipAddresses.map((el) => {
    if (el === ip) {
      flag = 1
    }
  })
  console.log(flag);
  useEffect(() => {
    //passing getData method to the lifecycle method
    getData();
  }, []);

  return flag !== 1 ? <Navigate to="/not-authorised" /> : <Navigate to="/" />;
};

export default IpWhitelist;