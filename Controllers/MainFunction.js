const Sengrid  = require('@sendgrid/mail');
Sengrid.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = class FunctionRepo {

    constructor () {}
    
    sendEmail (emailObj) {
        try {
            return Sengrid.send(emailObj);   
        } catch (error) {  
            console.log(error)            
        }
    }

    MakeFirstLetterUpperCase (string) {
        return string[0].toUpperCase() +  string.slice(1);
    }
}