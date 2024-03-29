"use-strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const corsOptionsDelegate = require("./cors.config");

const cors = require("cors");

let { MONGODB_URI, port } = require("./config");

const app = express();

app.options("*", cors());
app.use(cors(corsOptionsDelegate));

const graphqlHTTP = require("express-graphql");
const { apolloUploadExpress } = require("apollo-upload-server");

const jwtAuthentication = require("./Controllers/jwtAuthController");

const typeDefs = require("./graqhlSchema/types");
const resolvers = require("./graqhlSchema/resolvers");

const { makeExecutableSchema } = require("@graphql-tools/schema");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

class startServer {
  constructor(app) {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: "50mb", extended: true }));

    app.use(
      "/v1",
      bodyParser.json(),
      apolloUploadExpress({ maxFileSize: 1000000000000000, maxFiles: 100 }),
      graphqlHTTP((req, res) => ({
        schema,
        graphiql: true,
        context: {
          accessToken: req.header("accessToken"),
          authFunction: jwtAuthentication,
        },
        tracing: true,
      }))
    );

    // mongoose config
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
    mongoose.set("useUnifiedTopology", true);

    const PORT = process.env.PORT || 80;

    mongoose.connect(MONGODB_URI).then(
      app.listen(PORT, () => console.log(`server starts @ port ${PORT}`)),
      (err, result) => {
        console.log(`An error occurred: ${err}`);
      }
    );
  }
}

let startSever = new startServer(app);
