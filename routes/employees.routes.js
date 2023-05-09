const express = require("express");
const EmployeeModel = require("../model/Employee.model");

const empRouter = express.Router();

empRouter.get("/", async (req, res) => {
	const { firstname, sort, order, department } = req.query;
	let { page } = req.query;
	const LIMIT = 5;
	if (page < 1 || !page) {
		page = 1;
	}
	let tmp = {};
	if (firstname && department) {
		tmp = {
			$and: [
				{
					firstName: {
						$regex: firstname,
						$options: "i",
					},
				},
				{
					department: { $regex: department, $options: "i" },
				},
			],
		};
	} else if (firstname) {
		tmp = {
			firstName: { $regex: firstname, $options: "i" },
		};
	} else if (department) {
		tmp = { department: { $regex: department, $options: "i" } };
	}
	let data = [];
	try {
		if (sort) {
			data = await EmployeeModel.find(tmp)
				.sort({ salary: order ? order : "asc" })
				.limit(LIMIT)
				.skip(LIMIT * (page - 1));
		} else {
			data = await EmployeeModel.find(tmp)
				.limit(LIMIT)
				.skip(LIMIT * (page - 1));
		}
		const totalPages = Math.ceil(data.length / LIMIT);
		res.send({ data, totalPages }).status(200);
	} catch (error) {
		res.send(error).status(500);
	}
});

empRouter.delete("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		await EmployeeModel.findByIdAndDelete(id);
		res.send(
			"Employee Details Have Been Removed From The Database."
		).status(202);
	} catch (error) {
		res.send(error).status(500);
	}
});

empRouter.patch("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		await EmployeeModel.findByIdAndUpdate(id, { ...req.body });
		res.send("Employee Details Have Been Updated").status(202);
	} catch (error) {
		res.send(error).status(500);
	}
});

empRouter.post("/", async (req, res) => {
	const { firstName, lastName, email } = req.body;
	try {
		let pre_check = await EmployeeModel.find({ email });
		if (pre_check.length) {
			res.send("Employee Email already Exists.").status(409);
		} else {
			let new_employee = new EmployeeModel({ ...req.body });
			await new_employee.save();
			res.send("Employee details registered successfully").status(200);
		}
	} catch (error) {
		res.send(error).status(500);
	}
});

module.exports = empRouter;
