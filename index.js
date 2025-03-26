require("dotenv").config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const express = require("express")
const http = require('http');
const https = require('https');
const cors = require("cors")
const fs = require('fs')
const path = require('path')

const contractRoutes = require("./routes/contracts")
const services = require("./services");

const keyPath = path.resolve(__dirname, './certs/selfsigned.key')
const certPath = path.resolve(__dirname, './certs/selfsigned.crt')

const key = fs.readFileSync(keyPath)
const cert = fs.readFileSync(certPath)

const options = {
    key: key,
    cert: cert
}

const app = express()
app.use(cors({origin: "*"}))
app.use(express.json())
app.use('/contracts', contractRoutes)

const server = https.createServer(options, app);
const port = process.env.SERVER_PORT || 3000

server.listen(port, () => {
    const protocol = server instanceof https.Server
    console.log("protocol", protocol)
    services.init(server)
    global.appServices = services
})