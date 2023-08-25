const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IpWhitelist = new Schema(
    {
        IP: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("IpWhitelist", IpWhitelist);
