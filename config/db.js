const pgp = require("pg-promise")({ schema: 'public' })
let dbClient = null

function setupDB() {
    const dbOptions = {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE
    }

    const db = pgp(dbOptions)
    return db
}

function getDBInstance() {
    return dbClient
}

module.exports = {
    setupDB,
    getDBInstance
}