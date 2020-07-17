const Connection = require('./mysqlConnection');
const util = require('util');
// node native promisify
const query = util.promisify(Connection.query).bind(Connection);

const CountryModel = require('../../Models/LocationCountryModel');
const StateModel = require('../../Models/LocationState');
const LocationLga = require('../../Models/LocationLga');
const LocationCommunity = require('../../Models/LocationCommunity');
const LocationStreet = require('../../Models/LocationStreet');
const LocationCountryModel = require('../../Models/LocationCountryModel');
const LocationState = require('../../Models/LocationState');

module.exports = class moveDataController {
    
    constructor () {

    }

    returnResult(data) {
        return JSON.parse(JSON.stringify(data))
    }

    async GetCountryMongoId (mysqlId) {
        try {
            const findProduct = await CountryModel.findOne({country_ms_id: mysqlId}).exec();

            return {
                result: findProduct,
                error: false
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async GetStateMongoId (mysqlId) {
        try {
            const find = await StateModel.findOne({state_ms_id: mysqlId}).exec();

            return {
                result: find,
                error: false
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async GetCommunityMongoId (mysqlId) {
        try {
            const find = await LocationCommunity.findOne({community_ms_id: mysqlId}).exec();

            return {
                result: find,
                error: false
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async GetLgaMongoId (mysqlId) {
        try {
            const find = await LocationLga.findOne({lga_ms_id: mysqlId}).exec();

            return {
                result: find,
                error: false
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async getMysqlCountries() {
        console.log('Getting countries')
        let getCountries = await query('SELECT * FROM `countries`');
        return this.returnResult(getCountries)
    }

    async getMysqlStreets() {
        console.log('Getting Streets')
        let getStreets = await query('SELECT * FROM `streets`');
        return this.returnResult(getStreets)
    }

    async getMysqlLga() {
        console.log('Getting Lga')
        let getLga = await query('SELECT * FROM `lga`');
        return this.returnResult(getLga)
    }

    async getMysqlStates () {
        console.log('Getting states')
        let getStates = await query('SELECT * FROM `state`');
        return this.returnResult(getStates);
    }

    async getMysqlCommunities () {
        console.log('Getting communities')
        let getComm = await query('SELECT * FROM `communities`');
        return this.returnResult(getComm);
    }

    async saveContriesToMongo (data) {
    
        try {
            let createMany = await CountryModel.insertMany(data);
            
            if (createMany.length > 0) return {error: false}

        } catch (error) {

            return {
                error: true
            }
        }
    }

    async saveStatesToMongo (data) {
    
        try {
            let createMany = await StateModel.insertMany(data);
            
            if (createMany.length > 0) return {error: false}

        } catch (error) {
            
            return {
                error: true
            }
        }
    }

    async saveLgaToMongo (data) {
    
        try {
            let createMany = await LocationLga.insertMany(data);
            
            if (createMany.length > 0) return {error: false}

        } catch (error) {
            
            return {
                error: true
            }
        }
    }

    async saveCommunityToMongo (data) {
    
        try {
            let createMany = await LocationCommunity.insertMany(data);
            
            if (createMany.length > 0) return {error: false}

        } catch (error) {
            
            return {
                error: true
            }
        }
    }

    async saveStreetToMongo (data) {
    
        try {
            let createMany = await LocationStreet.insertMany(data);
            
            if (createMany.length > 0) return {error: false}

        } catch (error) {
            return {
                error: true
            }
        }
    }

    async getStreetsFromMongo() {
        try {
            let find =  await LocationStreet.find();

            return find

        } catch (error) {
            
        }
    } 

    async getStreetDetails(id) {
        try {
            let find = await LocationStreet.findOne({street_ms_id: id}).exec();
            return {
                error: false,
                result: find
            }
        } catch (error) {
            return {
                error: true
            }   
        }

    }

    async UpdateStreetProximity(streetId, object) {
        try {
            let update = await LocationStreet.findByIdAndUpdate({_id: streetId}, { $set: object})

            return {
                error: false
            }

        } catch (error) {
            console.log(error)
            return {
                error: true
            }
        }
    }

    async unsetMysqlIdField() {
        await LocationCountryModel.updateMany({}, {$unset:{"country_ms_id":1}})
        await LocationState.updateMany({}, {$unset:{"state_ms_id":1}})
        await LocationLga.updateMany({}, {$unset:{"lga_ms_id":1}})
        await LocationCommunity.updateMany({}, {$unset:{"community_ms_id":1}})
        await LocationStreet.updateMany({}, {$unset:{"street_ms_id":1}})
        await LocationStreet.updateMany({}, {$unset:{"oldProximity":1}})
    }
}