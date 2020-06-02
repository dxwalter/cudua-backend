"use-strict";

import {createRequire} from 'module'
import express from 'express';
import mongoose from 'mongoose';
import graphqlHTTP from "express-graphql";
import bodyParser from 'body-parser';
import { buildSchema }  from 'graphql';
import dotenv from 'dotenv';
dotenv.config


import {schemaFiles} from './graqhlSchema/AllSchema.mjs';
console.log(schema);


// Construct a schema, using GraphQL schema languag

let schemaData = {
    'schema': schema
}

class startServer {
    constructor(app) {

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.use("/graphql", graphqlHTTP(req => ({
            schema: schemaData.schema,
            graphiql: true,
            context: { req: req }
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