"use-strict";

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();

const graphqlHTTP = require('express-graphql');
const { buildSchema }  = require('graphql')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

        app.use("/graphql", bodyParser.json(), graphqlHTTP((req, res) => ({
            schema,
            graphiql: true,
            context: {
                accessToken: req.header("accessToken"),
                authFunction: jwtAuthentication
            }
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