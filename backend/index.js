const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(function () {
    console.log("Connected to DB");
  })
  .catch(function (error) {
    console.log("Failed to connect:", error);
  });

const credential = mongoose.model("credential", {}, "bulkmail");

app.post("/sendmail", function (req, res) {
  var mess = req.body.mess;
  var emailList = req.body.emailList;

  credential
    .find()
    .then(function (data) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: data[0].toJSON().user,
          pass: data[0].toJSON().pass,
        },
      });
      new Promise(async function (resolve, reject) {
        try {
          for (var i = 0; i < emailList.length; i++) {
            await transporter.sendMail({
              from: "ramachandran.s6864@gmail.com",
              to: emailList[i],
              subject: "A mess from bulkmail",
              text: mess,
            });
            console.log("Email sent to " + emailList[i]);
          }
          resolve("success");
        } catch (error) {
          reject("failed");
        }
      })
        .then(function () {
          res.send(true);
        })
        .catch(function () {
          res.send(false);
        });
    })
    .catch(function (error) {
      console.log("Error:", error);
    });
});

app.listen(5001, function () {
  console.log("Server started....");
});
