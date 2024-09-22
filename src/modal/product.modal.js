import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    productName: {
        type: String,
        required: [true, "Product name is required"],
        index: true,
        unique: true,
        trim: true
    },
    categary: {
        type: String,
        trim: true
    },
    productImage: {
        type: String,
        required: [true, "Product Image is required"]
    },
    price: {
        type: String,
        required: [true, "Product Price is required"]
    },
    size: {
        type: String,
        required: true
    },
    productFeaturesImages: {
        type: [String]
    },
    descripiton: {
        type: String,
        required: [true, "Product Descripiton is required"]
    },
    quantity: {
        type: Number,
        required: [true, "Product Quantity is required"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema)