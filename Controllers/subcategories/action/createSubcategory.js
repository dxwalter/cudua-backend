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

        return this.returnMethod(200, true, "The subcategory(ies) have been saved and currently undergoing review")
    }


    async AdminCreateSubcategory(categoryId, subcategories, userId) {
        if (categoryId.length < 1) return this.returnMethod(200, false, "Choose a category to continue");

        if (subcategories.length < 3) return this.returnMethod(200, false, "Type one or multiple subcatgories seperated by comma");

        let subcategoriesArray = subcategories.split(',');

        let formattedSubcategories = [];

        for (let x of subcategoriesArray) {
            if (x.length > 2) { 
                // check if subcategory exists
                let check = await this.checkSubcategoryExists(categoryId, this.MakeFirstLetterUpperCase(x.trim()));
                if (check.error == false && check.result == null) {
                    formattedSubcategories.push({
                        category_id: categoryId,
                        name: this.MakeFirstLetterUpperCase(x.trim()),
                        status: 1
                    })
                }
            }
        }

        if (formattedSubcategories.length == 0) return this.returnMethod(200, false, "The subcategories you added already exist");


        let create = await this.createSubcategories(formattedSubcategories)

        if (create.error) return this.returnMethod(500, false, "An error occurred from our end. Kindly try again")

        return this.returnMethod(200, true, "The subcategories have been saved.")
    }

    async confirmCategory (categoryId) {
        

    }

    async getSubcategory (categoryId) {
        
    }

    async getSubcategories () {

    }

}