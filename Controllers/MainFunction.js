const Sengrid  = require('@sendgrid/mail');
Sengrid.setApiKey(process.env.SENDGRID_API_KEY);
const fs = require('fs');
const crypto = require("crypto");

let cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = class FunctionRepo {

    constructor () {}
    
    sendEmail (emailObj) {
        try {
            return Sengrid.send(emailObj);   
        } catch (error) {  
            console.log(error)            
        }
    }

    MakeFirstLetterUpperCase (string) {
        return string[0].toUpperCase() +  string.slice(1);
    }

    uploadImageFile = async ( stream, filename, filePath ) => {
        const uploadDir = filePath;
        const path = `${uploadDir}${filename}`;
        return new Promise((resolve, reject) =>
            stream
                .on('error', error => {
                    if (stream.truncated)
                        // delete the truncated file
                        fs.unlinkSync(path);
                    reject({path: false, error: true});
                })
                .pipe(fs.createWriteStream(path))
                .on('error', error => reject({path: false, error: true}))
                .on('finish', () => resolve({ path: path, error:false }))
        );
    }

    encryptFileName (originalName) {
        return crypto.createHmac('sha256', process.env.SHARED_SECRET).update(originalName).digest('hex')
    }

    async deleteFileFromFolder(path) {
        try {
            fs.unlinkSync(path)
            return true
        } catch(err) {
            return false
        }
    }

    HashFileName (originalName) {
        return crypto.createHmac('sha256', process.env.SHARED_SECRET).update(originalName).digest('hex')
    }

    async moveToCloudinary (folder, imagePath, publicId, tag) {
    
        try {

            let returnData;

            let data = await cloudinary.uploader.upload(
                imagePath, {
                    folder: folder,
                    unique_filename: true,
                    use_filename:true,
                    public_id: publicId, 
                    tags: tag,
                    overwrite: false
                }, function (error, result) {
                    returnData = {
                       error: error,
                       result: result
                   }
                }
            );

            return returnData
            
        } catch (error) {
            return {
                error: true,
                message: error
            }
        }
        
    }

    async removeFromCloudinary (publicId, fileType) {
        let returnData;
        cloudinary.uploader.destroy(publicId, {
            resource_type: fileType
        }, function (error, result) {
            returnData = {
                error: error,
                result: result
            }
        });
    }
}