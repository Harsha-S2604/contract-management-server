require("dotenv").config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const express = require("express")
const http = require('http');
const createError = require("http-errors")
const { Server: WebSocketServer } = require("socket.io");
const cors = require("cors")

const contractRoutes = require("./routes/contracts")
const { dbClient } = require("./config")

const app = express()
const server = http.createServer(app);
const port = process.env.SERVER_PORT || 3000

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    req.dbClient = dbClient
    next()
})
app.use('/contracts', contractRoutes)

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})