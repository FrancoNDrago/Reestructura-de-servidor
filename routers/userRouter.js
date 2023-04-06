const express = require("express");
const userRouter = express.Router(); 
const { userModel } = require("../daos/models/user.model");
const mongoose = require("mongoose");

userRouter.get("/", async (req, res) => {
	try{
		let users = await userModel.find();
		res.send({success: true, payload: users});
	} catch(error) {
		res.send({success: false});
	}
});

userRouter.post("/", async (req, res) => {
	let {first_name, last_name, email} = req.body;

	if (!first_name || !last_name || !email) {
		res.send({success: false, payload: "No se enviaron todos los campos obligatorios"});
	}

	let result = userModel.create({
		first_name,
		last_name,
		email
	});

	res.send({success: true, payload: result});
});


mongoose.set("strictQuery", false);

mongoose.connect("mongodb+srv://Drago:Coderhouse123@cluster0.gsvnnyg.mongodb.net/test", (error) => {
	if (error) {
		console.log("error", error);
	}
});

module.exports.userRouter = userRouter;