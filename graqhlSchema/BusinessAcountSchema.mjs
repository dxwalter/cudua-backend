"use strict";

import apolloServer from 'apollo-server';
const  { ApolloServer, gql } = apolloServer


export const typeDefs = gql`

    # This is the business return type for a registered business

    type BusinessAccount {
        id: ID!,
        businessId: String
        businessname: String
        address: String
        contact: String
        logo: String
        description: String
    }

    # response type
    interface responseType {
        code: String!
        success: Boolean!
        message: String!
    }

    type Query {
        GetBusinessDetails: BusinessAccount
    }

    # response type for CreateBusinessAccount mutation
    type CreateBusinessAccountResponse implements responseType {
        businessDetails: BusinessAccount
    }

    # CreateBusinessAccount input type
    input CreateBusinessAccountInput {
        businessName: String!
        businessUsername: String!
    }

    type Mutation {
        CreateBusinessAcount (create: CreateBusinessAccountInput ): CreateBusinessAccountResponse
    }

`;

export const resolvers = {
    Mutation: {
        CreateBusinessAcount(parent, args, context, info) {
            console.log(args)
        }
    }
}

