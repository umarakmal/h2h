const express = require("express");
const {
  raiseIssue,
  getRaiseIssue,
  getRaiseIssueById,
  updateRaiseIssueById,
  signin,
  newreq,
  createMasterIssue,
  getMasterIssue,
  getMasterIssueByID,
  updateMasterIssueById,
  AssignHandler,
  createSubIssue,
  updateSubIssue,
  getSubIssue,
  createMasterHandler,
  getMasterHandler,
  getMasterHandlerByID,
  updateMasterHandlerById,
  getProcess,
  getMasterIssueByName,
  createHandlerMapping,
  updateHandlerMappingById,
  getHandlerMappingByID,
  getHandlerMapping,
  getMasterHandlerActive,
  getMasterIssueActive,
  getMasterIssueByNameActive,
  getMasterSubIssue,
  getRaiseIssueForHandler2,
  getRaiseIssueRequesterStatus,
  updateRaiseIssueByIDRequester,
  updateRaiseIssueByIdL2,
  updateSubIssuesHandlerRemark,
  updateSubIssuesHandlerRemarkL2,
  updateSubIssuesHandlerPayoutDays,
  dashboardProcessCount,
  getReport,
  dashboardLocationCount,
  dashboardHandlerL1Count,
  dashboardHandlerL1SatisfiedCount,
  dashboardHandlerL1SatisfiedWithLocationCount,
  dashboardHandlerL1SatisfiedWithProcessCount,
  getRequestersHistory,
  getRoaster,
  checkremark,
  dashboardTotalCount, checkSameConcernDate, checkIpWhitelist,
  lockAtHandler2, findHandlerMappingNew, getParticularMappedDAta
} = require("../controller");
const router = express.Router();
//issue raise
router.post("/raise-issue", raiseIssue);
router.post("/get-raise-issue", getRaiseIssue);
router.post("/get-raise-issue-handler2", getRaiseIssueForHandler2);
router.post("/get-raise-issue-by-id", getRaiseIssueById);
router.put("/update-raise-issue-by-id", updateRaiseIssueById);
router.put(
  "/update-raise-issue-by-id-requesterstatus",
  updateRaiseIssueByIDRequester
);
router.post("/signin", signin);
router.post("/newreq", newreq);
router.post("/get-raise-issue-requester", getRaiseIssueRequesterStatus);
router.put("/update-raise-issue-handlerremark", updateSubIssuesHandlerRemark);
router.put(
  "/update-raise-issue-handlerremark-l2",
  updateSubIssuesHandlerRemarkL2
);
router.put("/update-raise-issue-payout-days", updateSubIssuesHandlerPayoutDays);
router.put("/assign-handler", AssignHandler);
router.post("/check-same-concerndate", checkSameConcernDate);
//issue
router.post("/create-master-issue", createMasterIssue);
router.post("/get-master-issue", getMasterIssue);
router.post("/get-master-issue-by-id", getMasterIssueByID);
router.put("/update-master-issue-by-id", updateMasterIssueById);
router.put("/update-master-issue-by-id-l2", updateRaiseIssueByIdL2);
router.post("/get-master-by-name", getMasterIssueByName);
router.post("/get-master-by-name-active", getMasterIssueByNameActive);
router.post("/get-master-issue-active", getMasterIssueActive);
//subissue
router.post("/create-master-sub-issue", createSubIssue);
router.put("/update-master-sub-issue", updateSubIssue);
router.post("/get-sub-issue", getSubIssue);
router.post("/get-master-sub-issue", getMasterSubIssue);

//Handler
router.post("/create-handler", createMasterHandler);
router.post("/get-master-handler", getMasterHandler);
router.post("/get-master-handler-by-id", getMasterHandlerByID);
router.put("/update-master-handler-by-id", updateMasterHandlerById);
router.post("/get-process", getProcess);
router.post("/get-master-handler-active", getMasterHandlerActive);
router.post("/lock-at-handler2", lockAtHandler2);
//handler Mapping
router.post("/create-handler-mapping", createHandlerMapping);
router.put("/update-handler-mapping", updateHandlerMappingById);
router.post("/get-handler-mapping-by-id", getHandlerMappingByID);
router.post("/get-handler-mapping", getHandlerMapping);
router.post("/find-handler-mapping", findHandlerMappingNew)
router.post("/get-particular-handler-mapping", getParticularMappedDAta)
//Report
router.post("/get-report", getReport);
//Dashboard
router.post("/dash-process-count", dashboardProcessCount);
router.post("/dash-location-count", dashboardLocationCount);
router.post("/dash-handler-l1-count", dashboardHandlerL1Count);
router.post(
  "/dash-handler-l1-satisfied-count",
  dashboardHandlerL1SatisfiedCount
);
router.post(
  "/dash-handler-l1-satisfied-location-count",
  dashboardHandlerL1SatisfiedWithLocationCount
);
router.post(
  "/dash-handler-l1-satisfied-process-count",
  dashboardHandlerL1SatisfiedWithProcessCount
);
router.post("/dashboard-total-count", dashboardTotalCount);
//History
router.post("/get-requesters-history", getRequestersHistory);
//Roaster
router.post("/get-roaster", getRoaster);
//For menu
router.post("/check-remark", checkremark);

module.exports = router;
