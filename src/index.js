const express = require('express')
const socketio = require('socket.io')
const path = require('path')
const http = require('http')

const app = express()

const port = process.env.PORT || 10000

const server = http.createServer(app)

const pubDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(pubDirectoryPath))

const io = socketio(server)

const sockets = {}
const socketIdUsers = {}


io.on('connection', (socket) => {
    console.log('New connection')
    sockets[socket.id] = socket;
    const usersCount = Object.keys(sockets).length
    socketIdUsers[socket.id] = usersCount;

    console.log(Object.keys(sockets))
    socket.emit('newConnection', socket.id + " - user " + usersCount)

    socket.on('sendMessage', async (inputMsg, callback) => {
        data = inputMsg.split(',')
        senderId = socketIdUsers[socket.id]
        toSocketId = data[0].trim();
        toUserId = socketIdUsers[toSocketId]
        message = data[1].trim()
        sockets[toSocketId].emit('message', { "sender": senderId, message, "toUser": toUserId })
    })
})


server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})