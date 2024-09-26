import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    rate: {
        type: String,
    },
    comment: {
        type: String,
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

export const Review = mongoose.model("Review", reviewSchema)