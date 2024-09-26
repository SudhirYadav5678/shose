import mongoose, { Schema } from "mongoose";

const buySchema = new Schema({

}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema)