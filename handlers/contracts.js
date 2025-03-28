const config = require("../config")

const CONTRACT_TABLE_NAME = "contracts"
const BUCKET_NAME = config.s3.buckets["contracts"]

const addContract = async (req, res) => {
    try {
        const page = req.query.page || 1
        const pageSize = req.query.pageSize || 5

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

        emitSocketEventForContracts(page, pageSize)
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
        const page = req.query.page || 1
        const pageSize = req.query.pageSize || 5

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
            throw new Error("Failed to delete the file from S3")
        }

        const deleteQuery = `DELETE FROM ${CONTRACT_TABLE_NAME} WHERE id=${contractId}`
        await appServices.db.query(deleteQuery)
        const responseObject = {
            status: "OK"
        }
        emitSocketEventForContracts(page, pageSize)
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
        const page = req.query.page || 1
        const pageSize = req.query.pageSize || 5

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

        emitSocketEventForContracts(page, pageSize)
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
        const key = req?.params?.key
        const value = req?.params?.value || ''

        const page = req.query.page || 1
        const pageSize = req.query.pageSize || 5
        const offset = (page - 1) * pageSize

        let searchQuery = ''
        let countQuery = ''

        if (key == "id") {
            countQuery = `SELECT COUNT(*) FROM ${CONTRACT_TABLE_NAME} WHERE id='${value}'`
            searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE id='${value}' ORDER BY id LIMIT ${pageSize} OFFSET ${offset};`
        } else if (key == "clientName") {
            countQuery = `SELECT COUNT(*) FROM ${CONTRACT_TABLE_NAME} WHERE (lower(client_name) LIKE '%${value}%')`
            searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE (lower(client_name) LIKE '%${value}%') ORDER BY id LIMIT ${pageSize} OFFSET ${offset};`
        } else if (key == "status") {
            countQuery = `SELECT COUNT(*) FROM ${CONTRACT_TABLE_NAME} WHERE status='${value}'`
            searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE status='${value}' ORDER BY id LIMIT ${pageSize} OFFSET ${offset};`
        }

        const contractPromise = appServices.db.query(searchQuery)
        const countPromise = appServices.db.query(countQuery)

        const [contracts, count] = await Promise.all([contractPromise, countPromise])

        const responseObject = {
            status: "OK",
            contracts,
            count: parseInt(count[0].count)
        }
        res.send(responseObject)
    } catch (error) {
        console.error("[Contract]:: Failed to get the contracts", error)
        const responseObject = {
            status: "ERROR",
            message: "Something went wrong, Please try again later",
            contracts: [],
            count: 0
        }
        res.send(responseObject)
    }
}

const getContracts = async (req, res) => {
    try {
        const page = req.query.page || 1
        const pageSize = req.query.pageSize || 5
        const offset = (page - 1) * pageSize

        const countQuery = `SELECT COUNT(*) FROM ${CONTRACT_TABLE_NAME}`
        const selectQueryPage = `SELECT * FROM ${CONTRACT_TABLE_NAME} ORDER BY id LIMIT ${pageSize} OFFSET ${offset}`

        const countPromise = appServices.db.query(countQuery)
        const contractsPromise = appServices.db.query(selectQueryPage)
        const [count, contracts] = await Promise.all([countPromise, contractsPromise])

        const responseObject = {
            status: "OK",
            contracts,
            count: parseInt(count[0].count)
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
        const id = req?.params?.id || ''
        const searchQuery = `SELECT * FROM ${CONTRACT_TABLE_NAME} WHERE id='${id}'`
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

const downloadFile = async (req, res) => {
    try {
        const { clientName, fileName } = req.params
        const file = `${clientName}/${fileName}`
        const fileResponse = await appServices.s3.getFile(BUCKET_NAME, file)
        if (fileResponse.status == "ERROR") {
            throw new Error("Failed to get the file")
        }

        const { fileObj } = fileResponse

        res.setHeader('Content-Type', fileObj.ContentType)
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
        res.setHeader('Content-Length', fileObj.ContentLength)

        fileObj.Body.pipe(res)
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

const emitSocketEventForContracts = async (page, pageSize) => {
    let responseObject = {}
    try {
        const offset = (page - 1) * pageSize

        const countQuery = `SELECT COUNT(*) FROM ${CONTRACT_TABLE_NAME}`
        const selectQueryPage = `SELECT * FROM ${CONTRACT_TABLE_NAME} ORDER BY id LIMIT ${pageSize} OFFSET ${offset}`

        const countPromise = appServices.db.query(countQuery)
        const contractsPromise = appServices.db.query(selectQueryPage)
        const [count, contracts] = await Promise.all([countPromise, contractsPromise])

        responseObject = {
            status: "OK",
            contracts,
            count: parseInt(count[0].count)
        }

    } catch (error) {
        responseObject = {
            status: "ERROR",
            contracts: [],
            count: 0
        }

    }

    appServices.socket.emit("dataUpdated", responseObject)

    
}



module.exports = {
    addContract,
    getContracts,
    deleteContract,
    getContractsByClientName,
    getContractsByStatus,
    getContractsById,
    getContractsByField,
    updateContract,
    downloadFile
}