const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const issue_master = new Schema(
    {

        issue: {
            type: String,
            // default: '',
            required: true,
            unique: true
        },
        subIssue: [{
            subissue: {
                type: String,
                default: ''
            },
            status: {
                type: String,
                default: 'active'
            }
        }
        ],
        status: {
            type: String,
            default: 'active'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "Issue_Master",
    issue_master
);