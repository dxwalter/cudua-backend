
const moveDataController = require('../moveDataController');

module.exports = class Movedata extends moveDataController{
	constructor () {
		super()
	}

	async startHere () {
		console.log("Starting here")
		// get all the categories
		await this.getAllCategories();
		await this.getAllSubcategories();
		await this.unsetMysqlIdField()
	}

	async getAllCategories() {
		let mysqlCategories = await this.getCategoriesFromMySql();
		await this.CreateCategories(mysqlCategories)
	}

	async getAllSubcategories() {
		let mysqlSubcategories = await this.getSubcategoriesFromMysql();
		await this.createSubcategories(mysqlSubcategories)
	}

	async createSubcategories(subcategoryData) {
		
		let categoryIdObject = {};

		let SubcategoryDataArray = [];

		for (const [index, d] of subcategoryData.entries()) {

			let categoryMongoId = await this.GetCategoryMongoId(d.cat_id)
			if (categoryMongoId.error == false) {

				let categoryId = categoryMongoId.result._id.toString();

				if (categoryIdObject.categoryId == undefined)  {
					categoryIdObject[categoryId] = categoryMongoId.result._id
				}

				SubcategoryDataArray[index] = {
					category_id: categoryId,
					name: d.name,
					status: 1
				}

			} else {
				console.log("An error occurred retrieving category ID for saving subcategory")
				return
			}

		}

		let create = await this.saveSubcategoriesToMongo(SubcategoryDataArray);
		if (create.error == false) {
			console.log("Subcategory Created")
			console.log()
			console.log()
		} else {
			console.log("An error occurred creating subcategory")
			return
		}
	}

	async CreateCategories(data) {
		
		console.log("Creating categories for mongo");

		let categoriesDataArray = [];
		for (const [index, d] of data.entries()) {
			categoriesDataArray[index] = {
				ms_id: d.id,
				name: d.name,
				status: 1
			}
		}

		let create = await this.saveCategoriesToMongo(categoriesDataArray);

		if (create.error == false) {
			console.log("categories Created")
			console.log()
			console.log()
		} else {
			console.log("An error occurred creating categories")
			return
		}

	}


}