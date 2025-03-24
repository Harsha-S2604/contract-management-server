const express = require("express")
const contractHandlers = require("../handlers/contracts")

const router = express.Router()

router.get("/", contractHandlers.getContracts)
router.get("/id/:id", contractHandlers.getContractsById)
router.get("/search/:key/:value", contractHandlers.getContractsByField)
router.get("/status/:status", contractHandlers.getContractsByStatus)
router.get("/client-name/:clientName", contractHandlers.getContractsByClientName)

router.put("/update", contractHandlers.updateContract)

router.post("/create", contractHandlers.addContract)

router.delete("/delete/:id", contractHandlers.deleteContract)

module.exports = router;