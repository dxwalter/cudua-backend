const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    MONGODB_URI : process.env.MONGODB_URI,
    AppSecret: process.env.SHARED_SECRET,
    SendGridApiKey: process.env.SENDGRID_API_KEY,
    port: process.env.PORT,

    CloudinaryName: process.env.CLOUDINARY_NAME,
    CloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    CloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    CloudinaryURL: process.env.CLOUDINARY_URL,
}
