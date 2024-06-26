import fs from "fs"
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloundinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null

        //upload cloudinary
       const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
            
        })
        //console.log("file upload successfuly", response.url)
         fs.unlinkSync(localFilePath)
        return response; 

    } catch (error) {
       fs.unlinkSync(localFilePath)  //remove the localy save temparary save file and upload operation failed 
    }
}
export {uploadOnCloundinary}
