const express = require('express')
const socketio = require('socket.io')
const path = require('path')
const http = require('http')
const Filter = require('bad-words')
const { generateLocation, generateMessage } = require('../utilis/messages')
const { getUser, getUsersInRoom, addUser, removeUser } = require('../utilis/users')
const User = require('../users')
const getData = require('../users')



const app = express()

const port = process.env.PORT || 10000

const server = http.createServer(app)

const pubDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(pubDirectoryPath))

const io = socketio(server)

io.on('connection', (socket) => {
    console.log('New connection')

    socket.on('join', async (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        // After a user joins or leaves
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        // try {
        //     const userData = await User.find({})
        //     console.log(userData)
        // } catch (error) {
        //     console.log(error)
        // }


        // setInterval(() => {
        // let data = [];
        // for (let i = 0; i < 100; i++) {
        //     data.push(Math.random())
        // }

        // const data = await getData()
        // const finalData = data.map((element) => {
        //     element.value
        // })
        // socket.emit('message', finalData)
        // // messgae sent for all users joined in this group except user who joined now
        // // socket.broadcast.to(user.room).emit('message', generateMessage(user.username, `${user.username} has joined!`))
        // callback()
        // }, 1000)


        let inprogress = false;
        let finalData = []
        let data;
        setInterval(async () => {
            if (!inprogress) {
                inprogress = true
                if (!finalData.length) {
                    data = await getData()
                    finalData = data.map((element) => {
                        return element.value
                    })
                }
                socket.emit('message', finalData.splice(0, 100))
                inprogress = false
            }
            // messgae sent for all users joined in this group except user who joined now
            // socket.broadcast.to(user.room).emit('message', generateMessage(user.username, `${user.username} has joined!`))
            callback()
        }, 500)


    })

    socket.on('sendMessage', (inputMsg, callback) => {
        const filter = new Filter()
        if (filter.isProfane(inputMsg)) {
            return callback('Bad words are not allowed')
        }
        const user = getUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(user.username, inputMsg))
            return callback()
        }
    })

    socket.on('sendLocation', (coords) => {
        const url = `http://maps.google.com/maps?q=${coords.latitude},${coords.longitude}`
        const user = getUser(socket.id)
        if (user) {
            io.to(user.room).emit('location-message', generateLocation(user.username, url))
        }
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            // After a user joins or leaves
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
        }
    }
    )
})


server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})