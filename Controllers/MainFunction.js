'use-strict'


const fs = require('fs');
const crypto = require("crypto");
const bcrypt = require('bcrypt');

const shortId = require('shortid');
shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ- ');

const https = require('https');

const OneSignal = require('onesignal-node');


let cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const EmailClass = require('./EmailClass');

module.exports = class FunctionRepo extends EmailClass{

    constructor () {
        super()
    }

    async sendPushNotification (userOneSignalId, message, appId = '4077e6c3-299e-4bef-8fcd-7eeec9e2b284') {

        let sendNotification = function (data) {
            let headers = {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": ""
            };
    
            let options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
            };

            try {
                let req = https.request(options, function (res) {
                    res.on('data', function (data) {
        
                    });
                });
    
                req.write(JSON.stringify(data));
                req.end();
            } catch (error) {
                
            }
        };

        let dataObject = {
            app_id: appId,
            contents: {"en": message},
            include_player_ids: [userOneSignalId],
            small_icon: "https://res.cloudinary.com/cudua-images/image/upload/v1604501254/cudua_asset/ic_stat_onesignal_default.png", // can not be an url
            large_icon: "https://res.cloudinary.com/cudua-images/image/upload/v1604500508/cudua_asset/android-icon_aiv0cc.png"
        };
    
        try {
            sendNotification(dataObject);   
        } catch (error) {
            
        }

    }

    async generateId () {
        let orderId = shortId.generate();

        if (orderId.search(" ") > -1 ){
            orderId = orderId.replace(" ", "")
        } 
        
        if (orderId.search("-") > -1 ) {
            orderId = orderId.replace("-", "")
        }

        return orderId.toUpperCase();

    }

    MakeFirstLetterUpperCase (string) {
        string = string.trim()
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

    validateEmailAddress (email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
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
                       error: false,
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


    formatFullname (name) {
        
        // if name contains space, break name into two variables
        name = name.toLowerCase().trim();
        let whitespacePosition = name.search(" ");
        if (whitespacePosition == -1) {
            // no whitespace exists
            return this.MakeFirstLetterUpperCase(name.trim());
        }

        let splitName = name.split(" ");
        let formattedName = "";
        splitName.forEach(element => {
            let newName = this.MakeFirstLetterUpperCase(element.trim());
            formattedName = formattedName + " " + newName
        });
        
        return formattedName.toString().trim();
    }

    async comparePassword (dbPassword, inputPassword) {
        try {
            let compare = await bcrypt.compare(inputPassword, dbPassword);
            return {
                error: false,
                result: compare
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }
    

    SortLocationAlphabetically(dataArray) {
        let dataNames = [];

        // set name
        Array.from(dataArray, x => {
            dataNames.push(x.name);
        });

        let sortedNames = dataNames.sort();

        let newSortedLocation  = [];

        // from the sorted names
        for (let sortedName of sortedNames) {

            // from unsorted subcategories
            for (let unsortedLocation of dataArray) {

                if (sortedName == unsortedLocation.name) {
                    newSortedLocation.push(unsortedLocation)
                }
            }
        }

        return newSortedLocation
        

    }

    SortSubcategories(data) {
        let subcategoryNames = [];

        // set name
        Array.from(data, x => {
            subcategoryNames.push(x.subcategoryName)
        });

        // sort names 
        let sortedNames = subcategoryNames.sort();

        let newSortedsubcategories = [];

        // from the sorted names
        for (let sortedName of sortedNames) {

            // from unsorted subcategories
            for (let unsortedsubCategory of data) {

                if (sortedName == unsortedsubCategory.subcategoryName) {
                    newSortedsubcategories.push(unsortedsubCategory)
                }
            }
        }

        return newSortedsubcategories

    }


    SortCategories (categories) {
        let categoryNames = [];
        
        // set name
        Array.from(categories, x => {
            categoryNames.push(x.categoryName)
        });

        
        let sortCategoryNames = categoryNames.sort();

        let newSortedCategories = [];

        // from the sorted names
        for (let sortedName of sortCategoryNames) {

            // from unsorted categories
            for (let unsortedCategory of categories) {

                if (sortedName == unsortedCategory.categoryName) {
                    newSortedCategories.push(unsortedCategory)
                }
            }
        }
        return newSortedCategories

    }

    checkReservedWords (username) {

        let reservedWords = [
            'cudua',
            'username',
            'notification',
            'following',
            'orders',
            'cart',
            'logout',
            'business',
            'saved',
            'items',
            'profile',
            'dashboard',
            'page',
            'plugins',
            'review',
            'fashion',
            'beauty',
            'studio',
            'search',
            'businesss',
            'info',
            'about',
            'contact',
            'home',
            'terms'
        ];

        for (let index = 0; index < reservedWords.length; index++) {
            if (reservedWords[index] == username.toLowerCase()) {
                return true
                break
            }
        }

        return false

    }
    
}