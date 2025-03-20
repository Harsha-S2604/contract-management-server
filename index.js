const express = require("express")
const createError = require('http-errors');
const contractRoutes = require("./routes/contracts")

const app = express()
const port = 3000

app.use('/contracts', contractRoutes)
app.use(function(req, res, next) {
  next(createError(404));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})