const express = require("express")
const contractHandlers = require("../handlers/contracts")

const router = express.Router()

router.get("/", contractHandlers.getContracts)
router.get("/client-name/:clientName", contractHandlers.getContractsByClientName)

router.post("/create", contractHandlers.addContract)

router.delete("/delete/:id", contractHandlers.deleteContract)

module.exports = router;