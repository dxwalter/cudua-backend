"use-strict";


const CategoryController = require('../CategoryController');
const NewCategories = require('../../../Models/NewCategories');
const CategoryModel = require('../../../Models/Categories')

module.exports = class CreateCategory extends CategoryController {

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

    async adminCreateCategory(industryId, categoryName, avatar) {

        if (industryId.length == 0 || categoryName.length == 0 || avatar.length == 0) {
            return this.returnMethod(200, false, "An Error occurred with your input");
        }

        // check if category exists
        let checkExistence = await this.checkCategoryExistence(industryId, categoryName);

        if (checkExistence.error) return this.returnMethod(200, false, "An Error occurred from our end");
        if (checkExistence.result != null) return this.returnMethod(200, false, "This category already exist");

        console.log(checkExistence)

        let data = new CategoryModel ({
            name: this.MakeFirstLetterUpperCase(categoryName),
            industry: industryId,
            icon: avatar,
            status: 1
        });

        let createCategory = await this.createNewCategoryForDb(data);

        if (createCategory.error) return this.returnMethod(500, false, "An error occurred from our end. Kindly try again");

        return this.returnMethod(200, true, `Category saved successfully`);

    }

    async createNewCategory (categoryName, subcategories, userId) {
        // validate 
        // check if category exist
        // add



        if (categoryName.length < 3) {
            return this.returnMethod(200, false, "Enter a valid category name");
        }

        if (subcategories.length < 3) {
            return this.returnMethod(200, false, "Type one or multiple subcatgories seperated by comma");
        }

        // check if it exists   


        // create
        const CreateCategory = new NewCategories ({
            name : categoryName,
            author: userId,
            subcategories: subcategories
        });

        let data = await this.CreateNewCategory(CreateCategory);

        if (data.error) return this.returnMethod(500, false, "An error occurred from our end. Kindly try again");

        return this.returnMethod(200, true, `"${categoryName}" has been saved and currently undergoing review and be up in 60 minutes`);


    }

    async createNewSubcategory (categoryId, subcategories, userId) {
        console.log(categoryId)
        console.log(subcategories)
        console.log(userId)
    }

    async getCategory (categoryId) {
        
    }

    async getCategories () {

    }

}