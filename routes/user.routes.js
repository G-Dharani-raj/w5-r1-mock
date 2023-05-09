const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../model/User.model");
const userRouter = express.Router();

userRouter.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		let data = await UserModel.find({ email });
		if (data.length) {
			bcrypt.compare(password, data[0].password, (err, result) => {
				if (err) res.send(err).status(400);
				else if (result) {
					let token = jwt.sign({ email }, process.env.JWT_SECRET);
					res.send({ token }).status(201);
				} else {
					res.send("Invalid Credentials").status(401);
				}
			});
		}
	} catch (error) {
		res.send(error).status(500);
	}
});

userRouter.post("/signup", async (req, res) => {
	const { email, password } = req.body;
	try {
		let data = await UserModel.find({ email });
		if (data.length) {
			res.send("User Already Exists").status(409);
		} else {
			bcrypt.hash(password, 5, async (err, hash) => {
				if (err) res.send(err).status(500);
				else {
					let new_user = new UserModel({ email, password: hash });
					await new_user.save();
					res.send("Registered Successfully").status(200);
				}
			});
		}
	} catch (error) {
		res.send(error).status(500);
	}
});

module.exports = userRouter;
