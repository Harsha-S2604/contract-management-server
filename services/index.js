const s3Services = require("./aws/s3")
const dbService = require("./db")
const socketService = require("./socketService")

const services = {
    db: null,
    socket: null,
    
    init: (server) => {
        s3Services.init()
        services.db = dbService.init()
        services.socket = socketService.init(server)
    },

    s3: s3Services,
}

module.exports = services