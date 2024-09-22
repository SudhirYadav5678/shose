import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    fullName: {
        type: String,
        require: [true, "Full name is required"],
        min: [3, "Please provide fullName above 2 Character"],
        max: [50, "Please provide fullName below 50 Character"],
        trim: true,
        lower: true
    },
    email: {
        type: String,
        require: [true, "Email is required"],
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please provide a vaild email id"],
        unique: true,
        lower: true
    },
    password: {
        type: String,
        require: [true, "Password is required"],
        trim: true,
    },
    avatar: {
        type: String
    },
    phone: {
        type: Number,
        trim: true,
        unique: true
    },
    address: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    cart: {
        type: [Schema.Types.ObjectId],
        ref: "Product"
    },
    favorite: {
        type: [Schema.Types.ObjectId],
        ref: "Product"
    },
    buys: {
        type: [Schema.Types.ObjectId],
        ref: "Product"
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)