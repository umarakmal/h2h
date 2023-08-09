const Issue_Tracker = require("../models/issueTracker");
const Issue_Master = require("../models/issueMaster");
const Handler_Master = require("../models/handlerMaster");
const HandlerMapping = require("../models/handlerMapping");
const Email_Log = require("../models/emailLog");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const api = `${process.env.EMS_API}`;
const demo_api = `${process.env.DEMO_API}`;

async function mail(req, id, locationName) {
  var final_remark = "";
  req.body.concern.forEach((concern) => {
    final_remark += "<li>" + concern.remark + "</li>";
  });

  const { location } = req.body;
  const maillist = await axios.get(`${demo_api}/QMS/GetMailIdByLoc.php`, {
    params: {
      loc: location,
    },
  });

  const issue_tracker_info = await axios.get(
    `${demo_api}/QMS/GetInfoForIssueTrackerByEmpId.php`,
    {
      params: {
        createdby: req.body.requestby,
      },
    }
  );

  var maillist_to = new Array();
  var maillist_cc = new Array();

  maillist.data.forEach((mail) => {
    maillist_to.push(mail.email_address);
    maillist_cc.push(mail.ccemail);
  });

  // console.log(maillist.data);
  // console.log("maillist_to");
  // console.log(maillist_to);
  // console.log(maillist_cc);
  // console.log("maillist_cc");

  try {
    let transporter = nodemailer.createTransport({
      host: "mail.cogenteservices.in",
      port: 465,
      secure: true,
      auth: {
        user: "ems@cogenteservices.in",
        pass: "cogentems@123",
        // ⚠️ Use environment variables set on the server for these values when deploying
      },
    });
    // Verify the connection
    transporter.verify(function (error, success) {
      if (error) {
        console.log("Error connecting to email server:", error);
      } else {
        console.log("Email server connection is successful.");
      }
    });

    const refID_id = id.toString();
    const Subject = `Happy to help ${locationName}, Reference # ${refID_id}`;
    const Body = `<span>Dear Sir,<br/><br/><span><b>Please find below the concern raised in happy to help.</b></span><br /><br/> <b>Concern Subject:</b> ${req.body.issue
      }<br /><br /><b>Concern:</b><ul>${final_remark}</ul><br/><br/><br/> Thank You</b>.<br/>Regard,<br/>${req.body.name.toUpperCase()}(<b>&nbsp;${req.body.requestby
      } &nbsp;</b>)<br/><b>Designation &nbsp;:&nbsp;</b>${req.body.designation.toUpperCase()}<br/><b>Client &nbsp;:&nbsp;</b>${issue_tracker_info.data[0].client_name
      } <br/><b>Process &nbsp;:&nbsp;</b>${issue_tracker_info.data[0].Process
      }  &nbsp;|&nbsp; ${issue_tracker_info.data[0].sub_process
      } &nbsp;<br /><b>Account Head &nbsp;:&nbsp;</b>${issue_tracker_info.data[0].AccountHead
      } <br /><b>Report To &nbsp;:&nbsp;</b>${issue_tracker_info.data[0].ReportTo
      } <br />`;
    await transporter.sendMail(
      {
        from: {
          name: "EMS:Cogent Employee Management System", // Formatted sender name
          address: "ems@cogenteservices.in",
        },
        to: ["sahil.bhalla@cogenteservices.com"], // Mails to array of recipients //mailist
        subject: Subject,
        html: Body,
      },
      async (error, info) => {
        if (error) {
          // Handle the error here
          const response =
            "Error sending email: " +
            error.response +
            " - " +
            error.responseCode +
            " - " +
            error.rejected;

          const module = "Happy to Help : Add Issue";
          const mail_response = new Email_Log({
            EmployeeID: req.body.requestby,
            module_name: module,
            log_message: response,
          });
          await mail_response.save();
        } else {
          const module = "Happy to Help : Add Issue";
          const response = "Email Send successfully.";
          const mail_response = new Email_Log({
            EmployeeID: req.body.requestby,
            module_name: module,
            log_message: response,
          });
          await mail_response.save();
          console.log("Email sent:", info.response);
          // Handle success here
        }
      }
    );
  } catch (err) {
    console.log(err); // Array of unsuccessful emails
  }
}

