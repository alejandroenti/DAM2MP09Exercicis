const express = require('express')

const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/categories', getCategories)
    async function getCategories (req, res) {
    res.send(`Hello World`)
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