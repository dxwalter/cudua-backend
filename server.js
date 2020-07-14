"use-strict";

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

let { DbConnection, port } = require('./config');


const app = express();

const graphqlHTTP = require('express-graphql');
const {apolloUploadExpress}  = require('apollo-upload-server');

const jwtAuthentication = require('./Controllers/jwtAuthController');

const typeDefs = require('./graqhlSchema/types');
const resolvers = require('./graqhlSchema/resolvers');

const { makeExecutableSchema } = require('@graphql-tools/schema');

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});


class startServer {
    constructor(app) {

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        

        app.use("/graphql", 
        bodyParser.json(), 
        apolloUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
        graphqlHTTP((req, res) => ({
            schema,
            graphiql: true,
            context: {
                accessToken: req.header("accessToken"),
                authFunction: jwtAuthentication
            },
            tracing: true
        })))

        // mongoose config
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);
        
        mongoose.connect(DbConnection).then(
            app.listen(3000, () => console.log(`server starts @ port 3000`)),  (err, result) => {
                console.log(`An error occurred: ${err}`)
            }
        )   
    }
}

let startSever = new startServer(app);