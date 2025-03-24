const { Server: WebSocketServer } = require("socket.io")

const socket = {
    init: (server) => {
        const io = new WebSocketServer(server, {
            cors: {
                origin: "*"
            }
        })
        
        io.on("connection", (socket) => {
            console.log("Connected with the client")
        })

        return io
    }
}

module.exports = socket