import React, { lazy, Suspense, useState, useEffect } from "react";
// import HelpForm from "./component/HelpForm";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./component/auth/SignIn";
import SignInCloud from "./component/auth/SignInCloud";
import PrivateRoute from "./component/auth/PrivateRoute";
import PageNotFound from "./PageNotFound";
import { isAuth } from './component/auth/helpers'
import IssueMaster from "./component/issueAssignMaster/IssueMaster";
import SubIssueMaster from "./component/issueAssignMaster/SubIssueMaster";
import HandlerMaster from "./component/issueAssignMaster/HandlerMaster";
import { AppLoader } from "./component/AppLoader";
import Report from "./component/Report";
import AppLogout from "./component/auth/AppLogout";
import PageNotAccess from "./component/auth/PageNotAccess";
import IpWhitelist from "./component/auth/IpWhitelist";
const HelpForm = lazy(async () => await import("./component/HelpForm"));
const Dashboard = lazy(() => import("./component/Dashboard"));
const HandlersFormL2 = lazy(() => import("./component/HandlersFormL2"));
const HandlersForm = lazy(() => import("./component/HandlersForm"));
const RequestStatus = lazy(() => import("./component/RequestStatus"));
const ProcessHandlerMapping = lazy(() => import("./component/issueAssignMaster/ProcessHandlerMapping"));
const RosterAndBiometric = lazy(() => import("./component/RosterAndBiometric"));
const RosterAndBiometric1 = lazy(() => import("./component/RosterAndBiometric1"));
const RequesterHistory = lazy(() => import("./component/RequesterHistory"));

function Routees() {

  return (
    <Suspense fallback={<AppLoader />}>
      <BrowserRouter>
        <Routes>

          <Route path="/SignInCloud" element={<SignInCloud />} />
          {/* <Route element={<IpWhitelist />}> */}
          <Route path="/" element={<SignIn />} />
          {/* <Route path="/not-authorised" element={<PageNotAccess />} /> */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/request-form"
              element={
                <AppLogout>
                  <HelpForm />
                </AppLogout>
              }
            />
            {isAuth() && isAuth().flagHandlerL1 === 1 ? <Route path="/handlers-form" element={<HandlersForm />} /> : null}

            {isAuth() && isAuth().flagHandlerL2 === 1 ? <Route path="/handlers-form-l2" element={<HandlersFormL2 />} /> : null}
            {isAuth() && isAuth().flagAdmin === 1 ? <>
              <Route path="/master/issue-master" element={<IssueMaster />} />
              <Route
                path="/master/sub-issue-master"
                element={<SubIssueMaster />}
              />
              <Route path="/master/handler-master" element={<HandlerMaster />} />
              <Route
                path="/master/process-handler-mapping"
                element={<ProcessHandlerMapping />}
              />
            </> : null}
            <Route path="/request-status" element={<RequestStatus />} />
            {isAuth() && (isAuth().flagHandlerL2 === 1 || isAuth().flagHandlerL1 === 1) ? <> <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/get-report" element={<Report />} />
            </> : null}
            <Route
              path="/handlers-form/view-roaster1/:id1/:id2"
              element={<RosterAndBiometric />}
            />
            <Route
              path="/handlers-form/view-roaster/:id1/:id2"
              element={<RosterAndBiometric1 />}
            />
            <Route
              path="/requester-history/:id1"
              element={<RequesterHistory />}
            />
          </Route>
          {/* </Route> */}
          {/* </> : <Route path="/" element={<PageNotAccess />} />} */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default Routees;
