
const CourseController = require('../courseController');
const CourseCategoryModel = require('../../../Models/CourseCategoryModel');

module.exports = class course extends CourseController {
    constructor () {
        super()
    }

    returnMethod (code, success, message) {
        return {
            code, success, message
        }
    }

    returnCategories (categories, code, success, message) {
        return {
            categories, code, success, message
        }
    }

    async createNewCourseCategory(name, imageFile, description) {

        const { filename, mimetype, createReadStream } = await imageFile;

        if (name.length == 0) return this.returnMethod(200, false, "Provide the name of the category");

        if (description.length == 0) return this.returnMethod(200, false, "Provide the description of the category");

        if (filename.length < 1) return this.returnMethod(200, false, "Choose a cover image for this category");

        // encrypt file name
        let encryptedName = this.encryptFileName(filename);

        name = await this.formatFullname(name)

        let newFileName = encryptedName + "." + mimetype.split('/')[1];

        const stream = createReadStream();

        let path = 'uploads/courseCategoryImage/';

        const pathObj = await this.uploadImageFile(stream, newFileName, path);
        
        if (pathObj.error == true) {
            return this.returnMethod(500, false, "An error occurred uploading the image")
        }


        //upload to cloudinary

        let folder = process.env.CLOUDINARY_FOLDER+"/cudua-course/";
        let publicId = encryptedName;
        let tag = 'Category image';
        let imagePath = pathObj.path;

        let moveToCloud = await this.moveToCloudinary(folder, imagePath, publicId, tag);

        let deleteFile = await this.deleteFileFromFolder(imagePath)

        if (moveToCloud.error == true) {
            return this.returnMethod(500, false, `An error occurred moving your picture to the cloud`)
        }

        let categoryData = new CourseCategoryModel ({
            name: name,
            description: description,
            displayPicture: newFileName
        });

        let data = await this.createNewCategoryForCourse(categoryData);

        if (data.error == true) {
            return this.returnMethod(500, false, `An error occurred creating your category`);
        }

        return this.returnMethod(200, true, "Your category was created successfully")

    }

    async getAllCourseCategories () {

        let getAll = await this.getAllCourseCategory()

        if (getAll.error) return this.returnCategories(null, 500, false, "An error occurred get all course categories");

        let categories = getAll.result;

        let formattedArray = [];

        categories.forEach(element => {
            formattedArray.push({
                categoryId: element._id,
                name: element.name,
                displayPicture: element.displayPicture,
                description: element.description
            })
        });

        return this.returnCategories(formattedArray, 200, true, "Categories retrieved successfully")

    }

    async getCategoryById (categoryId) {
        
    }

}