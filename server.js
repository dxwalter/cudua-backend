"use-strict";

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { buildSchema }  = require('graphql');
require('dotenv/config');

const express = require('express');
const graphqlHTTP = require('express-graphql');

const typeDefs = require('./graqhlSchema/types');
const resolvers = require('./graqhlSchema/resolvers');

const { makeExecutableSchema } = require('@graphql-tools/schema');

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const app = express();

class startServer {
    constructor(app) {

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.use("/graphql", graphqlHTTP(req => ({
            schema,
            graphiql: true,
        })))

        // mongoose config
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);

        // connect to db
        mongoose.connect(process.env.DB_CONNECTION).then(
            app.listen(3000, () => console.log('server starts @ port 3000')),  (err) => {
                console.log(`An error occured while connecting to db ${err}`)
            }

        )
    }
}

let startSever = new startServer(app);