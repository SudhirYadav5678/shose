import { User } from "../modal/user.modal.js"
import { Product } from "../modal/product.modal.js"
import { Review } from '../modal/review.modal.js'

const reviewAdd = async function (req, res) {
    const { rate, comment, productName } = await req.body
    const user = await User.findById(req.user._id)
    console.log(user);

    const product = await Product.findOne({ productName })
    console.log(product);

    if (!user || !product) {
        return res.status(409).json({
            success: false,
            message: "User or Product id no found"
        })
    }
    const reviewAdds = await Review.create({
        rate,
        comment,
        likeBy: user._id,
        likeOn: product._id
    })
    if (!reviewAdds) {
        return res.status(500).json({
            success: false,
            message: "Error while adding review Sorry !!! try again"
        })
    }
    return res.status(200).json({
        success: true,
        message: "Thank You for your Words",
        user,
        product
    })
}

export { reviewAdd }