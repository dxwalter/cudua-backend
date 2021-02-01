'use-strict'

const FunctionRepository = require('../MainFunction');
const CourseCategoryModel = require('../../Models/CourseCategoryModel');


module.exports = class courseController extends FunctionRepository {

    constructor () {
        super();
    }

    async createNewCategoryForCourse (data) {

        try {
            
            let create = await data.save()

            return {
                error: false,
                result: true
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async getAllCourseCategory () {

        try {
            
            let getAll = await CourseCategoryModel.find();

            return {
                error: false,
                result: getAll
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

}