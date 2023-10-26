const dotenv = require('dotenv');
dotenv.config();

let whitelist = [process.env.LOCAL_FRONT_END, process.env.LIVE_APP, process.env.FRONT_END_KOEKO];

let corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    // if (whitelist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true} // reflect (enable) the requested origin in the CORS response
    // } else {
    //   corsOptions = { origin: false} // disable CORS for this request
    // }
    
    callback(null, corsOptions) // callback expects two parameters: error and options
} 
module.exports = corsOptionsDelegate