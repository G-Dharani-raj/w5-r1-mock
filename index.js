const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./db");
const userRouter = require("./routes/user.routes");
const empRouter = require("./routes/employees.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Homepage");
});

app.use("/user", userRouter);
app.use("/employees", empRouter);

app.listen(process.env.PORT, () => {
	connectDB();
	console.log("listening on port " + process.env.PORT);
});
