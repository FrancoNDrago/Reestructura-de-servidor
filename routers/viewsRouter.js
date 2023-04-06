const express = require("express");
const viewsRouter = express.Router();
const { productsModel } = require("../daos/models/products.model");
const { cartsModel } = require("../daos/models/carts.model");


viewsRouter.get("/", auth, (req, res) => {
	res.redirect("/products");
});

viewsRouter.get("/register", (req, res) => {
	if (!req.session.user) {
		res.render("users/register");
	} else {
		res.redirect("/products");
	}
});

viewsRouter.get("/login", (req, res) => {
	res.render("users/login");
});

viewsRouter.get("/products", auth, async (req, res) => {
	console.log(req.query);
	const limit = req.query.limit || 10;
	const page  = req.query.page || 1;
	const sort  = req.query.sort ? {price: req.query.sort} : {};
	
	const query     = construirQuery(req.query);
	const productos = await productsModel.paginate(query, {limit, page, sort, lean: true});
	
	res.render("productos/productos", {productos, limit});
});
  
function construirQuery(query) {
	const posibleFilters = ["title", "description", "price", "stock", "category"];
	let appliedFilters = {};

	posibleFilters.forEach( filter => {
		if (query[filter]) {
			appliedFilters[filter] = {$regex: query[filter]};
		}
	});
	return appliedFilters;
}

function auth(req, res, next) {
	if (req.session.user) {
		return next();
	}

	res.redirect("/login");
}

module.exports.viewsRouter = viewsRouter;