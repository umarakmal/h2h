const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const email_log = new Schema(
  {
    EmployeeID: {
      type: String,
      required: true,
    },
    module_name: {
      type: String,
      required: true,
    },
    log_message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Email_Log", email_log);
