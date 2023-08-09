const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const handler_Master = new Schema(
    {
        EmployeeID: {
            type: String,
            required: true,
            unique: true
        },
        EmployeeName: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            default: 'active'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "Handler_Master",
    handler_Master
);