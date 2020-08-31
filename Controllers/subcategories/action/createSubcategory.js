"use-strict";

let SubcategoryController = require('../SubcategoryController')
const NewSubcategories = require('../../../Models/NewSubcategories');


module.exports = class CreateSubategory extends SubcategoryController {

    constructor () { 
        super(); 
    }

    
    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async createNewSubcategory(categoryId, subcategories, userId) {
        if (categoryId.length < 1) return this.returnMethod(200, false, "Choose a category to continue");

        if (subcategories.length < 3) return this.returnMethod(200, false, "Type one or multiple subcatgories seperated by comma");

        let bind = new NewSubcategories({
            author: userId,
            category_id: categoryId,
            subcategories: subcategories
        })

        let create = await this.createSubcategory(bind)

        if (create.error) return this.returnMethod(500, false, "An error occurred from our end. Kindly try again")

        return this.returnMethod(200, true, "The subcategory(ies) is/are have been saved and currently undergoing review")
    }

    async confirmCategory (categoryId) {
        

    }

    async getSubcategory (categoryId) {
        
    }

    async getSubcategories () {

    }

}