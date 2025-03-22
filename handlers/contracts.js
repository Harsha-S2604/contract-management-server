const config = require("../config")

const CONTRACT_TABLE_NAME = "contracts"
const BUCKET_NAME = config.s3.buckets["contracts"]

const addContract = async (req, res) => {
    try {
        const { contract } = req.body
        contract.file.fileName = `${contract.clientName}/${contract.file.fileName}`
        const uploadStatus = await appServices.s3.uploadFile(BUCKET_NAME, contract.file)
        if (uploadStatus.status == "ERROR") {
            throw new Error("Failed to upload the file")
        }

        const insertQuery = `INSERT INTO ${CONTRACT_TABLE_NAME}(client_name, status, contract_data) ` + "VALUES(${clientName}, ${status}, ${contractData})"
        await appServices.db.query(insertQuery, contract)
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
        const contractId = req.params.id
        const searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE id='${contractId}'`
        const contracts = await appServices.db.query(searchQuery)
        if (!contracts || !contracts.length) {
            throw new Error("No such contract exists")
        }

        const contract = contracts[0]
        const fileName = `${contract.client_name}/${contract.contract_data}`
        const deleteResponse = await appServices.s3.deleteFile(BUCKET_NAME, fileName)
        if (deleteResponse.status == "ERROR") {
            throw new Error("Failed to delete the file")
        }

        const deleteQuery = `DELETE FROM ${CONTRACT_TABLE_NAME} WHERE id=${contractId}`
        await appServices.db.query(deleteQuery)
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

const updateContract = async (req, res) => {
    try {
        let { id, key, value } = req.body

        if (key === "contract_data") {
            const searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE id='${id}'`
            const contracts = await appServices.db.query(searchQuery)
            if (!contracts || !contracts.length) {
                throw new Error("No such contract exists")
            }

            const contract = contracts[0]
            const fileToBeReplacedWith = `${contract.client_name}/${contract.contract_data}`
            const originalFileName = value.fileName
            value.fileName = `${contract.client_name}/${value.fileName}`

            const uploadPromise = appServices.s3.uploadFile(BUCKET_NAME, value)
            const promises = [uploadPromise]

            if (fileToBeReplacedWith !== value.fileName) {
                const deletePromise = appServices.s3.deleteFile(BUCKET_NAME, fileToBeReplacedWith)
                promises.push(deletePromise)
            }

            const [uploadResponse, deleteResponse] = await Promise.all(promises)
            console.log("originalFileName", originalFileName, value)

            if (uploadResponse.status == "ERROR") {
                throw new Error("Failed to upload the file")
            }

            value = originalFileName
        }
        
        const updateQuery = `UPDATE ${CONTRACT_TABLE_NAME} SET ${key}='${value}' WHERE id='${id}'`
        await appServices.db.query(updateQuery)

        const responseObject = {
            status: "OK"
        }

        res.send(responseObject)
    } catch (error) {
        console.error("[Contract]:: Failed to update the contract", error)
        const responseObject = {
            status: "ERROR",
            message: "Something went wrong, Please try again later"
        }
        res.send(responseObject)
    }
}

const getContractsByField = async (req, res) => {
    try {
        const { field } = req.body
        const value = req?.params?.value || ''

        let searchQuery = ''
        if (field == "id") {
            searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE id='${value}'`
        } else if (field == "clientName") {
            searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE (lower(client_name) LIKE '%${value}%')`
        }

        const contracts = await appServices.db.query(searchQuery)

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
        const selectQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME}`
        const contracts = await appServices.db.query(selectQuery)
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
        const id = req?.params?.id|| ''
        const searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE id='${id}'`
        const contracts = await appServices.db.query(searchQuery)

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
        const clientName = req?.params?.clientName?.toLowerCase() || ''
        const searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE (lower(client_name) LIKE '%${clientName}%')`
        const contracts = await appServices.db.query(searchQuery)

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
        const status = req?.params?.status
        const searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE status='${status}'`
        const contracts = await appServices.db.query(searchQuery)
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
    getContractsByField,
    updateContract
}