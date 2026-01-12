const express = require('express')
const path = require('path')

const app = express()
const port = 3000

const categories = require(path.join(__dirname, "data", "categories.json"));

app.use(express.static('public'))

app.post('/categories', getCategories)
    async function getCategories (req, res) {
    res.send(categories)
}


const httpServer = app.listen(port, appListen)
function appListen () {
    console.log(`API Server Listening on: http://0.0.0.0:${port}`)
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    httpServer.close()
    process.exit(0);
}