exports.raiseIssue = async (req, res) => {
  try {
    var cm_id = req.body.cm_id;
    var subissue = req.body.issue;
    var getCaseid = await Issue_Tracker.find();

    var location = req.body.location;

    if (location === "1") {
      location = "Noida";
    } else if (location === "2") {
      location === "Mumbai";
    } else if (location === "3") {
      location === "Meerut";
    } else if (location === "4") {
      location === "Bareilly";
    } else if (location === "5") {
      location === "Vadodara";
    } else if (location === "6") {
      location === "Mangalore";
    } else if (location === "7") {
      location === "Bangalore";
    } else if (location === "8") {
      location === "Nashik";
    } else if (location === "9") {
      location === "Anantapur";
    }
    const caseId = getCaseid.length + 1;
    if (getCaseid) {
      const newIssue = new Issue_Tracker({
        requestby: req.body.requestby,
        belongsTo: req.body.belongsTo,
        issue: subissue,
        concern: req.body.concern,
        communicated_with: req.body.communicated_with,
        mobile_no: req.body.mobile_no,
        requester_mobile_no: req.body.requester_mobile_no,
        AH: req.body.AH,
        Process: req.body.Process,
        name: req.body.name,
        location: location,
        reportto: req.body.reportto,
        caseId: caseId,
        cm_id: cm_id,
      });
      // Save the new issue to the database
      const result = await newIssue.save();
      mail(req, result._id, location);
    }
    return res.status(200).json("success");
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getRaiseIssue = async (req, res) => {
  try {
    const handlerL1 = req.body.handlerL1;
    const resultMap = await HandlerMapping.aggregate([
      {
        $match: {
          HandlerL1: handlerL1,
          status: "active",
        },
      },
      {
        $group: {
          _id: "$cm_id",
          belongsto: {
            $addToSet: "$issue",
          },
          issue: {
            $addToSet: "$subissue",
          },
        },
      },
      {
        $lookup: {
          from: "issue_trackers",
          let: {
            belongsto: "$belongsto",
            issue: "$issue",
          },
          localField: "_id",
          foreignField: "cm_id",
          as: "result",
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$belongsTo", "$$belongsto"],
                },
                $expr: {
                  $in: ["$issue", "$$issue"],
                },
                status: {
                  $nin: ["Resolved", "Close"],
                },
                $or: [
                  {
                    HandlerL1: handlerL1,
                  },
                  {
                    HandlerL1: "",
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$result",
        },
      },
      {
        $unwind: {
          path: "$result",
        },
      },
      {
        $project: {
          result: 1,
          _id: 0,
        },
      },
    ]);
    return res.status(200).json(resultMap);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.AssignHandler = async (req, res) => {
  try {
    const id = req.body.id;
    const HandlerL1 = req.body.HandlerL1;
    const HandlerL1Name = req.body.HandlerL1Name;
    const existingIssue = await Issue_Tracker.findById(id);
    const document = await Issue_Tracker.findOne({ _id: id });
    if (document) {
      // Check if the 'remark' field is not empty in the 'concern' array
      const hasRemark = document.concern.filter(
        (concern) => concern.handlerL1remark !== ""
      );
      if (hasRemark.length > 0) {
        return res.status(201).json("Assigned");
      }
    }
    if (existingIssue.status === "Pending") {
      const result = await Issue_Tracker.findByIdAndUpdate(
        id,
        {
          HandlerL1,
          HandlerL1Name,
        },
        {
          useFindAndModify: false,
        }
      );
      return res.status(200).json(result);
    } else {
      return res.status(200).json("Already Assigned");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getRaiseIssueForHandler2 = async (req, res) => {
  try {
    const EmployeeID = req.body.EmployeeID;
    const result = await HandlerMapping.aggregate([
      {
        $match: {
          HandlerL2: EmployeeID,
          status: "active",
        },
      },
      {
        $group: {
          _id: "$cm_id",
          belongsto: {
            $addToSet: "$issue",
          },
          issue: {
            $addToSet: "$subissue",
          },
        },
      },
      {
        $lookup: {
          from: "issue_trackers",
          let: {
            belongsto: "$belongsto",
            issue: "$issue",
          },
          localField: "_id",
          foreignField: "cm_id",
          as: "result",
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$belongsTo", "$$belongsto"],
                },
                $expr: {
                  $in: ["$issue", "$$issue"],
                },
                status: {
                  $nin: ["Resolved", "Close"],
                },
                flag: 1,
                $or: [
                  {
                    HandlerL2: EmployeeID,
                  },
                  {
                    HandlerL2: "",
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$result",
        },
      },
      {
        $project: {
          result: 1,
          _id: 0,
        },
      },
    ]);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getRaiseIssueById = async (req, res) => {
  try {
    const id = req.body.id;
    // Save the new issue to the database
    const result = await Issue_Tracker.findById(id);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateRaiseIssueById = async (req, res) => {
  try {
    const id = req.body.id;
    const status = req.body.status;
    var referred_Remark = "";
    var flag = 0;
    let referredDate;
    if (status === "Refer To L2") {
      flag = 1;
      referred_Remark = req.body.referred_Remark;
      referredDate = Date.now();
    }

    const result = await Issue_Tracker.findByIdAndUpdate(id, {
      $set: {
        status: status,
        referred_Remark: referred_Remark,
        flag: flag,
        referredDate: referredDate,
      },
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateRaiseIssueByIdL2 = async (req, res) => {
  try {
    const id = req.body.id;
    const status = req.body.status;
    var cm_id = req.body.cm_id;
    var subissue = req.body.subissue;
    const dataAssign = await HandlerMapping.find({
      status: "active",
      cm_id: cm_id,
      subissue: subissue,
    });
    const flag = 1;
    if (dataAssign.length > 0) {
      var HandlerL2 = dataAssign[0].HandlerL2;
      var HandlerL2Name = dataAssign[0].HandlerL2Name;
      // Save the new issue to the database
      const result = await Issue_Tracker.findByIdAndUpdate(
        id,
        {
          status,
          HandlerL2,
          flag,
          HandlerL2Name,
        },
        {
          useFindAndModify: false,
        }
      );
      return res.status(200).json(result);
    } else {
      // Save the new issue to the database
      const result = await Issue_Tracker.findByIdAndUpdate(
        id,
        {
          status,
          flag,
        },
        {
          useFindAndModify: false,
        }
      );
      return res.status(200).json(result);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateRaiseIssueByIDRequester = async (req, res) => {
  try {
    const id = req.body.id;
    //Date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;

    // const date = (new Date().toLocaleDateString())
    const RequestersRemark = formattedDate + " - " + req.body.RequestersRemark;
    const RequestersFeedback = req.body.feedback;
    const requester_feedback_date = Date.now();
    const requesterStatus = req.body.requesterStatus;
    if (requesterStatus === "Re-Open") {
      const status = "Re-Open";
      const result = await Issue_Tracker.findByIdAndUpdate(
        id,
        {
          RequestersRemark,
          RequestersFeedback,
          requester_feedback_date,
          requesterStatus,
          status,
        },
        {
          useFindAndModify: false,
        }
      );
      return res.status(200).json(result);
    } else {
      const status = "Close";
      const result = await Issue_Tracker.findByIdAndUpdate(
        id,
        {
          RequestersRemark,
          RequestersFeedback,
          requester_feedback_date,
          requesterStatus,
          status,
        },
        {
          useFindAndModify: false,
        }
      );
      return res.status(200).json(result);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.signin = async (req, res) => {
  try {
    const { employeeid, password } = req.body;
    // Save the new issue to the database

    const result = await axios.get(`${demo_api}/Get_Login.php`, {
      params: {
        LoginId: employeeid,
        refrance: password,
      },
    });

    const id = result.data[0].EmployeeID;
    const result1 = result.data[0];
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token, user: { result1 } });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.newreq = async (req, res) => {
  try {
    const result = await Issue_Master.aggregate([
      {
        $match: {
          belongsto: req.body.belongs_to,
        },
      },
    ]);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.createMasterIssue = async (req, res) => {
  try {
    const newIssue = new Issue_Master({
      issue: req.body.issue,
      subIssue: req.body.subIssue,
    });
    // Save the new issue to the database
    const result = await newIssue.save();
    return res.status(200).json("success");
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getMasterIssue = async (req, res) => {
  try {
    const issues = await Issue_Master.find();
    return res.status(200).json(issues);
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.getMasterIssueActive = async (req, res) => {
  try {
    const issues = await Issue_Master.find({ status: "active" });
    return res.status(200).json(issues);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getMasterIssueByID = async (req, res) => {
  try {
    const id = req.body.id;
    const issues = await Issue_Master.findById(id);
    return res.status(200).json(issues);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateMasterIssueById = async (req, res) => {
  try {
    const id = req.body.id;
    const issue = req.body.issue;
    const status = req.body.status;
    // Save the new issue to the database
    const result = await Issue_Master.findByIdAndUpdate(
      id,
      {
        issue,
        status,
      },
      {
        useFindAndModify: false,
      }
    );
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Function to validate 'id'
function isValidId(id) {
  // Check if 'id' is a string of 12 bytes or 24 hex characters or an integer
  return (
    typeof id === "string" &&
    (id.length === 12 || id.length === 24) &&
    /^[0-9a-fA-F]+$/.test(id)
  );
}
exports.createSubIssue = async (req, res) => {
  try {
    const id = req.body.id;
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const validIssue = await Issue_Master.findOne({ _id: id });
    if (!validIssue) {
      return res.status(404).json({
        message: "No data found with the given id.",
      });
    }
    const subissue = req.body.subissue;
    const matchedSubissues = validIssue.subIssue.filter(
      (sub) => sub.subissue === subissue
    );
    if (matchedSubissues.length === 0) {
      const newSubIssue = {
        subissue: subissue,
        status: req.body.status,
      };

      const data = await Issue_Master.findOneAndUpdate(
        { _id: id },
        { $addToSet: { subIssue: newSubIssue } },
        { new: true }
      );
      return res.status(200).json(data);
    } else {
      return res.status(400).json({ error: "SubIssue Exists" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateSubIssue = async (req, res) => {
  try {
    const id = req.body.id;
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const status = req.body.status;
    const subissue = req.body.subIssue;
    const subIssueId = req.body.subIssueId;
    const data = await Issue_Master.updateOne(
      { _id: id, "subIssue._id": subIssueId },
      {
        $set: {
          "subIssue.$.status": status,
          "subIssue.$.subissue": subissue,
        },
      }
    );
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).send({
      message: "Error updating",
    });
  }
};

exports.updateSubIssuesHandlerRemark = async (req, res) => {
  try {
    const id = req.body.id;
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const handlerL1remark = req.body.handlerL1remark;
    const subIssueId = req.body.subIssueId;
    const handlerL1Date = Date.now();

    const data = await Issue_Tracker.updateOne(
      { _id: id, "concern._id": subIssueId },
      {
        $set: {
          "concern.$.handlerL1remark": handlerL1remark,
          "concern.$.handlerL1Date": handlerL1Date,
        },
      }
    );
    const document = await Issue_Tracker.findOne({ _id: id });
    if (document) {
      // Check if the 'remark' field is not empty in the 'concern' array
      const hasRemark = document.concern.filter(
        (concern) => concern.handlerL1remark !== ""
      );
      if (hasRemark.length === document.concern.length) {
        const updateValue = { $set: { checkRemarkHandler1: 1 } };
        await Issue_Tracker.updateOne({ _id: document._id }, updateValue);
        return res.status(200).json("Success");
      }
    }
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).send({
      message: "Error updating sub-issues",
    });
  }
};

exports.updateSubIssuesHandlerRemarkL2 = async (req, res) => {
  try {
    const id = req.body.id;
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const handlerL2remark = req.body.handlerL2remark;
    const subIssueId = req.body.subIssueId;
    const handlerL2Date = Date.now();

    const data = await Issue_Tracker.updateOne(
      { _id: id, "concern._id": subIssueId },
      {
        $set: {
          "concern.$.handlerL2remark": handlerL2remark,
          "concern.$.handlerL2Date": handlerL2Date,
        },
      }
    );
    if (data) {
      const document = await Issue_Tracker.findOne({ _id: id });
      // console.log(document);
      if (document) {
        // Check if the 'remark' field is not empty in the 'concern' array
        const hasRemark = document.concern.filter(
          (concern) => concern.handlerL2remark !== ""
        );
        if (hasRemark.length === document.concern.length) {
          const updateValue = { $set: { checkRemarkHandler2: 1 } };
          await Issue_Tracker.updateOne({ _id: document._id }, updateValue);
          return res.status(200).json("Success");
        }
      }
    }
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).send({
      message: "Error updating sub-issues",
    });
  }
};
exports.updateSubIssuesHandlerPayoutDays = async (req, res) => {
  try {
    const id = req.body.id;
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const payoutDays = req.body.payoutDays;
    const payoutid = req.body.payoutid;
    const payoutInput = req.body.payoutInput;
    const data = await Issue_Tracker.updateOne(
      { _id: id, "concern._id": payoutid },
      {
        $set: {
          "concern.$.payoutDays": payoutDays,
          "concern.$.payoutType": payoutInput,
        },
      }
    );
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).send({
      message: "Error updating sub-issues",
    });
  }
};

exports.getSubIssue = async (req, res) => {
  try {
    const id = req.body.id;
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const data = await Issue_Master.find(
      { _id: id, "subIssue.status": "active" },
      { "subIssue.$": 1 }
    );

    return res.status(200).json(data);
  } catch (err) {
    res.status(500).send({
      message: "Error",
    });
  }
};

exports.createMasterHandler = async (req, res) => {
  try {
    const EmployeeID = req.body.EmployeeID;
    const newHandler = new Handler_Master({
      EmployeeID: EmployeeID,
      EmployeeName: req.body.EmployeeName,
      status: req.body.status,
    });
    // Save the new issue to the database
    const result = await newHandler.save();
    return res.status(200).json("success");
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getMasterHandler = async (req, res) => {
  try {
    const handler = await Handler_Master.find();
    return res.status(200).json(handler);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getMasterHandlerByID = async (req, res) => {
  try {
    const id = req.body.id;
    const handler = await Handler_Master.findById(id);
    return res.status(200).json(handler);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateMasterHandlerById = async (req, res) => {
  try {
    const id = req.body.id;
    const EmployeeID = req.body.EmployeeID;
    const EmployeeName = req.body.EmployeeName;
    const status = req.body.status;
    // Save the new EmployeeID to the database
    const result = await Handler_Master.findByIdAndUpdate(
      id,
      {
        EmployeeID,
        status,
        EmployeeName,
      },
      {
        useFindAndModify: false,
      }
    );
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getProcess = async (req, res) => {
  try {
    const Empid = "CE10091236";
    const result = await axios.get(`${api}/Services/h2h/Get_Process.php`);
    if (result.status === 200) {
      return res.status(200).json(result.data);
    } else {
      return res.status(401).json("No Data");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getMasterIssueByName = async (req, res) => {
  try {
    const issue = req.body.belongsTo;
    const issues = await Issue_Master.aggregate([
      {
        $match: {
          issue: issue,
        },
      },
    ]);
    return res.status(200).json(issues);
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.getMasterIssueByNameActive = async (req, res) => {
  try {
    const issue = req.body.belongsTo;
    const issues = await Issue_Master.aggregate([
      {
        $match: {
          issue: issue,
        },
      },
      {
        $unwind: {
          path: "$subIssue",
        },
      },
      {
        $match: {
          "subIssue.status": "active",
        },
      },
      {
        $project: {
          _id: "$subIssue._id",
          subissue: "$subIssue.subissue",
        },
      },
    ]);
    return res.status(200).json(issues);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getMasterSubIssue = async (req, res) => {
  try {
    const issue = req.body.belongsTo;
    const subissue = req.body.subissue;
    const issues = await Issue_Master.aggregate([
      {
        $match: {
          issue: issue,
        },
      },
      {
        $unwind: {
          path: "$subIssue",
        },
      },
      {
        $match: {
          "subIssue.subissue": subissue,
        },
      },
      {
        $project: {
          _id: "$subIssue._id",
          subissue: "$subIssue.subissue",
          status: "$subIssue.status",
        },
      },
    ]);
    return res.status(200).json(issues);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.createHandlerMapping = async (req, res) => {
  try {
    const { HandlerL1, HandlerL2, cm_id, issue, subissue, delId } = req.body;
    if (delId) {
      await HandlerMapping.deleteMany({ _id: { $in: delId } });
      // Check if a handler mapping with the same values already exists
      const existingHandler = await HandlerMapping.findOne({
        HandlerL1,
        cm_id,
        issue,
        subissue
      });
      if (existingHandler) {
        return res.status(422).json("Already Exists")
      } else {
        const newHandler = new HandlerMapping({
          process: req.body.Process,
          cm_id: cm_id,
          HandlerL2: HandlerL2,
          HandlerL2Name: req.body.HandlerL2Name,
          HandlerL1: HandlerL1,
          HandlerL1Name: req.body.HandlerL1Name,
          issue: issue,
          subissue: subissue,
          status: req.body.status,
        });
        // Save the new handler mappping to the database
        const result = await newHandler.save();
        return res.status(200).json("success")
      }
    } else {
      // Check if a handler mapping with the same values already exists
      const existingHandler = await HandlerMapping.findOne({
        HandlerL1,
        cm_id,
        issue,
        subissue
      });
      if (existingHandler) {
        return res.status(422).json("Already Exists")
      } else {
        const newHandler = new HandlerMapping({
          process: req.body.process,
          cm_id: cm_id,
          HandlerL2: HandlerL2,
          HandlerL2Name: req.body.HandlerL2Name,
          HandlerL1: HandlerL1,
          HandlerL1Name: req.body.HandlerL1Name,
          issue: issue,
          subissue: subissue,
          status: req.body.status,
        });
        // Save the new handler mappping to the database
        const result = await newHandler.save();
        return res.status(200).json("success")
      }
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getHandlerMapping = async (req, res) => {
  try {
    const handlerData = await HandlerMapping.find();
    return res.status(200).json(handlerData);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateHandlerMappingById = async (req, res) => {
  try {
    const id = req.body.id;
    const HandlerL2 = req.body.HandlerL2;
    const HandlerL1 = req.body.HandlerL1;
    const HandlerL2Name = req.body.HandlerL2Name;
    const HandlerL1Name = req.body.HandlerL1Name;
    const issue = req.body.issue;
    const status = req.body.status;
    const subissue = req.body.subissue;
    const process = req.body.Process;
    const cm_id = req.body.cm_id;
    // Save the new HandlerL2 to the database
    const result = await HandlerMapping.findByIdAndUpdate(
      id,
      {
        HandlerL2,
        HandlerL1,
        HandlerL2Name,
        HandlerL1Name,
        status,
        issue,
        subissue,
        process,
        cm_id,
      },
      {
        useFindAndModify: false,
      }
    );
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getHandlerMappingByID = async (req, res) => {
  try {
    const id = req.body.id;
    const handler = await HandlerMapping.findById(id);
    return res.status(200).json(handler);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getMasterHandlerActive = async (req, res) => {
  try {
    const handler = await Handler_Master.find({ status: "active" });
    return res.status(200).json(handler);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getRaiseIssueRequesterStatus = async (req, res) => {
  try {
    const requestby = req.body.requestby;
    // Save the new issue to the database
    const result = await Issue_Tracker.find({ requestby: requestby });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getReport = async (req, res) => {
  try {
    var date1 = req.body.date1;
    var date2 = req.body.date2;
    // Save the new issue to the database
    const result = await Issue_Tracker.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(date1),
            $lte: new Date(date2),
          },
        },
      },
      {
        $unwind: {
          path: "$concern",
        },
      },
      {
        $project: {
          _id: "$concern._id",
          caseId: 1,
          HandlerL1: 1,
          HandlerL1Name: 1,
          HandlerL2: 1,
          HandlerL2Name: 1,
          reportto: 1,
          AH: 1,
          name: 1,
          requestby: 1,
          location: 1,
          Process: 1,
          cm_id: 1,
          belongsTo: 1,
          issue: 1,
          RequestersFeedback: 1,
          RequestersRemark: 1,
          requesterStatus: 1,
          communicated_with: 1,
          mobile_no: 1,
          status: 1,
          requester_feedback_date: 1,
          createdAt: 1,
          concernDate: "$concern.concernof",
          concern: "$concern.remark",
          payoutDays: "$concern.payoutDays",
          payoutType: "$concern.payoutType",
          handlerL2Remark: "$concern.handlerL2remark",
          handlerL2RemarkDate: "$concern.handlerL2Date",
          handlerL1Remark: "$concern.handlerL1remark",
          handlerL1RemarkDate: "$concern.handlerL1Date",
        },
      },
      {
        $sort: {
          caseId: 1,
        },
      },
    ]);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

function getLastDateOfMonth(dateString) {
  const dateObject = new Date(dateString);
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1;
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
    lastDayOfMonth
  ).padStart(2, "0")}`;
  return formattedDate;
}

function replaceDateWith01(dateString) {
  const dateObject = new Date(dateString);
  dateObject.setDate(1);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

exports.dashboardProcessCount = async (req, res) => {
  try {
    const date = req.body.date;
    const lastDate = getLastDateOfMonth(date);
    const firstDate = replaceDateWith01(date);
    if (date) {
      const result = await Issue_Tracker.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(firstDate),
              $lte: new Date(lastDate),
            },
          },
        },
        {
          $group: {
            _id: {
              cm_id: "$cm_id",
            },
            totalAssigned: {
              $sum: 1,
            },
            close_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Close"],
                  },
                  1,
                  0,
                ],
              },
            },
            pending_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Pending"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL1_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L1"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL2_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L2"],
                  },
                  1,
                  0,
                ],
              },
            },
            refer_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Refer To L2"],
                  },
                  1,
                  0,
                ],
              },
            },
            reopen_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Re-Open"],
                  },
                  1,
                  0,
                ],
              },
            },
            resolved_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Resolved"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
            process: {
              $first: "$Process",
            },
          },
        },
        {
          $project: {
            _id: "$id",
            cm_id: "$_id.cm_id",
            pending: "$pending_count",
            inprogressL1: "$progressL1_count",
            inprogressL2: "$progressL2_count",
            close: "$close_count",
            refer_count: "$refer_count",
            reopen_count: "$reopen_count",
            resolved_count: "$resolved_count",
            totalAssigned: "$totalAssigned",
            process: 1,
          },
        },
      ]);
      return res.status(200).json(result);
    } else {
      const result = await Issue_Tracker.aggregate([
        {
          $group: {
            _id: {
              cm_id: "$cm_id",
            },
            totalAssigned: {
              $sum: 1,
            },
            close_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Close"],
                  },
                  1,
                  0,
                ],
              },
            },
            pending_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Pending"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL1_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L1"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL2_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L2"],
                  },
                  1,
                  0,
                ],
              },
            },
            refer_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Refer To L2"],
                  },
                  1,
                  0,
                ],
              },
            },
            reopen_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Re-Open"],
                  },
                  1,
                  0,
                ],
              },
            },
            resolved_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Resolved"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
            process: {
              $first: "$Process",
            },
          },
        },
        {
          $project: {
            _id: "$id",
            cm_id: "$_id.cm_id",
            pending: "$pending_count",
            inprogressL1: "$progressL1_count",
            inprogressL2: "$progressL2_count",
            close: "$close_count",
            refer_count: "$refer_count",
            reopen_count: "$reopen_count",
            resolved_count: "$resolved_count",
            totalAssigned: "$totalAssigned",
            process: 1,
          },
        },
      ]);
      return res.status(200).json(result);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.dashboardLocationCount = async (req, res) => {
  try {
    const date = req.body.date;
    const lastDate = getLastDateOfMonth(date);
    const firstDate = replaceDateWith01(date);
    if (date) {
      const result = await Issue_Tracker.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(firstDate),
              $lte: new Date(lastDate),
            },
          },
        },
        {
          $group: {
            _id: {
              location: "$location",
            },
            totalAssigned: {
              $sum: 1,
            },
            close_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Close"],
                  },
                  1,
                  0,
                ],
              },
            },
            pending_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Pending"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL1_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L1"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL2_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L2"],
                  },
                  1,
                  0,
                ],
              },
            },
            refer_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Refer To L2"],
                  },
                  1,
                  0,
                ],
              },
            },
            reopen_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Re-Open"],
                  },
                  1,
                  0,
                ],
              },
            },
            resolved_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Resolved"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
          },
        },
        {
          $project: {
            _id: "$id",
            location: "$_id.location",
            pending: "$pending_count",
            inprogressL1: "$progressL1_count",
            inprogressL2: "$progressL2_count",
            close: "$close_count",
            refer_count: "$refer_count",
            reopen_count: "$reopen_count",
            resolved_count: "$resolved_count",
            totalAssigned: "$totalAssigned",
          },
        },
      ]);
      return res.status(200).json(result);
    } else {
      const result = await Issue_Tracker.aggregate([
        {
          $group: {
            _id: {
              location: "$location",
            },
            totalAssigned: {
              $sum: 1,
            },
            close_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Close"],
                  },
                  1,
                  0,
                ],
              },
            },
            pending_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Pending"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL1_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L1"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL2_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L2"],
                  },
                  1,
                  0,
                ],
              },
            },
            refer_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Refer To L2"],
                  },
                  1,
                  0,
                ],
              },
            },
            reopen_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Re-Open"],
                  },
                  1,
                  0,
                ],
              },
            },
            resolved_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Resolved"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
          },
        },
        {
          $project: {
            _id: "$id",
            location: "$_id.location",
            pending: "$pending_count",
            inprogressL1: "$progressL1_count",
            inprogressL2: "$progressL2_count",
            close: "$close_count",
            refer_count: "$refer_count",
            reopen_count: "$reopen_count",
            resolved_count: "$resolved_count",
            totalAssigned: "$totalAssigned",
          },
        },
      ]);
      return res.status(200).json(result);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.dashboardHandlerL1Count = async (req, res) => {
  try {
    const date = req.body.date;
    const lastDate = getLastDateOfMonth(date);
    const firstDate = replaceDateWith01(date);

    if (date) {
      const result = await Issue_Tracker.aggregate([
        {
          $match: {
            flag: 0,
            createdAt: {
              $gte: new Date(firstDate),
              $lte: new Date(lastDate),
            },
          },
        },

        {
          $group: {
            _id: {
              handler: "$HandlerL1",
            },
            totalAssigned: {
              $sum: 1,
            },
            close_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Close"],
                  },
                  1,
                  0,
                ],
              },
            },
            pending_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Pending"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL1_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L1"],
                  },
                  1,
                  0,
                ],
              },
            },
            reopen_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Re-Open"],
                  },
                  1,
                  0,
                ],
              },
            },
            resolved_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Resolved"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
            handlername: {
              $first: "$HandlerL1Name",
            },
          },
        },

        {
          $project: {
            _id: "$id",
            handler: "$_id.handler",
            handlername: 1,
            pending: "$pending_count",
            inprogressL1: "$progressL1_count",
            close: "$close_count",
            reopen_count: "$reopen_count",
            resolved_count: "$resolved_count",
            totalAssigned: "$totalAssigned",
          },
        },
        {
          $sort: {
            handlername: 1,
          },
        },
      ]);
      return res.status(200).json(result);
    } else {
      const result = await Issue_Tracker.aggregate([
        {
          $match: {
            flag: 0,
          },
        },

        {
          $group: {
            _id: {
              handler: "$HandlerL1",
            },
            totalAssigned: {
              $sum: 1,
            },
            close_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Close"],
                  },
                  1,
                  0,
                ],
              },
            },
            pending_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Pending"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL1_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L1"],
                  },
                  1,
                  0,
                ],
              },
            },
            reopen_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Re-Open"],
                  },
                  1,
                  0,
                ],
              },
            },
            resolved_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Resolved"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
            handlername: {
              $first: "$HandlerL1Name",
            },
          },
        },

        {
          $project: {
            _id: "$id",
            handler: "$_id.handler",
            handlername: 1,
            pending: "$pending_count",
            inprogressL1: "$progressL1_count",
            close: "$close_count",
            reopen_count: "$reopen_count",
            resolved_count: "$resolved_count",
            totalAssigned: "$totalAssigned",
          },
        },
        {
          $sort: {
            handlername: 1,
          },
        },
      ]);
      return res.status(200).json(result);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.dashboardHandlerL1SatisfiedCount = async (req, res) => {
  try {
    const date = req.body.date;
    const lastDate = getLastDateOfMonth(date);
    const firstDate = replaceDateWith01(date);
    if (date) {
      const result = await Issue_Tracker.aggregate([
        {
          $match: {
            flag: 0,
            createdAt: {
              $gte: new Date(firstDate),
              $lte: new Date(lastDate),
            },
          },
        },

        {
          $group: {
            _id: {
              handler: "$HandlerL1",
            },
            satisfied_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$RequestersFeedback", "Satisfied"],
                  },
                  1,
                  0,
                ],
              },
            },
            notsatisfied_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$RequestersFeedback", "Not Satisfied"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
            handlername: {
              $first: "$HandlerL1Name",
            },
          },
        },
        {
          $project: {
            handler: "$_id.handler",
            handlername: 1,
            satisfiedcount: "$satisfied_count",
            notsatisfiedcount: "$notsatisfied_count",
            _id: "$id",
          },
        },
        {
          $sort: {
            handlername: 1,
          },
        },
      ]);
      return res.status(200).json(result);
    } else {
      const result = await Issue_Tracker.aggregate([
        {
          $match: {
            flag: 0,
          },
        },

        {
          $group: {
            _id: {
              handler: "$HandlerL1",
            },
            satisfied_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$RequestersFeedback", "Satisfied"],
                  },
                  1,
                  0,
                ],
              },
            },
            notsatisfied_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$RequestersFeedback", "Not Satisfied"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
            handlername: {
              $first: "$HandlerL1Name",
            },
          },
        },
        {
          $project: {
            handler: "$_id.handler",
            handlername: 1,
            satisfiedcount: "$satisfied_count",
            notsatisfiedcount: "$notsatisfied_count",
            _id: "$id",
          },
        },
        {
          $sort: {
            handlername: 1,
          },
        },
      ]);
      return res.status(200).json(result);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.dashboardHandlerL1SatisfiedWithLocationCount = async (req, res) => {
  try {
    const date = req.body.date;
    const lastDate = getLastDateOfMonth(date);
    const firstDate = replaceDateWith01(date);
    if (date) {
      const result = await Issue_Tracker.aggregate([
        {
          $match: {
            flag: 0,
            createdAt: {
              $gte: new Date(firstDate),
              $lte: new Date(lastDate),
            },
          },
        },

        {
          $group: {
            _id: {
              handler: "$HandlerL1",
              location: "$location",
            },
            satisfied_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$RequestersFeedback", "Satisfied"],
                  },
                  1,
                  0,
                ],
              },
            },
            notsatisfied_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$RequestersFeedback", "Not Satisfied"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
            handlername: {
              $first: "$HandlerL1Name",
            },
          },
        },
        {
          $project: {
            handler: "$_id.handler",
            handlername: 1,
            location: "$_id.location",
            satisfiedcount: "$satisfied_count",
            notsatisfiedcount: "$notsatisfied_count",
            _id: "$id",
          },
        },
        {
          $sort: {
            location: 1,
          },
        },
      ]);
      return res.status(200).json(result);
    } else {
      const result = await Issue_Tracker.aggregate([
        {
          $match: {
            flag: 0,
          },
        },

        {
          $group: {
            _id: {
              handler: "$HandlerL1",
              location: "$location",
            },
            satisfied_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$RequestersFeedback", "Satisfied"],
                  },
                  1,
                  0,
                ],
              },
            },
            notsatisfied_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$RequestersFeedback", "Not Satisfied"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
            handlername: {
              $first: "$HandlerL1Name",
            },
          },
        },
        {
          $project: {
            handler: "$_id.handler",
            handlername: 1,
            location: "$_id.location",
            satisfiedcount: "$satisfied_count",
            notsatisfiedcount: "$notsatisfied_count",
            _id: "$id",
          },
        },
        {
          $sort: {
            location: 1,
          },
        },
      ]);
      return res.status(200).json(result);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.dashboardHandlerL1SatisfiedWithProcessCount = async (req, res) => {
  try {
    const date = req.body.date;
    const lastDate = getLastDateOfMonth(date);
    const firstDate = replaceDateWith01(date);
    if (date) {
      const result = await Issue_Tracker.aggregate([
        {
          $match: {
            flag: 0,
            createdAt: {
              $gte: new Date(firstDate),
              $lte: new Date(lastDate),
            },
          },
        },
        {
          $group: {
            _id: {
              handler: "$HandlerL1",
              cm_id: "$cm_id",
            },
            satisfied_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$RequestersFeedback", "Satisfied"],
                  },
                  1,
                  0,
                ],
              },
            },
            notsatisfied_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$RequestersFeedback", "Not Satisfied"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
            process: {
              $first: "$Process",
            },
            handlername: {
              $first: "$HandlerL1Name",
            },
          },
        },

        {
          $project: {
            handler: "$_id.handler",
            handlername: 1,
            process: "$process",
            satisfiedcount: "$satisfied_count",
            notsatisfiedcount: "$notsatisfied_count",
            _id: "$id",
          },
        },
        {
          $sort: {
            process: 1,
          },
        },
      ]);
      return res.status(200).json(result);
    } else {
      const result = await Issue_Tracker.aggregate([
        {
          $match: {
            flag: 0,
          },
        },
        {
          $group: {
            _id: {
              handler: "$HandlerL1",
              cm_id: "$cm_id",
            },
            satisfied_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$RequestersFeedback", "Satisfied"],
                  },
                  1,
                  0,
                ],
              },
            },
            notsatisfied_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$RequestersFeedback", "Not Satisfied"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
            process: {
              $first: "$Process",
            },
            handlername: {
              $first: "$HandlerL1Name",
            },
          },
        },

        {
          $project: {
            handler: "$_id.handler",
            handlername: 1,
            process: "$process",
            satisfiedcount: "$satisfied_count",
            notsatisfiedcount: "$notsatisfied_count",
            _id: "$id",
          },
        },
        {
          $sort: {
            process: 1,
          },
        },
      ]);
      return res.status(200).json(result);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getRequestersHistory = async (req, res) => {
  try {
    var requestby = req.body.requestby;
    // Save the new issue to the database
    const result = await Issue_Tracker.aggregate([
      {
        $match: {
          requestby: requestby,
        },
      },
    ]);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getRoaster = async (req, res) => {
  try {
    const EmployeeID = req.body.EmployeeID;
    const year = req.body.year;
    const month = req.body.month;
    let data = JSON.stringify({
      EmployeeID: EmployeeID,
      month: month,
      year: year,
    });
    const result = await axios.get(`${api}/app/arab.php`, {
      data: data,
    });
    return res.status(200).json(result.data);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getHandlerForMenu = async (req, res) => {
  try {
    var handler = req.body.handler;
    // Save the new issue to the database
    const result = await Issue_Tracker.aggregate([
      {
        $match: {
          HandlerL1: handler,
        },
      },
    ]);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.getHandlerForMenuL2 = async (req, res) => {
  try {
    var handler = req.body.handler;
    // Save the new issue to the database
    const result = await Issue_Tracker.aggregate([
      {
        $match: {
          HandlerL2: handler,
        },
      },
    ]);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.checkremark = async (req, res) => {
  try {
    const id = req.body.id;
    const document = await Issue_Tracker.findOne({ _id: id });

    if (document) {
      // Check if the 'remark' field is not empty in the 'concern' array
      const hasRemark = document.concern.filter(
        (concern) => concern.handlerL2remark !== ""
      );
      if (hasRemark.length === document.concern.length) {
        const updateValue = { $set: { checkRemarkHandler2: 1 } };
        await Issue_Tracker.updateOne({ _id: document._id }, updateValue);
        return res.status(200).json("Success");
      } else {
        return res.status(400).json("Not Empty");
      }
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.lockAtHandler2 = async (req, res) => {
  try {
    const EmployeeID = req.body.EmployeeID;
    const id = req.body.id;
    const EmployeeName = req.body.EmployeeName;

    const handlerL2Remark = await Issue_Tracker.findById(id);

    if (handlerL2Remark.HandlerL2 === EmployeeID) {
      return res.status(200).json("Same Handlerl2");
    } else if (handlerL2Remark.HandlerL2 === "") {
      const lock = await Issue_Tracker.findByIdAndUpdate(id, {
        $set: {
          HandlerL2: EmployeeID,
          HandlerL2Name: EmployeeName,
        },
      });
      return res.status(200).json(lock);
    } else {
      return res.status(400).json("already Assigned");
    }
    return res.status(200).json(handlerL2Remark.HandlerL2);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.dashboardTotalCount = async (req, res) => {
  try {
    const date = req.body.date;
    const lastDate = getLastDateOfMonth(date);
    const firstDate = replaceDateWith01(date);

    if (date) {
      const result = await Issue_Tracker.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(firstDate),
              $lte: new Date(lastDate),
            },
          },
        },
        {
          $group: {
            _id: {
              _id: "",
            },
            totalAssigned: {
              $sum: 1,
            },
            close_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Close"],
                  },
                  1,
                  0,
                ],
              },
            },
            pending_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Pending"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL1_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L1"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL2_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L2"],
                  },
                  1,
                  0,
                ],
              },
            },
            refer_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Refer To L2"],
                  },
                  1,
                  0,
                ],
              },
            },
            reopen_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Re-Open"],
                  },
                  1,
                  0,
                ],
              },
            },
            resolved_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Resolved"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
          },
        },
        {
          $project: {
            _id: "$id",
            pending: "$pending_count",
            inprogressL1: "$progressL1_count",
            inprogressL2: "$progressL2_count",
            close: "$close_count",
            refer_count: "$refer_count",
            reopen_count: "$reopen_count",
            resolved_count: "$resolved_count",
            totalAssigned: "$totalAssigned",
          },
        },
      ]);
      return res.status(200).json(result);
    } else {
      const result = await Issue_Tracker.aggregate([
        {
          $group: {
            _id: {
              _id: "",
            },
            totalAssigned: {
              $sum: 1,
            },
            close_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Close"],
                  },
                  1,
                  0,
                ],
              },
            },
            pending_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Pending"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL1_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L1"],
                  },
                  1,
                  0,
                ],
              },
            },
            progressL2_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "In Progress L2"],
                  },
                  1,
                  0,
                ],
              },
            },
            refer_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Refer To L2"],
                  },
                  1,
                  0,
                ],
              },
            },
            reopen_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Re-Open"],
                  },
                  1,
                  0,
                ],
              },
            },
            resolved_count: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$status", "Resolved"],
                  },
                  1,
                  0,
                ],
              },
            },
            id: {
              $first: "$_id",
            },
          },
        },
        {
          $project: {
            _id: "$id",
            pending: "$pending_count",
            inprogressL1: "$progressL1_count",
            inprogressL2: "$progressL2_count",
            close: "$close_count",
            refer_count: "$refer_count",
            reopen_count: "$reopen_count",
            resolved_count: "$resolved_count",
            totalAssigned: "$totalAssigned",
          },
        },
      ]);
      return res.status(200).json(result);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};


exports.findHandlerMappingNew = async (req, res) => {
  try {
    const handlerData = await HandlerMapping.aggregate([
      {
        $group: {
          _id: {
            HandlerL1: "$HandlerL1",
            HandlerL2: "$HandlerL2",
            cm_id: "$cm_id",
            issue: "$issue",
          },
          process: {
            $first: "$process",
          },
          HandlerL2: {
            $first: "$HandlerL2",
          },
          status: {
            $first: "$status",
          },
          HandlerL1Name: {
            $first: "$HandlerL1Name",
          },
          HandlerL2Name: {
            $first: "$HandlerL2Name",
          },
          subissue: {
            $push: "$subissue", // Add this line to create an array of all subissue values.
          },
          id: {
            $push: "$_id", // Add this line to create an array of all subissue values.
          },
          idmain: {
            $first: "$_id",
          },
        },
      },
      {
        $project: {
          _id: "$idmain",
          HandlerL1: "$_id.HandlerL1",
          issue: "$_id.issue",
          HandlerL1Name: 1,
          HandlerL2: 1,
          HandlerL2Name: 1,
          subissue: 1,
          cm_id: "$_id.cm_id",
          id: 1,
          process: 1,
          status: 1,
        },
      },
    ])
    return res.status(200).json(handlerData)

  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getParticularMappedDAta = async (req, res) => {
  try {
    const handlerL1 = req.body.handlerL1
    const handlerL2 = req.body.handlerL2
    const cm_id = req.body.cm_id
    const issue = req.body.issue
    const handlerData = await HandlerMapping.aggregate([
      {
        $match: {
          HandlerL1: handlerL1,
          HandlerL2: handlerL2,
          cm_id: cm_id,
          issue: issue,
        },
      },
      {
        $group: {
          _id: {
            HandlerL1: "$HandlerL1",
            cm_id: "$cm_id",
            issue: "$issue",
          },
          process: {
            $first: "$process",
          },
          HandlerL2: {
            $first: "$HandlerL2",
          },
          status: {
            $first: "$status",
          },
          HandlerL1Name: {
            $first: "$HandlerL1Name",
          },
          HandlerL2Name: {
            $first: "$HandlerL2Name",
          },
          subissue: {
            $push: "$subissue",
          },
          id: {
            $push: "$_id",
          },
          idmain: {
            $first: "$_id",
          },
        },
      },
      {
        $project: {
          _id: "$idmain",
          HandlerL1: "$_id.HandlerL1",
          issue: "$_id.issue",
          HandlerL1Name: 1,
          HandlerL2: 1,
          HandlerL2Name: 1,
          subissue: 1,
          process: 1,
          cm_id: "$_id.cm_id",
          id: 1,
          status: 1,
        },
      },
    ])
    return res.status(200).json(handlerData)

  } catch (err) {
    return res.status(500).json(err);
  }
};