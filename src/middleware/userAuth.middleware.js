import jwt from "jsonwebtoken"
import { User } from '../modal/user.modal.js'

export const verifyJWT = async function (req, res, next) {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        //console.log("token", token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request in User Token"
            })
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid User Access Token"
            })
        }

        req.user = user;
        next()
    } catch (error) {
        console.log("auth error", error);
        return res.status(401).json({
            success: false,
            message: "Invalid User Access Token"
        })
    }
}