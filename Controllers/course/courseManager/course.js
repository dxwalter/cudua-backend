
const CourseController = require('./courseController');
const CourseModel = require('../../../Models/courseModel')
const EnrolledCourseModel = require('../../../Models/EnrolledCourseModel')
const CourseContentModel = require('../../../Models/courseContentModel');
const CompletedCourseContent = require('../../../Models/completedCourseContent');
const CourseReview = require('../../../Models/CourseReview');

module.exports = class courseManager extends CourseController {
    constructor () {
        super()
    }

    returnMethod (code, success, message) {
        return {
            code, success, message
        }
    }

    returnCourseReviews (reviews, code, success, message) {
        return {
            reviews, code, success, message
        }
    }

    async GetAllReviews () {

        let getReviews = await this.GetAllCourseReviews();

        if (getReviews.error) return this.returnCourseReviews(null, 500, false, "An error occurred get reviews");

        if (getReviews.result.length == 0) {
            return this.returnCourseReviews(null, 200, false, "No review has been added to this website")
        }

        let reviewArray = [];

        for (let review of getReviews.result) {
            reviewArray.push({
                author: review.student.fullname,
                displayPicture: review.student.profilePicture,
                reviewScore: review.rating,
                description: review.description
            })
        }


        return this.returnCourseReviews(reviewArray, 200, true, "Reviews retrieved")

    }

    async enrollInCourse (userId, courseId, transactionRef) {

        if (userId.length == 0 || courseId.length == 0 || transactionRef.length == 0) {
            return this.returnMethod(500, false, "An error occurred with your entry. Kindly try again")
        }

        let saveData = new EnrolledCourseModel({
            studentId: userId,
            courseId: courseId,
            transactionRefId: transactionRef
        })

        let enrollStudent = await this.saveEnrollmentIntoCourse(saveData);

        if (enrollStudent.error == true) return this.returnMethod(500, false, "An error occurred enrolling you into this course.")

        return this.returnMethod(200, true, "You have successfully enrolled into this course.")

    }

    createFunnelPage (name) {
        
        let nameArray = name.trim().split(" ")

        let funnelName = ""
        
        if (nameArray.length > 3) {

            for (let [index, name] of nameArray.entries()) {
                if (index == 2) {
                    funnelName += `${name}`
                    break
                } else {
                    funnelName += `${name}-`
                }
            }

        } else {
            funnelName = `${nameArray[0]}-${nameArray[1]}-${nameArray[2]}`
        }

        return funnelName.toLowerCase();

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
            funnelPage: ""
        });



        let courseId = courseData._id

        let funnelPage = await this.createFunnelPage(name);

        courseData.funnelPage = funnelPage;

        let data = await this.insertNewCourse(courseData);

        if (data.error == true) {
            return this.createCourseResponse(null, 500, false, `An error occurred creating your course`);
        }

        return this.createCourseResponse(courseId, 200, true, "Your course was created successfully")

    }

    async createNewCourseContent (courseId, title, videoLink, avatar, courseMaterial, tutorialDescription) {

        if (courseId.length == 0) return this.createCourseContentResponse(null, 500, false, "An error occured. Refresh page and try again")

        // check if course exist
        let courseCheck = await this.checkIfCourseExists(courseId);

        if (courseCheck.result == null || courseCheck.error == true) {
            return this.createCourseContentResponse(null, 500, false, "An error occured. This course does not exist")
        }

        if (title.length == 0) return this.createCourseContentResponse(null, 500, false, "Enter this content title.");

        if (tutorialDescription.length == 0) return this.createCourseContentResponse(null, 500, false, "Enter a short description for this tutorial");

        title = this.MakeFirstLetterUpperCase(title);

        // if (videoLink.length == 0) return this.createCourseContentResponse(null, 500, false, "Enter the link to your video content");

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
            displayPicture: newFileName,
            description: tutorialDescription
        });

        let contentId = courseContentData._id

        let data = await this.insertNewCourseContent(courseContentData);

        
        if (data.error == true) {
            return this.createCourseContentResponse(null, 500, false, `An error occurred creating your course content`);
        }

        return this.createCourseContentResponse(contentId, 200, true, "Your course content was created successfully")
        
    }


    async editCourseContent (courseId, title, videoLink, avatar, courseMaterial, contentId) {

        if (courseId.length == 0) return this.returnMethod(500, false, "An error occured. Refresh page and try again")
        if (contentId.length == 0) return this.returnMethod(500, false, "An error occured. Refresh page and try again")

        // check if course exist
        let courseCheck = await this.checkIfCourseExists(courseId);

        if (courseCheck.result == null || courseCheck.error == true) {
            return this.returnMethod(500, false, "An error occured. This course does not exist")
        }

        if (title.length == 0) return this.returnMethod(500, false, "Enter this content title.");

        title = this.MakeFirstLetterUpperCase(title);

        // if (videoLink.length == 0) return this.returnMethod(500, false, "Enter the link to your video content");

        var { filename, mimetype, createReadStream } = await avatar;

        let newFileName = ""

        if (filename != undefined){
         
            // upload image file
            let encryptedName = this.encryptFileName(filename);

            newFileName = encryptedName + "." + mimetype.split('/')[1];

            const stream = createReadStream();

            let path = 'uploads/courseCategoryImage/';
            const pathObj = await this.uploadImageFile(stream, newFileName, path);
            
            if (pathObj.error == true) {
                return this.returnMethod(500, false, "An error occurred uploading the image")
            }

            //upload to cloudinary

            let folder = process.env.CLOUDINARY_FOLDER+"/cudua-course/";
            let publicId = encryptedName;
            let tag = 'Course image';
            let imagePath = pathObj.path;

            let moveToCloud = await this.moveToCloudinary(folder, imagePath, publicId, tag);

            let deleteFile = await this.deleteFileFromFolder(imagePath)
            
            if (moveToCloud.error == true) {
                return this.returnMethod(500, false, `An error occurred moving your picture to the cloud`)
            }
            
        }


        let courseContentData = {
            title: title,
            videoLink: videoLink,
            materials: courseMaterial,
            courseId: courseId,
        };

        if (newFileName.length > 0 && filename != undefined) {
            courseContentData.displayPicture = newFileName
        }

        let data = await this.findOneAndUpdateContent(contentId, courseContentData);

        
        if (data.error == true) {
            return this.returnMethod(500, false, `An error occurred updated your course content`);
        }

        return this.returnMethod(200, true, "Your course content was updated successfully")
        
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
                description: element.description,
                contentId: element._id,
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

    async checkIfCourseItemHasBeenCompleted (userId, courseId, contentId) {

        let checkIfContentStatus = await this.getCompletedContent(userId, courseId, contentId)

        if (checkIfContentStatus.error) return false

        if (checkIfContentStatus.error == false && checkIfContentStatus.result == null) return false

        return true;

    }

    async studentGetCourseContentById (userId, courseId) {
        
        if (courseId.length == 0) return this.getCourseContentResponse([], 500, false, "No course ID was provided");

        let checkIfEnrolled = await this.checkIfEnrolled(userId, courseId)

        if (checkIfEnrolled.error == true) return this.getCourseContentResponse([], 500, false, "An error occurred  retrieving course content");
        if (checkIfEnrolled.result == null) return this.getCourseContentResponse([], 500, false, "You are not enrolled into this course.");

        let getCourseContent = await this.getCourseContentUsingId(courseId);

        if (getCourseContent.error) return this.getCourseContentResponse([], 500, false, "An error occurred  retrieving course content");

        let courseContentArray = [];

        for (let element of getCourseContent.result) {

            courseContentArray.push({
                keywords: "",
                title: element.title,
                videoLink: element.videoLink,
                materials: element.materials,
                courseId: element.courseId,
                displayPicture: element.displayPicture,
                contentId: element._id,
                description: element.description,
                isCompleted: await this.checkIfCourseItemHasBeenCompleted(userId, courseId, element._id)
            })
        }

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
            funnelPage: courses.funnelPage == null ? "" : courses.funnelPage,
            publish: courses.publish == 0 ? false : true,
            reviewScore: courses.reviewScore,
            enrolledCount: await this.getCourseEnrollmentCount(courseId),
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
            
            let enrollCourseCount = await this.getCourseEnrollmentCount(element._id);

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
                courseContent: [],
                enrolledCount: enrollCourseCount,
                reviewScore: 0
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

    async changeCoursePublishState (courseId, state) {

        if (courseId.length == 0) {
            return this.returnMethod(500, false, "An error occurred. Refresh page and try again");
        }

        let changeState = await this.findOneAndUpdate(courseId, {publish: state});

        if (changeState.error == false) {

            if (state == false) {
                return this.returnMethod(200, true, "This course was unpublished successfully");
            } else{
                return this.returnMethod(200, true, "This course was published successfully")
            }

        } else {
            return this.returnMethod(500, false, "An error occurred. Refresh page and try again");
        }
        
    }

    async editCourseDetails (courseId, name, price = 0, category, avatar, description, funnelPage) {

        var { filename, mimetype, createReadStream } = await avatar;

        if (name.length == 0) return this.returnMethod(500, false, "What is the name of the course?");

        if (category.length == 0) return this.returnMethod(500, false, "Select a category for this course");

        if (description.length == 0) return this.returnMethod(500, false, "Write a description of this course?");

        if (funnelPage.length == 0) {
            return this.returnMethod(500, false, "What is the name of the funnel page you want to use?");
        }

        
        let newFunnelPage = this.createFunnelPage(funnelPage)

        let newFileName = ""

        if (filename != undefined) {
            // encrypt file name
            let encryptedName = this.encryptFileName(filename);

            name = await this.MakeFirstLetterUpperCase(name)


            newFileName = encryptedName + "." + mimetype.split('/')[1];

            const stream = createReadStream();
    
            let path = 'uploads/courseCategoryImage/';

            const pathObj = await this.uploadImageFile(stream, newFileName, path);
        
            if (pathObj.error == true) {
                return this.returnMethod(null, 500, false, "An error occurred uploading the image")
            }

            //upload to cloudinary

            let folder = process.env.CLOUDINARY_FOLDER+"/cudua-course/";
            let publicId = encryptedName;
            let tag = 'Course image';
            let imagePath = pathObj.path;

            let moveToCloud = await this.moveToCloudinary(folder, imagePath, publicId, tag);

            let deleteFile = await this.deleteFileFromFolder(imagePath)
            
            if (moveToCloud.error == true) {
                return this.returnMethod(null, 500, false, `An error occurred moving your picture to the cloud`)
            }

        } 

        let editedCoureObject = {
            name: name,
            description: description,
            category: category,
            price: price,
            funnelPage: newFunnelPage
        };

        if (filename != undefined && newFileName.length > 0) {
            editedCoureObject.displayPicture = newFileName
        }

        let data = await this.findOneAndUpdate(courseId, editedCoureObject);

        if (data.error == true) {
            return this.returnMethod(500, false, `An error occurred editing your course`);
        }

        return this.returnMethod(200, true, "Your course was edited successfully")
    }

    async studentGetCourseVideo (userId, courseId, contentId) {
        
        if (courseId.length == 0 || contentId.length == 0) return this.GetCourseVideoContentResponse(null, 500, false, "An error occurred. You do not have the credentials required to view this content.");

        // check if enrolled
        let checkIfEnrolled = await this.checkIfEnrolled(userId, courseId)

        if (checkIfEnrolled.error == true) return this.GetCourseVideoContentResponse([], 500, false, "An error occurred  retrieving course content");
        if (checkIfEnrolled.result == null) return this.GetCourseVideoContentResponse([], 500, false, "You are not enrolled into this course.");


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
            description: courseContent.description,
            contentId: courseContent._id
        }

        return this.GetCourseVideoContentResponse(contentObject, 200, true, "Content retrieved");

    }

    async MarkContentAsComplete (userId, courseId, contentId) {

        if (courseId.length == 0 || contentId.length == 0) return this.returnMethod(500, false, "An error occurred. Kindly refresh and try again");

        let markContentAsComplete = new CompletedCourseContent({
            courseId: courseId,
            contentId: contentId,
            studentId: userId
        });

        let saveData = await this.SaveCompletedCourseContent(markContentAsComplete);

        if (saveData.error) return this.returnMethod(500, false, "An error occurred. Kindly try again");

        return this.returnMethod(200, true, "You have successfully completed this tutorial")
    }

    async MarkCourseAsComplete (userId, courseId) {
        
        if (userId.length == 0 || courseId.length == 0) return this.returnMethod(500, false, "An error occurred. Kindly refresh this page");

        let updateRecord = await this.findEnrolledCourseAndUpdate(userId, courseId, {completedStatus: true});

        if (updateRecord.error) return this.returnMethod(500, false, "An error occurred. Kindly try again");

        return this.returnMethod(200, true, "Course marked as completed")
    }

    async updateReviewScore (courseId) {

        let getAllReviews = await this.GetReviewScore(courseId);
        
        if (getAllReviews.error) return this.returnMethod(200, true, "Your review was submitted successfully.")

        let reviewCount = getAllReviews.result.length;
        let addedScores = 0;

        for (let reviewScore of getAllReviews.result) {
            addedScores = addedScores + parseInt(reviewScore.rating, 10);
        }

        let courseReviewScore = addedScores / reviewCount;

        // update in course model
        await this.findOneAndUpdate(courseId, {'reviewScore': courseReviewScore.toFixed(1)})
    }

    async CreateCourseReview (courseId, studentId, reviewScore = 1, description) {

        if (courseId.length == 0 || studentId.length == 0) {
            this.returnMethod(500, false, "An error occurred. Kindly refresh the page and try again")
        }


        // // check if student has written before
        // let checkReview = await this.checkIfReviewExists(studentId, courseId);


        // if (checkReview.error == true) return this.returnMethod(500, false, "An error occurred. Kindly try again");

        // if (checkReview.result != null) {
        //     // update review

        //     let reviewId = checkReview.result._id;  
        //     let newData = {
        //         rating: reviewScore,
        //         description: description
        //     }

        //     let update = await this.findOneReviewAndUpdate(reviewId, newData);
        //     if (update.error) return this.returnMethod(500, false, `An error occurred while updating your review`);

        //     this.updateReviewScore(courseId)

        //     return this.returnMethod(200, true, "Your review was submitted successfully.");

        // }


        // create review

        const create = new CourseReview({
            student: studentId,
            courseId: courseId,
            rating: reviewScore,
            description: description
        });

        let saveRecord = await this.createCourseReview(create);

        if (saveRecord.error) return this.returnMethod(500, false, "An error occurred saving your review");

        this.updateReviewScore(courseId)

        return this.returnMethod(200, true, "Your review was submitted successfully.")

    }

}