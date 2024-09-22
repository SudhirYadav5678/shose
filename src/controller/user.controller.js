import { deleteCloudinary, uploadOnCloudinary } from "../utilis/cloudinary.js"
import { User } from "../modal/user.modal.js"

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        //console.log("access", accessToken);
        const refreshToken = user.generateRefreshToken()
        // console.log("refresh", refreshToken);
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        return new Error("Something went wrong while generating referesh and access token")
    }
}

const registerUser = async function (req, res) {
    const { fullName, email, password, phone, address } = await req.body

    if (
        [fullName, email, password].some((field) => field?.trim() === "")
    ) {
        return res.status(409).json({
            success: false,
            message: "All fields are required"
        })
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        return res.status(409).json({
            success: false,
            message: "User with email already exists"
        })
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    //console.log("avatarLocalPath", avatarLocalPath);

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    //console.log(avatar);


    const user = await User.create({
        fullName,
        avatar: avatar?.url || "",
        email,
        password,
        phone,
        address
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        const avatarDelete = await deleteCloudinary(avatar?.url)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while registering the user"
        })
    }

    return res.status(201).json(
        {
            success: true,
            message: "User registered Successfully"
        }
    )

}

const loginUser = async function (req, res) {
    const { email, password } = req.body
    //console.log(email);

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "email is required"
        })
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        })
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid user credentials"
        })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    //console.log("accessToken, refreshToken", accessToken, refreshToken);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message: "User login successfully",
            user: loggedInUser, accessToken, refreshToken
        })
}

const logoutUser = async function (req, res) {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            success: true,
            message: "User logout successful"
        })

}

const updateUser = async function (req, res) {
    const { fullName, email, phone, password, address } = await req.body;
    console.log(fullName, email, phone, password);

    const user = await User.findById(req.user?._id)
    if (!user) {
        return res.status(409).json({
            success: false,
            message: "Unauthorized access"
        })
    }

    if (fullName) { user.fullName = fullName }
    if (email) { user.email = email }
    if (phone) { user.phone = phone }
    if (password) { user.password = password }
    if (address) { user.address = address }


    await user.updateOne({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        password: user.password,
        address: user.address
    })

    return res.status(200)
        .json({
            success: true,
            message: "Update successfully",
            user: user
        })
}

const updateAvatar = async function (req, res) {
    const user = await User.findById(req.user?._id,);
    if (!user) {
        return res.status(409).json({
            success: false,
            message: "Unauthorized access"
        })
    }
    const avatarUrl = user.avatar;
    //console.log("avatarUrl", avatarUrl);

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
        return res.status(400).json({
            success: false,
            message: "Avatar file is missing"
        })
    }

    //delete old image
    const removeAvatar = await deleteCloudinary(avatarUrl);
    //console.log("removeAvatar", removeAvatar);

    //uploade
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        return res.status(400).json({
            success: false,
            message: "Error while uploading on avatar"
        })
    }

    await User.updateOne({
        $set: {
            avatar: avatar.url
        }
    }).select("-password")

    return res
        .status(200)
        .json(
            {
                success: true,
                message: "Avatar image updated successfully"
            }
        )
}

const deleteUser = async function (req, res) {
    //const { email, password } = await req.body
    const user = await User.findById(req.user._id)
    //console.log(user);
    //console.log(email, password);

    // if (!email && !password) {
    //     return res.status(409).json({
    //         success: false,
    //         message: "email and Password required"
    //     })
    // }
    if (!user) {
        return res.status(409).json({
            success: false,
            message: "user do not found"
        })
    }
    const avatarUrl = user.avatar
    const removeAvatar = await deleteCloudinary(avatarUrl);
    // console.log(removeAvatar);

    const deleteUserAccount = await user.deleteOne({ user: user._id, email: user.email })
    //console.log(deleteUserAccount);

    return res.status(200).cookie("token", "").json({
        success: true,
        message: "User deleted"
    })
}

export { registerUser, loginUser, logoutUser, deleteUser, updateUser, updateAvatar }