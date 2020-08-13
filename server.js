"use-strict";

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const cors = require('cors');

let { MONGODB_URI, port } = require('./config');

require('heroku-self-ping').default(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`);


const app = express();

app.use(function(req, res, next) {
    console.log(JSON.stringify(req.headers))
    next()
})

let whitelist = ['http://localhost:3000', 'https://www.cudua.com'];
let corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
}

app.options('*', cors());
app.use(cors(corsOptions))


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

        app.use("/v1",
            bodyParser.json(), 
                apolloUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
                    graphqlHTTP((req, res) => 
                        ({
                            schema,
                            graphiql: true,
                            context: {
                                accessToken: req.header("accessToken"),
                                authFunction: jwtAuthentication
                            },
                            tracing: true
                        })
                    )
        )

        // mongoose config
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);

        const PORT = process.env.PORT || 3000;

        mongoose.connect(MONGODB_URI).then(
            app.listen(PORT, () => console.log(`server starts @ port ${PORT}`)),  (err, result) => {
                console.log(`An error occurred: ${err}`)
            }
        ) 


    }
}

let startSever = new startServer(app);