"use-strict";

const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require("express-graphql");
const bodyParser = require('body-parser');
var { buildSchema } = require('graphql');
const schema = require('./graqhlSchema/UserSchema');
require('dotenv').config();


// Construct a schema, using GraphQL schema languag

let schemaData = {
    'schema': schema
}


const app = express();


class startServer {
    constructor(app, schemaData) {

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.use("/graphql", graphqlHTTP({
            schema: schemaData.schema,
            graphiql: true
        }))

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

let startSever = new startServer(app, schemaData);