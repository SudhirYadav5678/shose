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
        const productImagesDelete = await deleteCloudinary(product.productImage?.url)
        for (let index = 0; index < array.length; index++) {
            const productFeaturesImagesDelete = await deleteCloudinary(product.productFeaturesImages[index])
        }
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

const productDelete = async (req, res) => {
    const { productName } = await req.body;
    const product = await Product.findOne({ productName })
    //console.log("product", product);

    if (!product) {
        return res.status(409).json({
            success: false,
            message: "Product id did not get"
        })
    }

    const imagesUrl = product.productImage
    const imagesUrlDelete = await deleteCloudinary(imagesUrl);

    const imagesUrls = product.productFeaturesImages;
    //console.log("imagesUrls", imagesUrls);
    //console.log(imagesUrls.length);

    for (let index = 0; index < imagesUrls.length; index++) {
        const imagesUrlDelete = await deleteCloudinary(imagesUrls[index]);
    }
    const deleteProduct = await product.deleteOne({ product: product._id })
    if (!deleteProduct) {
        return res.status(500).json({
            success: false,
            message: "Product  did not get delete"
        })
    }
    return res.status(200).json({
        success: false,
        message: "Product deleted Successfuly"
    })
}

const productUpdate = async function (req, res) {
    const { productName, categary, price, size, descripiton, quantity } = await req.body;
    const product = await Product.findOne({ productName })
    if (!product) {
        return res.status(409).json({
            success: false,
            message: "Product id did not get"
        })
    }
    if (productName) { product.productName = productName }
    if (categary) { product.categary = categary }
    if (price) { product.price = price }
    if (size) { product.size = size }
    if (quantity) { product.quantity = quantity }
    const productImagesPath = req.files?.productImage?.[0]?.path;
    if (productImagesPath) {
        const productImage = await uploadOnCloudinary(productImagesPath)
    }
    const { productFeaturesImages } = await req.files
    const array = [];
    if (productFeaturesImages) {
        for (let i = 0; i < productFeaturesImages.length; i++) {
            const res = await uploadOnCloudinary(productFeaturesImages[i]?.path)
            array.push(res.url)
        }
    }
    await product.updateOne({
        productName: product.productName,
        categary: product.categary,
        price: product.price,
        size: product.size,
        quantity: product.quantity,
        productImage: productImage?.url,
        productFeaturesImages: array
    })

    return res.status(200)
        .json({
            success: true,
            message: "Update successfully",
            product: product
        })
}
export { productRegister, productDelete, productUpdate }