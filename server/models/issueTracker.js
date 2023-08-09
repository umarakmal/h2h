const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const issue_tracker = new Schema(
  {
    caseId: {
      type: Number,
    },
    requestby: {
      type: String,
      default: "",
    },
    AH: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    reportto: {
      type: String,
      default: "",
    },
    HandlerL1: {
      type: String,
      default: "",
    },
    HandlerL1Name: {
      type: String,
      default: "",
    },
    HandlerL2: {
      type: String,
      default: "",
    },
    HandlerL2Name: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    Process: {
      type: String,
      default: "",
    },
    cm_id: {
      type: String,
      default: "",
    },
    belongsTo: {
      type: String,
      default: "",
    },
    issue: {
      type: String,
      default: "",
    },
    RequestersFeedback: {
      type: String,
      default: "",
    },
    referred_Remark: {
      type: String,
      default: "",
    },
    communicated_with: {
      type: String,
      default: "",
    },
    checkRemarkHandler2: {
      type: Number,
      default: 0,
    },
    checkRemarkHandler1: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Pending",
    },
    requesterStatus: {
      type: String,
      default: "",
    },
    referredDate: {
      type: Date,
      default: "",
    },
    flag: {
      type: Number,
      default: 0,
    },
    mobile_no: {
      type: String,
      default: "",
    },
    requester_mobile_no: {
      type: String,
      default: "",
    },
    RequestersRemark: {
      type: String,
      default: "",
    },
    requester_feedback_date: {
      type: Date,
      default: "",
    },
    concern: [
      {
        concernof: {
          type: Date,
          default: "",
        },
        remark: {
          type: String,
          default: "",
        },
        payoutDays: {
          type: Number,
        },
        payoutType: {
          type: String,
        },
        handlerL1remark: {
          type: String,
          default: "",
        },
        handlerL1Date: {
          type: Date,
        },
        handlerL2remark: {
          type: String,
          default: "",
        },
        handlerL2Date: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Issue_Tracker", issue_tracker);
