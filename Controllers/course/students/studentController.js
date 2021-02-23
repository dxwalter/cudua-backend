let CourseController = require('../courseManager/courseController')
const StudentModel = require('../../../Models/studentModel')

module.exports = class StudentController extends CourseController {

    constructor () {
        super();
    }

    async emailExists (email) {
        try {
            const findResult = await StudentModel.findOne({
                email: email
            });   

            return {
                error: false,
                result: findResult
            }
    
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async createStudentAccount (createUser) {
        try {

            const create = await createUser.save();
            return {
                error: false,
                result: create
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async findOneStudentAndUpdate(userId, newDataObject) {
        try {
            let updateRecord = await StudentModel.findOneAndUpdate({_id: userId}, { $set:newDataObject }, {new : true });
            return {
                error: false,
                result: updateRecord
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

}