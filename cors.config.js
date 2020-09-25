let whitelist = ['http://localhost:3333', 'https://cudua-ui.herokuapp.com'];
let corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE", } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false, methods: "GET,HEAD,PUT,PATCH,POST,DELETE" } // disable CORS for this request
    }
    console.log(corsOptions)
    callback(null, corsOptions) // callback expects two parameters: error and options
} 
module.exports = corsOptionsDelegate