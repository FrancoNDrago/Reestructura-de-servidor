const express = require("express");
const cartsRouter = express.Router(); 
const { cartsModel } = require("../daos/models/cart.model");
const { productsModel } = require("../daos/models/products.model");
const mongoose = require("mongoose");


cartsRouter.get("/", async (req, res) => {
	const carts = await cartsModel.find().populate("products.productId");
	res.send({success: true, carts});
})

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
	const cart = await cartsModel.findOne({_id: req.params.cid});

	if (!cart) {
		res.status(404).send("El carrito que quiere modificar no existe.");
	}	
	
	const productos = cart.products.filter(producto => producto.productId != req.params.pid);
	
	const resultado =  await cartsModel.updateOne({_id: req.params.cid}, {products: productos});
	
	if (resultado.modifiedCount) {
		res.send("Se ha eliminado el producto");
	} else {
		res.send("No se han actualizado datos. Es posible que el producto no haya sido parte del carrito");
	}
})

cartsRouter.delete("/:cid", async (req, res) => {
	try{
		const resultado = await cartsModel.updateOne({_id: req.params.cid}, {products: []});
		res.send({success: true});
	} catch (error) {
		console.log(error);
		res.send("Error");
	}
})

cartsRouter.post("/", async (req, res) => {
	if (!req.body.products || !req.body.products.length) {
		res.status(400).send("No se recibieron los productos");
	}

	const cart = await cartsModel.create({products: req.body.products});
	res.send({success: true, createdCartId: cart._id});
})

cartsRouter.put("/:cid", async (req, res) => {
	const cartId = req.params.cid;
	const cart   = await cartsModel.find({_id: cartId});
	
	if (!cart.length) {
		cartsModel.create({products: req.body.products})
	} else {
		cartsModel.updateOne({_id: cartId}, {products: req.body.products});
	}

	res.send("Carrito actualizado");
})

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
	const cart = await cartsModel.findOne({_id: req.params.cid});

	if (!cart) {
		res.status(404).send("El carrito que se desea modificar no existe...");
	}	
	
	const productos = cart.products.map(producto => {
		if (producto.productId === req.params.pid) {
			producto.quantity = req.body.cantidad;
		}
		return producto;
	})

	const resultado =  await cartsModel.updateOne({_id: req.params.cid}, {products: productos});
	
	if (resultado.modifiedCount) {
		res.send("Se ha actualizado la cantidad con exito!");
	} else {
		res.send("No se han actualizado datos...");
	}
})


module.exports.cartsRouter = cartsRouter;