const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

const developer_schema = require("./schema");
const mongoose = require("mongoose");
const ErrorHandling = require("./errorHandling");

mongoose.connect("mongodb+srv://susee:KtqA27lX01OPaiUz@cluster0.jsinktk.mongodb.net/Employee?retryWrites=true&w=majority&appName=Cluster0", {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverSelectionTimeoutMS: 5000,
})
.then(() => {
   console.log("db is connected");
})
.catch(() => {
   console.log("db is not connected");
});

app.get("/getData", async (req, res) => {
   let getdata = await developer_schema.find();
   res.json({ getdata, msg: "data get successfully" });
});

app.post("/createData", async (req, res, next) => {
   
   const hassPassword = await bcrypt.hash(req.body.password, 7);
   const developerData = developer_schema({
      ...req.body, password: hassPassword
   });

   const email = await developer_schema.findOne({ email: req.body.email });
   if (email) return next(ErrorHandling());

   const saveData = await developerData.save();
   res.json({ saveData, msg: "Data added successfully...!" });
});

app.use((err, req, res, next) => {
   const errorStatus = err.status || 500;
   const errormessage = err.message || "wrong";
   return res.status(errorStatus).json({ errorStatus, errormessage });
});

app.listen(3000, () => {
   console.log(`server running port on:${3000}`);
});