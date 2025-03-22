const s3Services = require("./aws/s3")
const dbService = require("./db")

const services = {
    db: null,
    
    init: () => {
        s3Services.init()
        services.db = dbService.init()
    },

    s3: s3Services,
}

module.exports = services