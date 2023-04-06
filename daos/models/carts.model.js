const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const cartsCollection = "carts";
const cartsSchema = new mongoose.Schema({
	products: {
		type: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "products"
				},
				quantity: Number
			}
		],
		default: []
	}
});

cartsSchema.plugin(mongoosePaginate);
module.exports.cartsModel = mongoose.model(cartsCollection, cartsSchema);