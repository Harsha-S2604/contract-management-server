const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Contracter")
})

module.exports = router;