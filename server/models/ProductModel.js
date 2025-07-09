const { Schema, model } = require("mongoose");
const UserModel = require("./UserModel");
const { errorCreator } = require("../utils/responseHandler");

const productSchema = new Schema({
	title: {
		type: String,
		required: [true, "Title is Mandatory"],
	},
	price: {
		type: Number,
		required: [true, "Price is Mandatory"],
	},
	description: {
		type: String,
		default: "No Description",
	},
	category: {
		type: String,
		required: [true, "Product Category Required"],
	},
	image: {
		type: String,
		required: [true, "Product Image is Required"],
	},
	rating: {
		rate: {
			type: Number,
			default: 0,
		},
		count: {
			type: Number,
			default: 0,
		},
	},
	stock: {
    type: Number,
		default: 0,
	},
});

productSchema.statics.addProduct = async (product) => {
	const existingProduct = await ProductModel.findOne({ id: product.id });
	if (existingProduct) {
		errorCreator("Product Already Exists");
	}
	const newProduct = await ProductModel.create(product);
	return newProduct;
};

productSchema.statics.deleteProduct = async (product) => {
	const existingProduct = await ProductModel.findOneAndDelete({
		id: product.id,
	});
	if (!existingProduct) {
		errorCreator("Product Doesn't Exist");
	}
	return `${product.title} Deleted Successfully`;
};

productSchema.statics.updateProduct = async (product) => {
	const exisitingProduct = await ProductModel.findOne({ id: product.id });
	if (!exisitingProduct) {
		errorCreator("Product Doesn't Exist");
	}
	// Doesn't Let Rating Be Updated
	if ("rating" in product) {
		delete product.rating;
	}

	const updatedProduct = await ProductModel.findOneAndUpdate(
		{ id: product.id },
		{ $set: product },
		{ new: true, runValidators: true }
	);
	// runValidators like required:true still applied

	return updatedProduct;
};

productSchema.statics.getAllProducts = async()=>{
  const allProducts = await ProductModel.find()
  return allProducts
}

productSchema.statics.checkInStock = async(_id)=>{
	const product = await ProductModel.findById(_id)
	if(!product){
		return false
	}
	if(product?.quantity > 0){
		return true
	}
	return false
}

const ProductModel = model("product", productSchema);

module.exports = ProductModel;
