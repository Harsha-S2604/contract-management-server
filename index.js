require("dotenv").config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const express = require("express")
const http = require('http');
const cors = require("cors")

const contractRoutes = require("./routes/contracts")
const services = require("./services");

const app = express()
const server = http.createServer(app);
const port = process.env.SERVER_PORT || 3000

app.use(cors({
    origin: '*'
}))
app.use(express.json())
app.use('/contracts', contractRoutes)

server.listen(port, () => {
    services.init(server)
    global.appServices = services
})