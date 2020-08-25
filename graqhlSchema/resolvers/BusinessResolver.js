
const UsernameActions = require('../../Controllers/business/action/usernameActions')
const CreateBusiness = require('../../Controllers/business/action/createBusiness') 
const EditBusinessProfile = require('../../Controllers/business/action/editBusinessProfile') 

const BusinessReview = require('../../Controllers/business/action/businessReview')

const { GraphQLUpload } = require('apollo-upload-server');


module.exports = {
    Upload: GraphQLUpload,
    Query: {
        GetSingleBusinessDetails (parent, args, context, info) {
            console.log(args)
        },
        CheckUsernameExists(parent, args, context, info) {
            let check = new UsernameActions();
            return check.CheckUsernameExistence(args.input.username);
        },
        GetBusinessReview(_, args, context) {
            
        }
    },
    Mutation: {
        CreateBusinessAccount(parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let createBusinessObject = new CreateBusiness(args.input);
            return createBusinessObject.validateBusinessInput(userId);
        },
        EditBusinessBasicDetails(parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let edit = new EditBusinessProfile();
            return edit.basicDetails(args.input, userId);
        },
        EditBusinessPhoneNumber(parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let edit = new EditBusinessProfile();
            return edit.editBusinessPhoneNumber(args.input.phoneNumbers, args.input.businessId, userId);
        },
        EditBusinessEmailAddress(parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let edit = new EditBusinessProfile();
            return edit.editBusinessEmailAddress(args.input.email, args.input.businessId, args.input.notification, userId);
        },
        EditWhatsappContact (parent, args, context, info) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let edit = new EditBusinessProfile();
            return edit.editBusinessWhatsappContact(args.input.phoneNumber, args.input.businessId, args.input.notification, userId);
        },
        async EditBusinesslogo (parent, args, context, info) {

            let userId = context.authFunction(context.accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            const { filename, mimetype, createReadStream } = await args.input.file;

            let uploadLogo = new EditBusinessProfile();
            return uploadLogo.changeBusinessLogo(args.input.businessId, args.input.file, userId);
           
        },
        async EditBusinessCoverPhoto (parent, args, context, info) {

            let userId = context.authFunction(context.accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            const { filename, mimetype, createReadStream } = await args.input.file;

            let coverPhoto = new EditBusinessProfile();
            return coverPhoto.changeBusinessCoverPhoto(args.input.businessId, args.input.file, userId);
           
        },
        EditBusinessAddress (parent, args, context, info) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            args = args.input
            let editAddress = new EditBusinessProfile();
            return editAddress.changeBusinessAddress(args.streetNumber, args.streetId, args.closestBusStop, args.businessId, userId)
        },
        CreateBusinessReview(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            args = args.input

            let review = new BusinessReview();
            return review.CreateReview(userId, args.businessId, args.description, args.score)
        }
    }
}