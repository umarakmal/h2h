const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const handlerMapping = new Schema(
    {
        process: { type: String },
        cm_id: { type: String },
        HandlerL1: {
            type: String,
            required: true,
        },
        HandlerL1Name: {
            type: String,
            required: true,
        },
        HandlerL2: {
            type: String,
            required: true,
        },
        HandlerL2Name: {
            type: String,
            required: true,
        },
        issue: { type: String },
        subissue: { type: String },
        status: {
            type: String,
            default: 'active'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "HandlerMapping",
    handlerMapping
);