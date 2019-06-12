const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()
app.use(morgan())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/'))

app.get('*', (res, req) => {
    req.sendFile(__dirname + '/index.html')
})
const PORT = 4050
app.listen(PORT, () => {
    console.log(`Listen on ${PORT} port😊`)
})