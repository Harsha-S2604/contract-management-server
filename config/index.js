const { setupDB } = require("./db")

let dbClient = null

function setupServerConfig() {
    dbClient = setupDB();
}

(() => {
    setupServerConfig()
})();

module.exports = {
    dbClient
}