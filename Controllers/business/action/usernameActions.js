"use-strict";


let BusinessController = require('../BusinessController')


module.exports = class UsernameActions extends BusinessController {
    constructor () {
        super();
    }

    async CheckUsernameExistence (usernameInput) {
        let username = usernameInput.toLowerCase();

        if (username.length > 3) {
            let usernameCheck = await this.checkUsernameExists(username);
            
            if (usernameCheck.error == true) {
                return {
                    existence: 0,
                    code: 500,
                    success: false,
                    message: `An error occurred: ${usernameCheck.message}`
                }
            }

            if (usernameCheck.result == false) {
                return {
                    existence: 0,
                    code: 200,
                    success: true,
                    message: `The username '${username}' does not exists`
                }
            }

            return {
                existence: 1,
                code: 200,
                success: true,
                message: `The username '${username}' exists`
            }
        }

    }
}