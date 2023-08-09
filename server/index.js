const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var path = require("path");
const cron = require("cron");
const Issue_Tracker = require('./models/issueTracker')
//Loads environment variables from .env file
require("dotenv").config();
const cors = require("cors");

const app = express();

//Connecting Database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected successfully!"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err));

app.use(cors({ origin: "*", credentials: true }));


// import routes
const issueRoutes = require("./routes/index");

// app middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static(__dirname + '/public'));
// Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'build')));
// middleware
app.use("/api", issueRoutes);

const updateIssueStatus = async () => {
  try {
    const currentDate = new Date(); // Get the current date and time
    const resolvedStatus = "Resolved";
    const hoursThreshold = 72;
    // Calculate the date 72 hours ago
    const dateThreshold = new Date(currentDate.getTime() - hoursThreshold * 60 * 60 * 1000);

    // Save the new issue to the database
    const result = await Issue_Tracker.aggregate([
      {
        $match: {
          status: resolvedStatus,
          updatedAt: { $lte: dateThreshold } // Find issues resolved 72 hours ago or earlier
        }
      },
    ]);
    if (result.length === 0) {
      console.log("No documents found.")
    }

    // Get the IDs of the documents to update
    const documentIds = result.map((doc) => doc._id);
    // Update the documents with the new values
    const dataUpd = await Issue_Tracker.bulkWrite([
      {
        updateMany: {
          filter: { _id: { $in: documentIds } },
          update: {
            $set: {
              status: "Close",
              requesterStatus: "Close",
              RequestersFeedback: "Satisfied",
              RequestersRemark: 'Thank You.'
            }
          }
        }
      }
    ]);
    console.log("Success")
  } catch (err) {
    console.log(err)
  }
};

// Define the cron schedule.
const cronSchedule = "59 23 */1 * *"; // This cron schedule runs at 11:59 PM every day (UTC time)

// Create a cron job instance
const job = new cron.CronJob(cronSchedule, updateIssueStatus, null, true);

//Establishing server port
const port = process.env.PORT || 5500;
app.listen(port, () => {
  // Start the cron job
  job.start();
  console.log(`API is running on port ${port}`);
});
