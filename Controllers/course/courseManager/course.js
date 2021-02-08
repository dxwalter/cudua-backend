
const CourseController = require('../courseController');
const CourseModel = require('../../../Models/courseModel')
const CourseContentModel = require('../../../Models/courseContentModel')

module.exports = class courseManager extends CourseController {
    constructor () {
        super()
    }

    createCourseResponse (courseId, code, success, message) {
        return {
            courseId, code, success, message
        }
    }

    createCourseContentResponse (contentId, code, success, message) {
        return {
            contentId, code, success, message
        }
    }

    async createNewCourse (name, price, category, avatar, description) {

        var { filename, mimetype, createReadStream } = await avatar;

        if (name.length == 0) return this.createCourseResponse(null, 500, false, "What is the name of the course?");

        if (category.length == 0) return this.createCourseResponse(null, 500, false, "Select a category for this course");

        if (filename.length == 0) return this.createCourseResponse(null, 500, false, "Choose a cover image for the course");

        if (description.length == 0) return this.createCourseResponse(null, 500, false, "Write a description of this course?");

        // encrypt file name
        let encryptedName = this.encryptFileName(filename);

        name = await this.MakeFirstLetterUpperCase(name)
        

        let newFileName = encryptedName + "." + mimetype.split('/')[1];

        const stream = createReadStream();

        let path = 'uploads/courseCategoryImage/';

        const pathObj = await this.uploadImageFile(stream, newFileName, path);
        
        if (pathObj.error == true) {
            return this.createCourseResponse(null, 500, false, "An error occurred uploading the image")
        }

        //upload to cloudinary

        let folder = process.env.CLOUDINARY_FOLDER+"/cudua-course/";
        let publicId = encryptedName;
        let tag = 'Course image';
        let imagePath = pathObj.path;

        let moveToCloud = await this.moveToCloudinary(folder, imagePath, publicId, tag);

        let deleteFile = await this.deleteFileFromFolder(imagePath)
        
        if (moveToCloud.error == true) {
            return this.createCourseResponse(null, 500, false, `An error occurred moving your picture to the cloud`)
        }

        let courseData = new CourseModel ({
            name: name,
            description: description,
            displayPicture: newFileName,
            category: category,
            price: price,
        });

        let courseId = courseData._id

        let data = await this.insertNewCourse(courseData);

        if (data.error == true) {
            return this.createCourseResponse(null, 500, false, `An error occurred creating your course`);
        }

        return this.createCourseResponse(courseId, 200, true, "Your course was created successfully")

    }

    async createNewCourseContent (courseId, title, videoLink, avatar, courseMaterial) {

        if (courseId.length == 0) return this.createCourseContentResponse(null, 500, false, "An error occured. Refresh page and try again")

        // check if course exist
        let courseCheck = await this.checkIfCourseExists(courseId);

        if (courseCheck.result == null || courseCheck.error == true) {
            return this.createCourseContentResponse(null, 500, false, "An error occured. This course does not exist")
        }

        if (title.length == 0) return this.createCourseContentResponse(null, 500, false, "Enter this content title.");

        title = this.MakeFirstLetterUpperCase(title);

        if (videoLink.length == 0) return this.createCourseContentResponse(null, 500, false, "Enter the link to your video content");

        var { filename, mimetype, createReadStream } = await avatar;

        if (filename.length == 0) return this.createCourseContentResponse(null, 500, false, "Choose an image for this course content");

        // upload image file
        let encryptedName = this.encryptFileName(filename);

        let newFileName = encryptedName + "." + mimetype.split('/')[1];

        const stream = createReadStream();

        let path = 'uploads/courseCategoryImage/';
        const pathObj = await this.uploadImageFile(stream, newFileName, path);
        
        if (pathObj.error == true) {
            return this.createCourseContentResponse(null, 500, false, "An error occurred uploading the image")
        }

        //upload to cloudinary

        let folder = process.env.CLOUDINARY_FOLDER+"/cudua-course/";
        let publicId = encryptedName;
        let tag = 'Course image';
        let imagePath = pathObj.path;

        let moveToCloud = await this.moveToCloudinary(folder, imagePath, publicId, tag);

        let deleteFile = await this.deleteFileFromFolder(imagePath)
        
        if (moveToCloud.error == true) {
            return this.createCourseContentResponse(null, 500, false, `An error occurred moving your picture to the cloud`)
        }


        let courseContentData = new CourseContentModel ({
            title: title,
            videoLink: videoLink,
            materials: courseMaterial,
            courseId: courseId,
            displayPicture: newFileName
        });

        let contentId = courseContentData._id

        let data = await this.insertNewCourseContent(courseContentData);

        
        if (data.error == true) {
            return this.createCourseContentResponse(null, 500, false, `An error occurred creating your course content`);
        }

        return this.createCourseContentResponse(contentId, 200, true, "Your course content was created successfully")
        
    }

    getCourseContentResponse (courseContent, code, success, message, courseDetails = null) {
        return {
            courseContent, code, success, message, courseDetails
        }
    }

    async getCourseContentById (courseId) {

        
        if (courseId.length == 0) return this.getCourseContentResponse([], 500, false, "No course ID was provided");

        let getCourseContent = await this.getCourseContentUsingId(courseId);

        if (getCourseContent.error) return this.getCourseContentResponse([], 500, false, "An error occurred  retrieving course content");

        let courseContentArray = [];

        getCourseContent.result.forEach(element => {
            courseContentArray.push({
                keywords: element.keywords,
                title: element.title,
                videoLink: element.videoLink,
                materials: element.materials,
                courseId: element.courseId,
                displayPicture: element.displayPicture,
                contentId: element._id
            })
        });


        let getCourseDetails = await this.getCourseDetails(courseId);

        let courseDetails = null

        if (getCourseDetails.success == true) {
            if (getCourseDetails.course != null) {
                courseDetails = getCourseDetails.course
            }
        }



        return this.getCourseContentResponse(courseContentArray, 200, true, "Content retrieved", courseDetails);

    }


    getCoursesDetailsResponse (course, code, success, message) {
        return {course, code, success, message}
    }

    async getCourseDetails (courseId) {

        let getCourseDetails = await this.GetCourseById(courseId);

        if (getCourseDetails.error) return this.getCoursesDetailsResponse(null, 200, false, "An error occurred retrieving the courses")

        let courses = getCourseDetails.result

        if (courses.length == 0) this.getCoursesDetailsResponse(null, 200, false, "No course has been added");


        let courseObject = {
            courseId: courses._id,
            price: courses.price,
            name: courses.name,
            description: courses.description,
            displayPicture: courses.displayPicture,
            publish: courses.publish == 0 ? false : true,
            category: {
                name: courses.category.name,
                displayPicture: courses.category.displayPicture,
                description: courses.category.description,
                categoryId: courses.category._id,
            },
        }


        return this.getCoursesDetailsResponse(courseObject, 200, true, "Course retrieved");

    }

    getAllCoursesResponse (courses, code, success, message) {
        return {
            courses, code, success, message
        }
    }


    async GetAllCourseListing () {
        
        let getCourses = await this.GetAllCourses();

        if (getCourses.error) return this.getAllCoursesResponse([], 200, false, "An error occurred retrieving the courses")

        let courses = getCourses.result

        if (courses.length == 0) this.getAllCoursesResponse([], 200, false, "No course has been added");

        let coursesArray = [];

        for (let [index, element] of courses.entries()) {
            coursesArray.push({
                courseId: element._id,
                price: element.price,
                name: element.name,
                description: element.description,
                displayPicture: element.displayPicture,
                publish: element.publish == 0 ? false : true,
                category: {
                    name: element.category.name,
                    displayPicture: element.category.displayPicture,
                    description: element.category.description,
                    categoryId: element.category._id,
                },
                courseContent: []
            })
            let getCourseContent = await this.getCourseContentById(element._id)
            coursesArray[index].courseContent = getCourseContent.courseContent
            
        }



        return this.getAllCoursesResponse(coursesArray, 200, true, "Course retrieved");

        
    }

    GetCourseVideoContentResponse (videoContent, code, success, message) {
        return {videoContent, code, success, message}
    }

    async GetCourseVideoContent (contentId) {
        
        let getContentVideo = await this.GetContentVideo(contentId);

        if (getContentVideo.error) return this.GetCourseVideoContentResponse(null, 200, false, "An error occurred getting this course content. Please try again")

        let courseContent = getContentVideo.result

        if (courseContent == null) return this.GetCourseVideoContentResponse(null, 500, false, "This course content does not exist")

        let contentObject = {
            keywords: courseContent.keywords,
            videoLink: courseContent.videoLink,
            title: courseContent.title,
            materials: courseContent.materials,
            courseId: courseContent.courseId,
            displayPicture: courseContent.displayPicture,
            contentId: courseContent._id
        }

        return this.GetCourseVideoContentResponse(contentObject, 200, true, "Course retrieved");

        
    }

}