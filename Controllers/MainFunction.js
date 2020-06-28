const Sengrid  = require('@sendgrid/mail');
Sengrid.setApiKey(process.env.SENDGRID_API_KEY);
const fs = require('fs');
const crypto = require("crypto");

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
        const path = `${uploadDir}/${filename}`;
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

    
}