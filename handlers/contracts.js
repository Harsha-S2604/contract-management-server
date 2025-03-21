const CONTRACT_TABLE_NAME = "contracts"

const addContract = async (req, res) => {
    try {
        const { dbClient } = req
        const { contract } = req.body
        const insertQuery = `INSERT INTO ${CONTRACT_TABLE_NAME}(client_name, status, contract_data) ` + "VALUES(${clientName}, ${status}, ${contractData})"
        await dbClient.query(insertQuery, contract)
        const responseObject = {
            status: "OK"
        }
        res.send(responseObject)
    } catch (error) {
        console.error("[Contract]:: Failed to add the contract", error)
        const responseObject = {
            status: "ERROR",
            message: "Something went wrong, Please try again later"
        }
        res.send(responseObject)
    }
}

const deleteContract = async (req, res) => {
    try {
        const { dbClient } = req
        const contractId = req.params.id
        const deleteQuery = `DELETE FROM ${CONTRACT_TABLE_NAME} WHERE id=${contractId}`
        await dbClient.query(deleteQuery)
        const responseObject = {
            status: "OK"
        }
        res.send(responseObject)
    } catch (error) {
        console.error("[Contract]:: Failed to delete the contract", error)
        const responseObject = {
            status: "ERROR",
            message: "Something went wrong, Please try again later"
        }
        res.send(responseObject)
    }
}

const getContractsByField = async (req, res) => {
    try {
        const { dbClient } = req
        const { field } = req.body
        const value = req?.params?.value || ''

        let searchQuery = ''
        if (field == "id") {
            searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE id='${value}'`
        } else if (field == "clientName") {
            searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE (lower(client_name) LIKE '%${value}%')`
        }

        const contracts = await dbClient.query(searchQuery)

        const responseObject = {
            status: "OK",
            contracts
        }
        res.send(responseObject)
    } catch (error) {
        console.error("[Contract]:: Failed to get the contracts", error)
        const responseObject = {
            status: "ERROR",
            message: "Something went wrong, Please try again later",
            contracts: []
        }
        res.send(responseObject)
    }
}

const getContracts = async (req, res) => {
    try {
        const { dbClient } = req
        const selectQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME}`
        const contracts = await dbClient.query(selectQuery)
        const responseObject = {
            status: "OK",
            contracts
        }
        res.send(responseObject)
    } catch (error) {
        console.error("[Contract]:: Failed to get the contracts", error)
        const responseObject = {
            status: "ERROR",
            message: "Something went wrong, Please try again later",
            contracts: []
        }
        res.send(responseObject)
    }
}

const getContractsById = async (req, res) => {
    try {
        const { dbClient } = req
        const id = req?.params?.id|| ''
        const searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE id='${id}'`
        const contracts = await dbClient.query(searchQuery)

        const responseObject = {
            status: "OK",
            contracts
        }
        res.send(responseObject)

    }  catch (error) {
        console.error("[Contract]:: Failed to get the contracts", error)
        const responseObject = {
            status: "ERROR",
            message: "Something went wrong, Please try again later",
            contracts: []
        }
        res.send(responseObject)
    }
}

const getContractsByClientName = async (req, res) => {
    try {
        const { dbClient } = req
        const clientName = req?.params?.clientName?.toLowerCase() || ''
        const searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE (lower(client_name) LIKE '%${clientName}%')`
        const contracts = await dbClient.query(searchQuery)

        const responseObject = {
            status: "OK",
            contracts
        }
        res.send(responseObject)

    }  catch (error) {
        console.error("[Contract]:: Failed to get the contracts", error)
        const responseObject = {
            status: "ERROR",
            message: "Something went wrong, Please try again later",
            contracts: []
        }
        res.send(responseObject)
    }
}

const getContractsByStatus = async (req, res) => {
    try {
        const { dbClient } = req
        const status = req?.params?.status
        const searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE status='${status}'`
        const contracts = await dbClient.query(searchQuery)
        const responseObject = {
            status: "OK",
            contracts
        }
        res.send(responseObject)

    }  catch (error) {
        console.error("[Contract]:: Failed to get the contracts", error)
        const responseObject = {
            status: "ERROR",
            message: "Something went wrong, Please try again later",
            contracts: []
        }
        res.send(responseObject)
    }
}

module.exports = {
    addContract,
    getContracts,
    deleteContract,
    getContractsByClientName,
    getContractsByStatus,
    getContractsById,
    getContractsByField
}