import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from 'dotenv'
dotenv.config({ path: "./.env" })

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        //console.log("localFilePath", localFilePath);

        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("Error while file uploading", error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteCloudinary = async function (localFilePath) {
    //console.log("localFilePath", localFilePath);

    try {
        if (!localFilePath) return null;
        const imageUrl = localFilePath.split('/')
        const image = imageUrl[imageUrl.length - 1]
        const imageDisplayName = image.split('.')
        //console.log("imageDisplayName", imageDisplayName?.[0]);

        const response = await cloudinary.uploader.destroy(imageDisplayName?.[0], {
            resource_type: "image"
        })
        //console.log("avatar updated");
        return 1;
    } catch (error) {
        console.log("Error while file deleting on Cloudinary", error);
        return null
    }
}
export { uploadOnCloudinary, deleteCloudinary }