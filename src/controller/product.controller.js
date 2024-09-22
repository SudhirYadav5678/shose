import { Product } from "../modal/product.modal.js"
import { deleteCloudinary, uploadOnCloudinary } from "../utilis/cloudinary.js"


const productRegister = async (req, res) => {
    const user = req.user._id
    const { productName, categary, price, size, descripiton, quantity } = await req.body
    if (!productName && !categary && !price && !size && !descripiton && !quantity) {
        return res.status(409).json({
            success: false,
            message: "All field are required"
        })
    }

    const productImagesPath = req.files?.productImage?.[0]?.path;
    const productImage = await uploadOnCloudinary(productImagesPath)

    const { productFeaturesImages } = await req.files
    //console.log("productFeaturesImages[0]", productFeaturesImages[0]);
    const array = [];
    for (let i = 0; i < productFeaturesImages.length; i++) {
        const res = await uploadOnCloudinary(productFeaturesImages[i]?.path)
        array.push(res.url)
        // console.log("array", array);
    }

    const product = await Product.create({
        productName, categary, productImage: productImage?.url, price, size, descripiton, quantity, productFeaturesImages: array
    })

    if (!product) {
        const productImagesDelete = await deleteCloudinary(product.productImage)
        console.log(productImagesDelete);
        return res.status(500).json({
            success: false,
            message: "Error while product registericton"
        })
    }

    return res.status(201).json({
        success: true,
        message: "Product registeriction successfull",
        product
    })
}

export { productRegister }