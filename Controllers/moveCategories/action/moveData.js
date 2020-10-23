
const moveDataController = require('../moveDataController');

module.exports = class Movedata extends moveDataController{
	constructor () {
		super()
	}

	async startHere () {
		console.log("Starting here")
		// get all the categories
		await this.getAllIndustries()
		await this.getAllCategories();
		await this.getAllSubcategories();
		await this.unsetMysqlIdField()
	}

	async getAllIndustries () {
		let mysqlIndustries = await this.getIndustriesFromMysql();
		await this.CreateIndustries(mysqlIndustries)
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

	async CreateIndustries (data) {
		console.log("Creating industries for mongo");
		let industryArray = [];
		for (const [index, d] of data.entries()) {
			industryArray[index] = {
				ms_id: d.id,
				name: d.name,
			}
		}

		let create = await this.saveIndustriesToMongo(industryArray);

		if (create.error == false) {
			console.log("Industries Created")
			console.log()
			console.log()
		} else {
			console.log("An error occurred Industries categories")
			return
		}

	}

	async CreateCategories(data) {
		
		console.log("Creating categories for mongo");

		let industryIdObject = {};

		let categoriesDataArray = [];

		for (const [index, d] of data.entries()) {
			
			let industryMongoId = await this.GetIndustryMongoId(d.industry);

			if (industryMongoId.error == false) {

				let industryId = industryMongoId.result._id.toString();

				if (industryIdObject.industryId == undefined)  {
					industryIdObject[industryId] = industryMongoId.result._id
				}

				categoriesDataArray[index] = {
					ms_id: d.id,
					name: d.name,
					industry: industryId,
					status: 1
				}
			} else {
				console.log("An error occurred retrieving industry ID for saving category")
				return
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