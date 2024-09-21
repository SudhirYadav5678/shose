import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    comment: {
        type: String,
        require: true
    },
    likeBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    likeOn: {
        type: Schema.Types.ObjectId,
        ref: "Prouct"
    }
}, { timestamps: true })