
const moveDataController = require('../moveDataController');

module.exports = class Movedata extends moveDataController{
	constructor () {
		super()
	}

	async startHere () {
		console.log()
		await this.getAndSaveAllCountriesFromMySql();
		await this.getAndSaveStatesFromMysql()
		await this.getAndSaveLga()
		await this.getAndSaveCommunity();
		await this.getAndSaveStreet();
		await this.getAndUpdateStreetProximity();

		console.log("Data migration was successful. You are now free to eat Abacha or Bole")
	}

	async getAndUpdateStreetProximity() {
		let getStreetsFromMongo = await this.getStreetsFromMongo();
		await this.formatAndEdit(getStreetsFromMongo)
	}

	async getAndSaveStreet () {
		let getMysqlStreets = await this.getMysqlStreets();
		await this.createStreets(getMysqlStreets)
	}

	async getAndSaveStatesFromMysql() {
		let getMysqlStates = await this.getMysqlStates();
		await this.createStates(getMysqlStates)
	}

	async getAndSaveAllCountriesFromMySql () {
		let getMysqlCountries = await this.getMysqlCountries();
		await this.CreateCountries(getMysqlCountries)
	}

	async getAndSaveCommunity() {
		let getMysqlCommunities = await this.getMysqlCommunities();
		await this.createCommunity(getMysqlCommunities)
	}

	async createStates(getMysqlStates) {
		
		let countryIdObject = {};

		let StateDataArray = [];
		for (const [index, d] of getMysqlStates.entries()) {
			let countryMongoId = await this.GetCountryMongoId(d.country_id)
			if (countryMongoId.error == false) {

				let countryId = countryMongoId.result._id.toString();

				if (countryIdObject.countryId == undefined)  {
					countryIdObject[countryId] = countryMongoId.result._id
				}

				StateDataArray[index] = {
					country_id: countryId,
					state_ms_id: d.id,
					name: d.state_name,
					status: d.status
				}

			} else {
				console.log("An error occurred retrieving country ID for saving state")
				return
			}

		}

		let create = await this.saveStatesToMongo(StateDataArray);
		if (create.error == false) {
			console.log("States Created")
			console.log()
			console.log()
		} else {
			console.log("An error occurred creating states")
			return
		}
	}

	async CreateCountries(data) {
		
		console.log("Creating countries for mongo");

		let countryDataArray = [];
		for (const [index, d] of data.entries()) {
			countryDataArray[index] = {
				country_ms_id: d.id,
				name: d.name
			}
		}

		let create = await this.saveContriesToMongo(countryDataArray);

		if (create.error == false) {
			console.log("Countries Created")
			console.log()
			console.log()
		} else {
			console.log("An error occurred creating countries")
			return
		}

	}

	async getAndSaveLga() {
		console.log("Starting Lga");
		let getMysqlLga = await this.getMysqlLga();
		await this.CreateLga(getMysqlLga)

	}

	async CreateLga(data) {
	
		let LgaDataArray = [];
		for (const [index, d] of data.entries()) {
			let stateMongoId = await this.GetStateMongoId(d.state_id)

			

			if (stateMongoId.error == false) {

				LgaDataArray[index] = {
					country_id: stateMongoId.result.country_id,
					state_id: stateMongoId.result._id,
					name: d.lga_name,
					lga_ms_id: d.id
				}

			} else {
				console.log("An error occurred retrieving country ID for saving state")
				return
			}

		}

		let create = await this.saveLgaToMongo(LgaDataArray);
		if (create.error == false) {
			console.log("Lgas Created")
			console.log()
			console.log()
		} else {
			console.log("An error occurred creating Lga")
			return
		}
	}

	async createCommunity(data) {
		console.log("Creating communities")
		let commArray = [];
		for (const [index, d] of data.entries()) {
			let lgaMongoId = await this.GetLgaMongoId(d.lga_id)

			if (lgaMongoId.error == false) {

				commArray[index] = {
					country_id: lgaMongoId.result.country_id,
					state_id: lgaMongoId.result.state_id,
					lga_id: lgaMongoId.result._id,
					name: d.community_name,
					community_ms_id: d.id
				}

			} else {
				console.log("An error occurred retrieving community ID for saving state")
				return
			}

		}

		let create = await this.saveCommunityToMongo(commArray);
		if (create.error == false) {
			console.log("Communities Created")
			console.log()
			console.log()
		} else {
			console.log("An error occurred creating Lga")
			return
		}
	}

	async createStreets(data) {
		
		let streetArray = [];

		for (let [index, street] of data.entries()) {
			let getLgaData = await this.GetCommunityMongoId(street.community_id);

			if (getLgaData.error == false) {

				let proximityArray;

				if (street.proximity != null) {
					proximityArray = street.proximity.trim()
					// for (let x of street.proximity.trim().split(',')) {
					// 	proximityArray.push({"street": x})
					// }
				} else {
					proximityArray = "";
				}

				streetArray[index] = {
					country_id: getLgaData.result.country_id,
					state_id: getLgaData.result.state_id,
					community_id: getLgaData.result._id,
					lga_id: getLgaData.result.lga_id,
					name: street.street_name,
					street_ms_id: street.id,
					oldProximity: proximityArray
				}

			} else {
				console.log("An error occurred retrieving community ID for saving state")
				return
			}

		}

		let create = await this.saveStreetToMongo(streetArray);
		if (create.error == false) {
			console.log("Streets Created")
			console.log()
			console.log()
		} else {
			console.log("An error occurred creating streets")
			return
		}

	}

	async formatAndEdit(data) {

		console.log(`Starting proximity update for ${data.length} streets`);

		let newStreetArray = [];

		for (const [index, street] of data.entries()) {
			
			

			let proxiObjectArray = [];

			if (street.oldProximity != '') {
				let oldProximityCode = street.oldProximity.trim().split(',');

				for (let x of oldProximityCode) {
					let xInt = parseInt(x, 10);
					
					// get _id
					let getStreet_id = await this.getStreetDetails(xInt);

					if (getStreet_id.error == false && getStreet_id.result != null) {
						proxiObjectArray.push({street: getStreet_id.result._id})
					}
		
				}

				let streetId = street._id


				let updateProximity = await this.UpdateStreetProximity(streetId, {proximity: proxiObjectArray});

				if (updateProximity.error == true) {
					console.log("Proximity update failed");
					return
				}

			}

		}

		// unset mysqlId Field

		await this.unsetMysqlIdField();

		console.log()
		console.log()
		console.log()
		console.log()
		console.log("Street proximity updated successfully")

	}
}