

const graphql = require("graphql");
const  {
            GraphQLObjectType, 
            GraphQLString, 
            GraphQLSchema, 
            buildSchema, 
            GraphQLNonNull, 
            GraphQLID, 
            GraphQLInt
       } = graphql;

const UserType = new GraphQLObjectType({
    name: 'inputType',
    description: "This is a user definition type",
    fields: {
        id: {type: GraphQLID},
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        displaPicture: {type: GraphQLString},
        businessId: {type: GraphQLString}
    }
});


const outputType = new GraphQLObjectType({
    name: 'outputType',
    description: "This is a user output type",
    fields: {
        userId: {type: GraphQLID},
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        displaPicture: {type: GraphQLString},
        businessId: {type: GraphQLString},
        businessData: {type: GraphQLString},
        accessToken: {type: GraphQLString},
        requestStatus: {type: GraphQLInt},
        requestMessage: {type: GraphQLString}
    }
});


const userQuery = new GraphQLObjectType ({
    name: 'Query',
    fields : {
        loginUser: {
            type : outputType,
            args: {
                email: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve (parent, args, context) {
                // code to get 
                let loginUser = new LoginUser(args);
                return loginUser.AuthenticateUser();
            }
        },
        recoverPassword: {
            type: outputType,
            args: {email: {type: GraphQLNonNull(GraphQLString)}},
            resolve (parent, args) {
                let recoverPassword = new RecoverPassword();
                return recoverPassword.recoverPasswordCheck(args);
            }
        }
        
    }
});

const userMutation = new GraphQLObjectType({
    name: "Mutation",
    fields : {
        createUser : {
            type: outputType,
            args: {
                fullname: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve (parent, args, context) {
                let createUser = new CreateUser(args);
                return createUser.validateUserInput();
            }
        },
        createNewPassword : {
            type: outputType,
            args: {
                password: {type: GraphQLNonNull(GraphQLString)},
                secret: {type: GraphQLNonNull(GraphQLString)},
                userId: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve (parent, args, context) {
                let newPassword = new RecoverPassword();
                return newPassword.createNewPassword(args);
            }
        }
    }
})

module.exports = new GraphQLSchema({ query: userQuery, mutation: userMutation })