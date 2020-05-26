"use-strict";

const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require("express-graphql");
const bodyParser = require('body-parser');
const schema = require('./graqhlSchema/AllSchema');

require('dotenv').config();
const app = express();


class startServer {
    constructor(app) {

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.use("/graphql", graphqlHTTP({
            schema: schema
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

let startSever = new startServer(app);