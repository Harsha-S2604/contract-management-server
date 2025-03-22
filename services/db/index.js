const pgp = require("pg-promise")({ schema: 'public' })

const db = {
    dbClient: null,

    init: () => {
        const dbOptions = {
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE
        }

        db.dbClient = pgp(dbOptions)

        return db.dbClient
    },

    getDBClient: () => {
        return db.dbClient
    }
}

module.exports = db