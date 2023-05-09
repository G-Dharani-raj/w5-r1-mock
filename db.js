const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO);
		console.log("Connected to the Database.");
	} catch (error) {
		console.log("Something went wrong: ", error);
	}
};

module.exports = connectDB;
