const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sms_Log = new Schema(
    {
        caseId: {
            type: Number,
        },
        mobile_no: {
            type: String,
        },
        responce: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Sms_Log", sms_Log);
